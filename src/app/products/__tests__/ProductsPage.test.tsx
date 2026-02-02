import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductsPage from '../page';
import localeReducer from '@/redux/slices/localeSlice';

// Mock fetch
global.fetch = jest.fn();

const mockStore = configureStore({
  reducer: {
    locale: localeReducer,
  },
});

describe('ProductsPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should render products page', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [], // Featured products
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          products: [],
          total: 0,
          page: 1,
          totalPages: 1,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [], // Categories
      });

    render(
      <Provider store={mockStore}>
        <ProductsPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/products/i)).toBeInTheDocument();
    });
  });

  it('should display featured products', async () => {
    const mockFeaturedProducts = [
      {
        _id: '1',
        name: 'Copper Hawan Kund',
        nameHi: 'तांबे का हवन कुंड',
        price: 2499,
        images: ['image1.jpg'],
        rating: 4.5,
        isFeatured: true,
      },
    ];

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFeaturedProducts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          products: [],
          total: 0,
          page: 1,
          totalPages: 1,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    render(
      <Provider store={mockStore}>
        <ProductsPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Copper Hawan Kund')).toBeInTheDocument();
      expect(screen.getByText(/featured/i)).toBeInTheDocument();
    });
  });

  it('should filter products by category', async () => {
    const mockCategories = [
      { _id: '1', name: 'Hawan Kund', slug: 'hawan-kund' },
    ];

    const mockProducts = {
      products: [
        {
          _id: '1',
          name: 'Copper Hawan Kund',
          price: 2499,
          categories: ['Hawan Kund'],
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

    render(
      <Provider store={mockStore}>
        <ProductsPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hawan Kund')).toBeInTheDocument();
    });

    const categoryButton = screen.getByText('Hawan Kund');
    fireEvent.click(categoryButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=hawan-kund'),
        expect.any(Object)
      );
    });
  });

  it('should sort products', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          products: [],
          total: 0,
          page: 1,
          totalPages: 1,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    render(
      <Provider store={mockStore}>
        <ProductsPage />
      </Provider>
    );

    await waitFor(() => {
      const sortSelect = screen.getByLabelText(/sort by/i);
      expect(sortSelect).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText(/sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'price-low' } });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=price-low'),
        expect.any(Object)
      );
    });
  });

  it('should handle pagination', async () => {
    const mockProducts = {
      products: [
        {
          _id: '1',
          name: 'Product 1',
          price: 1000,
        },
      ],
      total: 20,
      page: 1,
      totalPages: 2,
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    render(
      <Provider store={mockStore}>
        <ProductsPage />
      </Provider>
    );

    await waitFor(() => {
      const nextButton = screen.getByText(/next/i);
      expect(nextButton).toBeInTheDocument();
    });
  });

  it('should display product cards with all information', async () => {
    const mockProducts = {
      products: [
        {
          _id: '1',
          name: 'Copper Hawan Kund',
          nameHi: 'तांबे का हवन कुंड',
          price: 2499,
          originalPrice: 3499,
          discount: 29,
          rating: 4.5,
          reviewCount: 120,
          images: ['image1.jpg'],
          stockStatus: 'in-stock',
        },
      ],
      total: 1,
      page: 1,
      totalPages: 1,
    };

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    render(
      <Provider store={mockStore}>
        <ProductsPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Copper Hawan Kund')).toBeInTheDocument();
      expect(screen.getByText('₹2,499')).toBeInTheDocument();
      expect(screen.getByText('29% OFF')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });
  });
});
