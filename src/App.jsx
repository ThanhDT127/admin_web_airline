import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/nav/Navbar";
import Dashboard from "./views/dashboard/Dashboard";
import Users from "./views/user/Users";
import DetailOrderlist from "./views/detailorder/DetailOrderlist";
import AircraftList from "./views/aircarft/AircraftList";
import AirlineList from "./views/Airline/AirlineList";
import Flightlist from "./views/Flights/FlightList";
import AirportList from "./views/Airport/AirportList";
import BookingList from "./views/booking/BookingList";
import AdminLoginPage from "./views/login/AdminLoginPage";
import "./App.scss";

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("adminToken");
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// AdminLayout component
const AdminLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <Navbar />
      <div className="content">{children}</div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<AdminLoginPage />} />

        <Route
          path="/*"
          element={
            <PrivateRoute
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="details/:id" element={<DetailOrderlist />} />
                    <Route path="aircrafts" element={<AircraftList />} />
                    <Route path="airlines" element={<AirlineList />} />
                    <Route path="flights" element={<Flightlist />} />
                    <Route path="airports" element={<AirportList />} />
                    <Route path="bookings" element={<BookingList />} />
                  </Routes>
                </AdminLayout>
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
