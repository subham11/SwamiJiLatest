import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CategoryManagement from '../page';
import localeReducer from '@/redux/slices/localeSlice';

// Mock fetch
global.fetch = jest.fn();

const mockStore = configureStore({
  reducer: {
    locale: localeReducer,
  },
});

describe('CategoryManagement', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    localStorage.clear();
  });

  it('should render category management page', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <Provider store={mockStore}>
        <CategoryManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/category management/i)).toBeInTheDocument();
    });
  });

  it('should fetch and display categories', async () => {
    const mockCategories = [
      {
        _id: '1',
        name: 'Hawan Kund',
        nameHi: 'हवन कुंड',
        slug: 'hawan-kund',
        isActive: true,
        displayOrder: 1,
      },
      {
        _id: '2',
        name: 'Tarpan Set',
        nameHi: 'तर्पण सेट',
        slug: 'tarpan-set',
        isActive: true,
        displayOrder: 2,
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <Provider store={mockStore}>
        <CategoryManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hawan Kund')).toBeInTheDocument();
      expect(screen.getByText('Tarpan Set')).toBeInTheDocument();
    });
  });

  it('should filter categories by search term', async () => {
    const mockCategories = [
      {
        _id: '1',
        name: 'Hawan Kund',
        nameHi: 'हवन कुंड',
        slug: 'hawan-kund',
        isActive: true,
        displayOrder: 1,
      },
      {
        _id: '2',
        name: 'Tarpan Set',
        nameHi: 'तर्पण सेट',
        slug: 'tarpan-set',
        isActive: true,
        displayOrder: 2,
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <Provider store={mockStore}>
        <CategoryManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hawan Kund')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search categories/i);
    fireEvent.change(searchInput, { target: { value: 'Hawan' } });

    await waitFor(() => {
      expect(screen.getByText('Hawan Kund')).toBeInTheDocument();
      expect(screen.queryByText('Tarpan Set')).not.toBeInTheDocument();
    });
  });

  it('should show delete confirmation dialog', async () => {
    const mockCategories = [
      {
        _id: '1',
        name: 'Hawan Kund',
        nameHi: 'हवन कुंड',
        slug: 'hawan-kund',
        isActive: true,
        displayOrder: 1,
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <Provider store={mockStore}>
        <CategoryManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hawan Kund')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/delete/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
  });

  it('should delete category on confirmation', async () => {
    const mockCategories = [
      {
        _id: '1',
        name: 'Hawan Kund',
        nameHi: 'हवन कुंड',
        slug: 'hawan-kund',
        isActive: true,
        displayOrder: 1,
      },
    ];

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Deleted' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    localStorage.setItem('token', 'mock-token');

    render(
      <Provider store={mockStore}>
        <CategoryManagement />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hawan Kund')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/delete/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });

    const confirmButton = screen.getByText(/confirm/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/categories/1'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      );
    });
  });

  it('should display loading state', () => {
    (fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <Provider store={mockStore}>
        <CategoryManagement />
      </Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
