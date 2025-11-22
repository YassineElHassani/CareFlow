/**
 * Input Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../components/atoms/Input';
import renderWithProviders from '../utils/test-utils';

describe('Input Component', () => {
    it('renders input field', () => {
        renderWithProviders(<Input placeholder="Enter text" />);
        const input = screen.getByPlaceholderText('Enter text');
        expect(input).toBeInTheDocument();
    });

    it('accepts user input', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Input />);
        const input = screen.getByRole('textbox') as HTMLInputElement;

        await user.type(input, 'test input');
        expect(input.value).toBe('test input');
    });

    it('handles change events', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();
        renderWithProviders(<Input onChange={handleChange} />);
        const input = screen.getByRole('textbox');

        await user.type(input, 'a');
        expect(handleChange).toHaveBeenCalled();
    });

    it('can be disabled', () => {
        renderWithProviders(<Input disabled />);
        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });

    it('renders with different types', () => {
        renderWithProviders(
            <>
                <Input type="email" placeholder="email" />
                <Input type="password" placeholder="password" />
                <Input type="number" placeholder="number" />
            </>
        );

        expect(screen.getByPlaceholderText('email')).toHaveAttribute('type', 'email');
        expect(screen.getByPlaceholderText('password')).toHaveAttribute('type', 'password');
        expect(screen.getByPlaceholderText('number')).toHaveAttribute('type', 'number');
    });

    it('displays error state', () => {
        renderWithProviders(<Input error="Error message" />);
        expect(screen.getByText('Error message')).toBeInTheDocument();
    });
});
