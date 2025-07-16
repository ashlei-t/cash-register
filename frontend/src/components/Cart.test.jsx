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
    { id: 4, code: 'CF1', name: 'Coffee', price: 11.23, quantity: 2 },
  ],
  total: 22.46
};

const mockCartWithOneItem = {
  items: [
    { id: 4, code: 'CF1', name: 'Coffee', price: 11.23, quantity: 1 }
  ],
  total: 11.23
};

describe('Cart Component', () => {
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
    // test('displays loading state initially', () => {
    //   renderCart();
    //   expect(screen.getByText('Loading...')).toBeInTheDocument();
    // });

    test('fetches items and cart data on mount', async () => {
      renderCart();

      await waitFor(() => expect(api.fetchItems).toHaveBeenCalledTimes(1));
      await waitFor(() => expect(api.fetchCart).toHaveBeenCalledWith('test-cart-123'));
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

});
