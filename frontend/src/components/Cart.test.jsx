import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useParams } from 'react-router';
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

// Mock react-router useParams for v7
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

const mockUseParams = useParams;

// Test data
const mockItems = [
  { id: 2, code: 'GR1', name: 'Green Tea', price: 3.11 },
  { id: 3, code: 'SR1', name: 'Strawberries', price: 5.00 },
  { id: 4, code: 'CF1', name: 'Coffee', price: 11.23 },
];

const mockEmptyCart = {
  items: [],
  total: 0
};

const mockCartWithItems = {
  items: [
    { id: 2, code: 'GR1', name: 'Green Tea', price: 3.11, quantity: 2 },
  ],
  total: 3.11
};

const mockCartWithOneItem = {
  items: [
    { id: 2, code: 'GR1', name: 'Green Tea', price: 3.11, quantity: 1 }
  ],
  total: 3.11
};

describe('Cart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useParams to return test cartId
    mockUseParams.mockReturnValue({ cartId: 123 });
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
    // test('displays loading state initially', () => {
    //   renderCart();
    //   expect(screen.getByText('Loading...')).toBeInTheDocument();
    // });

    test('fetches items and cart data on mount', async () => {
      renderCart();

      await waitFor(() => expect(api.fetchItems).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(api.fetchCart).toHaveBeenCalledWith(123));
    });

    test('displays items after loading', async () => {
      renderCart();

      await screen.findByText('Coffee');
      await screen.findByText('Strawberries');
      await screen.findByText('Green Tea');
    });

    test('does not fetch data when cartId is undefined', async () => {
      mockUseParams.mockReturnValue({ cartId: undefined });
      renderCart();

      // Wait a bit to ensure no API calls are made
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(api.fetchItems).not.toHaveBeenCalled();
      expect(api.fetchCart).not.toHaveBeenCalled();
    });
  });

  describe('Cart Display', () => {
    test('displays cart items when cart has items', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });
      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Green Tea')).toBeInTheDocument();
      });
      await waitFor(() => {
        expect(screen.getByText((content) => content.includes('2 x Green Tea'))).toBeInTheDocument();
      });

    });
  });

  describe('Add to Cart', () => {
    test('calls addItemToCart when adding item with 0 quantity', async () => {
      api.addItemToCart.mockResolvedValue();
      api.fetchCart.mockResolvedValueOnce({ data: mockEmptyCart })
                   .mockResolvedValueOnce({ data: mockCartWithItems });

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Green Tea')).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText('+');
      fireEvent.click(addButtons[0]); // Click + for Green Tea

      await waitFor(() => {
        expect(api.addItemToCart).toHaveBeenCalledWith(123, 'GR1', 1);
        expect(api.fetchCart).toHaveBeenCalledTimes(2); // Initial + after add
      });
    });

    test('calls updateCartItem when adding item with existing quantity', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });
      api.updateCartItem.mockResolvedValue();

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Green Tea')).toBeInTheDocument();
      });

      const addButtons = screen.getAllByText('+');
      fireEvent.click(addButtons[0]); // Click + for Green Tea (already has quantity 2)

      await waitFor(() => {
        expect(api.updateCartItem).toHaveBeenCalledWith(123, 'GR1', 3);
      });
    });
  });

  describe('Remove from Cart', () => {
    test('calls updateCartItem when reducing quantity > 1', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });
      api.updateCartItem.mockResolvedValue();

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Green Tea')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByText('-');
      fireEvent.click(removeButtons[0]);

      await waitFor(() => {
        expect(api.updateCartItem).toHaveBeenCalledWith(123, 'GR1', 1);
      });
    });

    test('calls removeCartItem when reducing quantity to 0', async () => {
      api.fetchCart.mockResolvedValue({ data: { items: [{ id: 2, code: 'GR1', name: 'Green Tea', price: 3.11, quantity: 1 }], total: 3.11 } });
      api.removeCartItem.mockResolvedValue();

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Green Tea')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByText('-');
      fireEvent.click(removeButtons[0]);

      await waitFor(() => {
        expect(api.removeCartItem).toHaveBeenCalledWith(123, 'GR1');
      });
    });
  });

  // Clear Cart
  describe('Clear Cart', () => {
    test('calls clearCart when clear button is clicked', async () => {
      api.fetchCart.mockResolvedValue({ data: mockCartWithItems });
      api.clearCart.mockResolvedValue();

      renderCart();

      await waitFor(() => {
        expect(screen.getByText('Clear Cart')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Clear Cart'));

      await waitFor(() => {
        expect(api.clearCart).toHaveBeenCalledWith(123);
      });
    });
  });

  // Error Handling
  describe('Error Handling', () => {
    test('handles fetchItems error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      api.fetchItems.mockRejectedValue(new Error('API Error'));

      renderCart();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });
});
