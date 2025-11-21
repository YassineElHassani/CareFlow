// import { describe, it, expect } from 'vitest';
// import { render, screen } from '../tests/utils/test-utils';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';

// describe('ProtectedRoute', () => {
//   it('renders children when authenticated', () => {
//     render(
//       <BrowserRouter>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute isAuthenticated={true}>
//                 <div>Protected Content</div>
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     );

//     expect(screen.getByText('Protected Content')).toBeInTheDocument();
//   });

//   it('redirects to login when not authenticated', () => {
//     render(
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<div>Login Page</div>} />
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute isAuthenticated={false}>
//                 <div>Protected Content</div>
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     );

//     expect(screen.getByText('Login Page')).toBeInTheDocument();
//   });
// });