// import { describe, it, expect } from 'vitest';
// import { render, screen } from '../../../tests/utils';
// import Breadcrumb from './Breadcrumb';

// describe('Breadcrumb', () => {
//   it('renders breadcrumb items', () => {
//     const items = [
//       { label: 'Patients', path: '/patients' },
//       { label: 'John Doe' },
//     ];

//     render(<Breadcrumb items={items} />);
//     expect(screen.getByText('Patients')).toBeInTheDocument();
//     expect(screen.getByText('John Doe')).toBeInTheDocument();
//   });

//   it('renders last item without link', () => {
//     const items = [
//       { label: 'Patients', path: '/patients' },
//       { label: 'John Doe' },
//     ];

//     render(<Breadcrumb items={items} />);
//     const lastItem = screen.getByText('John Doe');
//     expect(lastItem.tagName).toBe('SPAN');
//   });
// });