/**
 * Button Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../components/atoms/Button';
import renderWithProviders from '../utils/test-utils';

describe('Button Component', () => {
    it('renders with text content', () => {
        renderWithProviders(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: 'Click me' });
        expect(button).toBeInTheDocument();
    });

    it('renders with primary variant', () => {
        renderWithProviders(<Button variant="primary">Primary</Button>);
        const button = screen.getByRole('button', { name: 'Primary' });
        expect(button).toBeInTheDocument();
    });

    it('renders with outline variant', () => {
        renderWithProviders(<Button variant="outline">Outline</Button>);
        const button = screen.getByRole('button', { name: 'Outline' });
        expect(button).toBeInTheDocument();
    });

    it('can be disabled', () => {
        renderWithProviders(<Button disabled>Disabled</Button>);
        const button = screen.getByRole('button', { name: 'Disabled' });
        expect(button).toBeDisabled();
    });

    it('calls onClick handler when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        renderWithProviders(<Button onClick={handleClick}>Click</Button>);

        await user.click(screen.getByRole('button', { name: 'Click' }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        renderWithProviders(
            <Button onClick={handleClick} disabled>
                Disabled
            </Button>
        );

        await user.click(screen.getByRole('button', { name: 'Disabled' }));
        expect(handleClick).not.toHaveBeenCalled();
    });
});
