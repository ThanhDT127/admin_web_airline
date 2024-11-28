import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.scss';

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();


        const confirmLogout = window.confirm("Do you want to log out?");

        if (confirmLogout) {
            localStorage.removeItem("adminToken");
            navigate("/login");
        }
    };

    return (
        <div className="sidebar">
            <div>
                <h3>Tickets Management</h3>
            </div>
            <div>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">Users</Link>
                <Link to="/flights">Flights</Link>
                <Link to="/aircrafts">Aircrafts</Link>
                <Link to="/airlines">Airlines</Link>
                <Link to="/airports">Airports</Link>
                <Link to="/bookings">Bookings</Link>

                <Link to="/login" onClick={handleLogout}>Log Out</Link>
            </div>
        </div>
    );
}

export default Sidebar;
