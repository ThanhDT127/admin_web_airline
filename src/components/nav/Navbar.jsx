import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';


function Navbar() {
    return (
        <div className="navbar">
            <h2>Admin Dashboard</h2>
            <div className="navbar-links">

                <Link to="/dashboard">
                    <button>Home</button>
                </Link>
                <Link to="/users">
                    <button>User</button>
                </Link>
                <Link to="/flights">
                    <button>Flight</button>
                </Link>
                <Link to="/bookings">
                    <button>Bookings</button>
                </Link>
            </div>
        </div>
    );
}

export default Navbar;
