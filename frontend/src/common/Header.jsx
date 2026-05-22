// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link } from 'react-router-dom';
// // import { logout } from '../redux/slices/authSlice';

// import { logout } from '../redux/slices/Authenticationslice';

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useSelector((state) => state.auth);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/');
//   };

//   const getDashboardLink = () => {
//     switch (user?.role) {
//       case 'admin':
//         return '/admin';
//       case 'owner':
//         return '/owner';
//       case 'tenant':
//         return '/tenant';
//       default:
//         return '/';
//     }
//   };

//   return (
//     <header className="bg-blue-600 text-white shadow-md">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/" className="text-xl font-bold">
//           RentManager
//         </Link>
        
//         {isAuthenticated ? (
//           <div className="flex items-center space-x-4">
//             <Link
//               to={getDashboardLink()}
//               className="hover:text-blue-200 transition-colors"
//             >
//               Dashboard
//             </Link>
//             <Link
//               to="/properties"
//               className="hover:text-blue-200 transition-colors"
//             >
//               Properties
//             </Link>
//             <Link
//               to="/predictPrice"
//               className="hover:text-blue-200 transition-colors"
//             >
//               AI PRICE PREDICTION
//             </Link>
//             {user?.role === 'tenant' && (
//               <Link
//                 to="/rental-history"
//                 className="hover:text-blue-200 transition-colors"
//               >
//                 History
//               </Link>
//             )}
//             <span className="text-sm">Welcome, {user?.name}</span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         ) : (
//           <div className="space-x-4">
//             <Link
//               to="/login"
//               className="hover:text-blue-200 transition-colors"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded transition-colors"
//             >
//               Register
//             </Link>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;





import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../redux/slices/Authenticationslice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'owner':
        return '/owner/dashboard';
      case 'tenant':
        return '/tenant/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
          RentManager
        </Link>
       
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link
              to={getDashboardLink()}
              className="hover:text-blue-200 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/property-listing"
              className="hover:text-blue-200 transition-colors"
            >
              Properties
            </Link>
            <Link
              to="/predict-price"
              className="hover:text-blue-200 transition-colors"
            >
              AI Price Prediction
            </Link>
            {user?.role === 'tenant' && (
              <Link
                to="/rental-history"
                className="hover:text-blue-200 transition-colors"
              >
                History
              </Link>
            )}
            {user?.role === 'owner' && (
              <Link
                to="/my-properties"
                className="hover:text-blue-200 transition-colors"
              >
                My Properties
              </Link>
            )}
            <div className="flex items-center space-x-3 ml-4 border-l border-blue-400 pl-4">
              <span className="text-sm">
                Welcome, <span className="font-medium">{user?.name || 'User'}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="hover:text-blue-200 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;