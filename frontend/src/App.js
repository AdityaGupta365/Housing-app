// import './index.css'; // or whatever your main CSS file is named
// import AdminDashboard from "./pages/AdminDashboard";

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from "./pages/LoginPage";
// import Register from "./pages/RegisterPage";
// import OwnerDashboard from "./pages/OwnerDashboard";
// import TenantDashboard from './pages/TenantDashboard';
// import PropertyListing from './pages/PropertyListing';

// function App() {
//   return (
//     <Router>
//       <Routes>
//       <Route path="/admin/dashboard"element={<AdminDashboard/>}/>
//       <Route path="/owner/dashboard"element={<OwnerDashboard/>}/>
//       <Route path="/tenant/dashboard"element={<TenantDashboard/>}/>
//       <Route path="/"element={<Login/>}/>
//       <Route path="/register"element={<Register/>}/>
//       <Route path="/propertylisting"element={<PropertyListing/>}/>
//       </Routes>
//     </Router>
//   );
// }

// export default App;






// import './index.css'; // or whatever your main CSS file is named
// import AdminDashboard from "./pages/AdminDashboard";
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from "./pages/LoginPage";
// import Register from "./pages/RegisterPage";
// import OwnerDashboard from "./pages/OwnerDashboard";
// import TenantDashboard from './pages/TenantDashboard';
// import PropertyListing from './pages/PropertyListing';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
//         <Route path="/owner/dashboard" element={<OwnerDashboard/>}/>
//         <Route path="/tenant/dashboard" element={<TenantDashboard/>}/>
//         <Route path="/" element={<Login/>}/>
//         <Route path="/register" element={<Register/>}/>
//         <Route path="/propertylisting" element={<PropertyListing/>}/>
//       </Routes>
//     </Router>
//   );
// }

// export default App;






// Layout.js - Create this component


// App.js - Updated version using Layout component
// import './index.css';
// import AdminDashboard from "./pages/AdminDashboard";
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from "./pages/LoginPage";
// import Register from "./pages/RegisterPage";
// import OwnerDashboard from "./pages/OwnerDashboard";
// import TenantDashboard from './pages/TenantDashboard';
// import PropertyListing from './pages/PropertyListing';
// import Layout from './common/Layout';
// import PricePredictionForm from './pages/PricePredictionForm';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Routes with Layout (Header included) */}
//         <Route path="/admin/dashboard" element={<Layout><AdminDashboard/></Layout>}/>
//         <Route path="/owner/dashboard" element={<Layout><OwnerDashboard/></Layout>}/>
//         <Route path="/tenant/dashboard" element={<Layout><TenantDashboard/></Layout>}/>
//         <Route path="/propertylisting" element={<Layout><PropertyListing/></Layout>}/>
//         <Route path="/predictPrice" element={<Layout><PricePredictionForm/></Layout>}/>
        
//         {/* Routes without Layout (No Header) */}
//         <Route path="/" element={<Login/>}/>
//         <Route path="/register" element={<Register/>}/>
//       </Routes>
//     </Router>
//   );
// }

// export default App;




import './index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/LoginPage";
import RentalHistory from "./pages/RentalHistory";
import Register from "./pages/RegisterPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from './pages/TenantDashboard';
import PropertyListing from './pages/PropertyListing';
import Layout from './common/Layout';
import PricePredictionForm from './pages/PricePredictionForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without Layout (No Header) - Authentication pages */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes with Layout (Header included) - Protected pages */}
        <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/owner/dashboard" element={<Layout><OwnerDashboard /></Layout>} />
        <Route path="/tenant/dashboard" element={<Layout><TenantDashboard /></Layout>} />
        <Route path="/property-listing" element={<Layout><PropertyListing /></Layout>} />
        <Route path="/predict-price" element={<Layout><PricePredictionForm /></Layout>} />
        <Route path="/rental-history" element={<Layout><RentalHistory /></Layout>} />
        
        {/* Catch-all route for 404 - Optional but recommended */}
        <Route path="*" element={<Layout><div>Page Not Found</div></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;