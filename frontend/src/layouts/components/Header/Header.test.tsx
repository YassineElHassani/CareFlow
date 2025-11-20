// import { describe, it, expect, vi } from 'vitest';
// import { render, screen, fireEvent } from '../../../tests/utils';
// import Header from './Header';

// describe('Header', () => {
//   const mockUser = {
//     name: 'John Doe',
//     email: 'john@example.com',
//     role: 'Doctor',
//   };

//   it('renders user name', () => {
//     render(
//       <Header
//         user={mockUser}
//         onLogout={vi.fn()}
//         onToggleSidebar={vi.fn()}
//       />
//     );
//     expect(screen.getByText('John Doe')).toBeInTheDocument();
//   });

//   it('calls onToggleSidebar when hamburger is clicked', () => {
//     const handleToggle = vi.fn();
//     render(
//       <Header
//         user={mockUser}
//         onLogout={handleToggle}
//         onToggleSidebar={handleToggle}
//       />
//     );
    
//     const hamburger = screen.getByLabelText('Toggle sidebar');
//     fireEvent.click(hamburger);
//     expect(handleToggle).toHaveBeenCalled();
//   });

//   it('calls onLogout when logout is clicked', () => {
//     const handleLogout = vi.fn();
//     render(
//       <Header
//         user={mockUser}
//         onLogout={handleLogout}
//         onToggleSidebar={vi.fn()}
//       />
//     );
    
//     // Open user menu first
//     const userButton = screen.getByText('John Doe').closest('button');
//     fireEvent.click(userButton!);
    
//     // Click logout
//     const logoutButton = screen.getByText('Logout');
//     fireEvent.click(logoutButton);
//     expect(handleLogout).toHaveBeenCalled();
//   });
// });