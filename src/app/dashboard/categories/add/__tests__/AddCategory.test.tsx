import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AddProductPage from '../page';
import localeReducer from '@/redux/slices/localeSlice';

// Mock fetch
global.fetch = jest.fn();

const mockStore = configureStore({
  reducer: {
    locale: localeReducer,
  },
});

describe('AddCategoryPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    localStorage.clear();
  });

  it('should render add category form', () => {
    render(
      <Provider store={mockStore}>
        <AddProductPage />
      </Provider>
    );

    expect(screen.getByLabelText(/name \(english\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name \(hindi\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
  });

  it('should auto-generate slug from English name', async () => {
    render(
      <Provider store={mockStore}>
        <AddProductPage />
      </Provider>
    );

    const nameInput = screen.getByLabelText(/name \(english\)/i);
    const slugInput = screen.getByLabelText(/slug/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Hawan Kund' } });

    await waitFor(() => {
      expect(slugInput.value).toBe('hawan-kund');
    });
  });

  it('should handle form submission for new category', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ _id: '1', name: 'Hawan Kund' }),
    });

    localStorage.setItem('token', 'mock-token');

    render(
      <Provider store={mockStore}>
        <AddProductPage />
      </Provider>
    );

    const nameInput = screen.getByLabelText(/name \(english\)/i);
    const nameHiInput = screen.getByLabelText(/name \(hindi\)/i);
    const submitButton = screen.getByRole('button', { name: /add category/i });

    fireEvent.change(nameInput, { target: { value: 'Hawan Kund' } });
    fireEvent.change(nameHiInput, { target: { value: 'हवन कुंड' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/categories'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          }),
          body: expect.stringContaining('Hawan Kund'),
        })
      );
    });
  });

  it('should validate required fields', async () => {
    render(
      <Provider store={mockStore}>
        <AddProductPage />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /add category/i });
    fireEvent.click(submitButton);

    // Form should not submit without required fields
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should handle parent category selection', async () => {
    const mockCategories = [
      { _id: '1', name: 'Parent Category', slug: 'parent' },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCategories,
    });

    render(
      <Provider store={mockStore}>
        <AddProductPage />
      </Provider>
    );

    await waitFor(() => {
      const parentSelect = screen.getByLabelText(/parent category/i);
      expect(parentSelect).toBeInTheDocument();
    });
  });

  it('should toggle active status', () => {
    render(
      <Provider store={mockStore}>
        <AddProductPage />
      </Provider>
    );

    const activeCheckbox = screen.getByLabelText(/active/i) as HTMLInputElement;
    
    expect(activeCheckbox.checked).toBe(true); // Default should be true

    fireEvent.click(activeCheckbox);
    expect(activeCheckbox.checked).toBe(false);
  });

  it('should display error message on failed submission', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Category already exists' }),
    });

    localStorage.setItem('token', 'mock-token');

    render(
      <Provider store={mockStore}>
        <AddProductPage />
      </Provider>
    );

    const nameInput = screen.getByLabelText(/name \(english\)/i);
    const submitButton = screen.getByRole('button', { name: /add category/i });

    fireEvent.change(nameInput, { target: { value: 'Existing Category' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
    });
  });
});
