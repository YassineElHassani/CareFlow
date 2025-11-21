// import { describe, it, expect } from 'vitest';
// import { render, screen } from '../tests/utils';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import RoleBasedRoute from './RoleBasedRoute';
// import { ROLES } from '../constants/roles';

// describe('RoleBasedRoute', () => {
//   it('renders children when user has required role', () => {
//     render(
//       <BrowserRouter>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <RoleBasedRoute
//                 allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR]}
//                 userRole={ROLES.ADMIN}
//               >
//                 <div>Admin Content</div>
//               </RoleBasedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     );

//     expect(screen.getByText('Admin Content')).toBeInTheDocument();
//   });

//   it('redirects when user does not have required role', () => {
//     render(
//       <BrowserRouter>
//         <Routes>
//           <Route path="/403" element={<div>Forbidden</div>} />
//           <Route
//             path="/"
//             element={
//               <RoleBasedRoute
//                 allowedRoles={[ROLES.ADMIN]}
//                 userRole={ROLES.PATIENT}
//               >
//                 <div>Admin Content</div>
//               </RoleBasedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     );

//     expect(screen.getByText('Forbidden')).toBeInTheDocument();
//   });
// });