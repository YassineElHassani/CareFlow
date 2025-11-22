/**
 * Test Setup and Utilities
 * Common utilities and setup for all tests
 */

import '@testing-library/jest-dom';
import { ReactNode } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';

/**
 * Create a test store with optional initial state
 */
export function renderWithProviders(
    ui: ReactNode,
    {
        preloadedState,
        ...renderOptions
    }: {
        preloadedState?: any;
    } & Omit<RenderOptions, 'wrapper'> = {},
) {
    const store = configureStore({
        reducer: {
            auth: authReducer,
        },
        preloadedState: preloadedState as any,
    } as any);

    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <Provider store={store}>
                <BrowserRouter>{children}</BrowserRouter>
            </Provider>
        );
    }

    return { ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }), store };
}

/**
 * Mock API response helper
 */
export function createMockApiResponse<T>(data: T, status = 200) {
    return {
        data,
        status,
        statusText: 'OK',
        headers: {},
        config: {
            url: '/api',
            method: 'get',
            headers: {},
        },
    };
}

/**
 * Mock Axios error helper
 */
export function createMockAxiosError(status: number, message: string, data?: any) {
    const error = new Error(message);
    (error as any).response = {
        status,
        data: data || { message },
        headers: {},
    };
    (error as any).config = {
        url: '/api',
        method: 'get',
        headers: {},
    };
    return error;
}

/**
 * Wait for loading to finish
 */
export async function waitForLoadingToFinish() {
    const { waitFor } = await import('@testing-library/react');
    return waitFor(() => {
        const loaders = document.querySelectorAll('[role="status"]');
        loaders.forEach((loader) => {
            if (
                loader.textContent?.includes('Loading') ||
                loader.classList.contains('loading')
            ) {
                throw new Error('Still loading');
            }
        });
    });
}

/**
 * Mock localStorage
 */
export const mockLocalStorage = () => {
    const store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            Object.keys(store).forEach((key) => {
                delete store[key];
            });
        },
    };
};

export default renderWithProviders;
