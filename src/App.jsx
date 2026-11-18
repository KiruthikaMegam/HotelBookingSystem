import { Routes, Route, Navigate } from "react-router-dom";

import { HotelProvider } from "./context/HotelContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminDashboard from "./admin/AdminDashboard";
import ManageRooms from "./admin/ManageRooms";
import ManageBookings from "./admin/ManageBookings";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminSettings from "./admin/AdminSettings";

import "./App.css";

function PublicLayout({ children }) {
  const isAdmin = localStorage.getItem("rrAdminLoggedIn") === "true";

  return (
    <>
      <Navbar isAdmin={isAdmin} />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <HotelProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/rooms" element={<PublicLayout><Rooms /></PublicLayout>} />
          <Route path="/rooms/:id" element={<PublicLayout><RoomDetails /></PublicLayout>} />
          <Route path="/booking/:id" element={<PublicLayout><Booking /></PublicLayout>} />
          <Route path="/confirmation" element={<PublicLayout><Confirmation /></PublicLayout>} />

          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          <Route path="/my-bookings" element={<PublicLayout><MyBookings /></PublicLayout>} />

          <Route element={<ProtectedCustomerRoute />}>
            <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
          </Route>

          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="rooms" element={<ManageRooms />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </HotelProvider>
  );
}

export default App;
