// components/CampusForm.spec.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CampusForm from './page';
import { CampusFormData, initialCampusFormData } from '@/app/types/types';

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('CampusForm', () => {
  beforeEach(() => {
    mockLocalStorage.setItem('token', 'mocked-token');
    mockedAxios.get.mockResolvedValue({ data: [{ id: 1, name: 'Test University' }] });
    mockedAxios.post.mockResolvedValue({ data: { message: 'Form submitted successfully' } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form', async () => {
    render(<CampusForm />);

    // Check for form elements
    expect(screen.getByLabelText(/University/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Campus name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByText(/Create campus profile/i)).toBeInTheDocument();

    // Wait for async data to be fetched and universities to be populated
    await waitFor(() => {
      expect(screen.getByText(/Test University/i)).toBeInTheDocument();
    });
  });

  test('allows the user to submit the form', async () => {
    render(<CampusForm />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Campus name/i), {
      target: { value: 'Test Campus' },
    });

    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: '123456789' },
    });

    fireEvent.change(screen.getByLabelText(/Bio/i), {
      target: { value: 'Test Bio' },
    });

    fireEvent.change(screen.getByLabelText(/Number of colleges/i), {
      target: { value: '10' },
    });

    fireEvent.change(screen.getByLabelText(/Number of departments/i), {
      target: { value: '20' },
    });

    fireEvent.change(screen.getByLabelText(/Number of lectures/i), {
      target: { value: '30' },
    });

    fireEvent.change(screen.getByLabelText(/More about/i), {
      target: { value: 'More details about the campus' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Create campus profile/i));

    // Ensure the form is submitted with the correct data
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/campus_profiles/',
        expect.objectContaining({
          name: 'Test Campus',
          phone: '123456789',
          bio: 'Test Bio',
          number_of_colleges: '10',
          number_of_departments: '20',
          number_of_lectures: '30',
          about: 'More details about the campus',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mocked-token',
          },
        }
      );
    });
  });
});
