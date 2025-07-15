// Cart.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import * as api from '../api/index';

// Mock the API functions
jest.mock('../api/index', () => ({
  fetchItems: jest.fn(),
  fetchCart: jest.fn(),
  addItemToCart: jest.fn(),
  updateCartItem: jest.fn(),
  removeCartItem: jest.fn(),
  clearCart: jest.fn(),
}));

// Mock useParams to return a test cartId
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
}));

const mockItems = [
  { id: 1, code: 'coffee-1', name: 'Espresso', price: 2.50 },
  { id: 2, code: 'coffee-2', name: 'Latte', price: 3.50 },
];

const mockEmptyCart = {
  items: [],
  total: 0
};

const mockCartWithItems = {
  items: [
    { id: 1, code: 'coffee-1', name: 'Espresso', price: 2.50, quantity: 2 }
  ],
  total: 5.00
};

describe('Cart Component - TDD Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useParams to return test cartId
    mockUseParams.mockReturnValue({ cartId: 'test-cart-123' });

    // Default successful responses
    api.fetchItems.mockResolvedValue({ data: mockItems });
    api.fetchCart.mockResolvedValue({ data: mockEmptyCart });
  });

  const renderCart = () => {
    return render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
  };

  describe('Initial Loading', () => {
    test('should display loading state initially', () => {
      renderCart();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should fetch items and cart data on mount', async () => {
      renderCart();

      await waitFor(() => {
        expect(api.fetchItems).toHaveBeenCalledTimes(1);
        expect(api.fetchCart).toHaveBeenCalledWith('test-cart-123');
      });
    });

    test('should display items after loading', async () => {
      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Espresso')).toBeInTheDocument();
        expect(screen.getByText('Latte')).toBeInTheDocument();
      });
    });

    test('should not fetch data when cartId is undefined', async () => {
      mockUseParams.mockReturnValue({ cartId: undefined });

      renderCart();

      // Wait a bit to ensure no API calls are made
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(api.fetchItems).not.toHaveBeenCalled();
      expect(api.fetchCart).not.toHaveBeenCalled();
    });
  });

  describe('Cart Display', () => {
    test('should show empty cart message when cart is empty', async () => {
      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      });
    });

    test('should display cart items when cart has items', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Espresso - €2.5 x 2')).toBeInTheDocument();
        expect(screen.getByText('Total: €5')).toBeInTheDocument();
      });
    });

    test('should show quantity for each item', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });

      renderCart();

      await waitFor(() => {
        // Should show quantity of 2 for espresso, 0 for latte
        expect(screen.getByText('2')).toBeInTheDocument(); // Espresso quantity
        expect(screen.getByText('0')).toBeInTheDocument(); // Latte quantity
      });
    });
  });

  describe('Add to Cart', () => {
    test('should call addItemToCart when adding item with 0 quantity', async () => {
      api.addItemToCart.mockResolvedValue();
      api.fetchCart.mockResolvedValueOnce({ data: mockEmptyCart })
                   .mockResolvedValueOnce({ data: mockCartWithItems });

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Espresso')).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText('+');
      fireEvent.click(addButtons[0]); // Click + for Espresso

      await waitFor(() => {
        expect(api.addItemToCart).toHaveBeenCalledWith('test-cart-123', 'coffee-1', 1);
        expect(api.fetchCart).toHaveBeenCalledTimes(2); // Initial + after add
      });
    });

    test('should call updateCartItem when adding item with existing quantity', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });
      api.updateCartItem.mockResolvedValue();

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Espresso')).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText('+');
      fireEvent.click(addButtons[0]); // Click + for Espresso (already has quantity 2)

      await waitFor(() => {
        expect(api.updateCartItem).toHaveBeenCalledWith('test-cart-123', 'coffee-1', 3);
      });
    });
  });

  describe('Remove from Cart', () => {
    test('should not remove item when quantity is 0', async () => {
      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Espresso')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByText('-');
      fireEvent.click(removeButtons[1]); // Click - for Latte (quantity 0)

      expect(api.removeCartItem).not.toHaveBeenCalled();
      expect(api.updateCartItem).not.toHaveBeenCalled();
    });

    test('should call updateCartItem when reducing quantity > 1', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });
      api.updateCartItem.mockResolvedValue();

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Espresso')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByText('-');
      fireEvent.click(removeButtons[0]); // Click - for Espresso (quantity 2)

      await waitFor(() => {
        expect(api.updateCartItem).toHaveBeenCalledWith('test-cart-123', 'coffee-1', 1);
      });
    });

    test('should call removeCartItem when reducing quantity to 0', async () => {
      const cartWithOneItem = {
        items: [{ id: 1, code: 'coffee-1', name: 'Espresso', price: 2.50, quantity: 1 }],
        total: 2.50
      };

      api.fetchCart.mockResolvedValue({ data: cartWithOneItem });
      api.removeCartItem.mockResolvedValue();

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Espresso')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByText('-');
      fireEvent.click(removeButtons[0]); // Click - for Espresso (quantity 1)

      await waitFor(() => {
        expect(api.removeCartItem).toHaveBeenCalledWith('test-cart-123', 'coffee-1');
      });
    });
  });

  describe('Clear Cart', () => {
    test('should clear cart when clear button is clicked', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });
      api.clearCart.mockResolvedValue();

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Clear Cart')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Clear Cart'));

      await waitFor(() => {
        expect(api.clearCart).toHaveBeenCalledWith('test-cart-123');
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      api.fetchItems.mockRejectedValue(new Error('API Error'));

      renderCart();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load data', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('should handle add to cart errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      api.addItemToCart.mockRejectedValue(new Error('Add to cart failed'));

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Espresso')).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText('+');
      fireEvent.click(addButtons[0]);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to add to cart', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });
});
