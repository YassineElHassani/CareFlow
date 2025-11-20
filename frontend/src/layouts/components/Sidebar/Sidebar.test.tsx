// import { describe, it, expect, vi } from 'vitest';
// import { render, screen } from '../../../tests/utils';
// import Sidebar from './Sidebar';

// describe('Sidebar', () => {
//   const mockMenuItems = [
//     {
//       label: 'Dashboard',
//       path: '/dashboard',
//       icon: <span>📊</span>,
//       roles: ['admin', 'doctor'],
//     },
//     {
//       label: 'Patients',
//       path: '/patients',
//       icon: <span>👥</span>,
//       roles: ['admin', 'doctor'],
//     },
//   ];

//   it('renders menu items', () => {
//     render(
//       <Sidebar
//         menuItems={mockMenuItems}
//         userRole="admin"
//         isOpen={true}
//       />
//     );
//     expect(screen.getByText('Dashboard')).toBeInTheDocument();
//     expect(screen.getByText('Patients')).toBeInTheDocument();
//   });

//   it('filters menu items by role', () => {
//     const items = [
//       ...mockMenuItems,
//       {
//         label: 'Admin Only',
//         path: '/admin',
//         icon: <span>🔒</span>,
//         roles: ['admin'],
//       },
//     ];

//     render(
//       <Sidebar
//         menuItems={items}
//         userRole="doctor"
//         isOpen={true}
//       />
//     );
//     expect(screen.queryByText('Admin Only')).not.toBeInTheDocument();
//   });
// });