import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLoginPage.scss";

const AdminLoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });


            if (!response.ok) {
                setError("Invalid username or password.");
                return;
            }

            const data = await response.json();


            if (data.userRole === "ADMIN") {
                // Save token and userId to localStorage
                localStorage.setItem("adminToken", data.token);
                localStorage.setItem("userId", data.userId);

                navigate("/dashboard");
            } else {
                setError("Access denied. You do not have admin privileges.");
            }
        } catch (error) {
            setError("Server error. Please try again later.");
        }
    };





    return (
        <div className="admin-login-container">
            <form className="admin-login-form" onSubmit={handleLogin}>
                <h2 className="admin-login-title">Admin Login</h2>
                {error && <p className="admin-login-error">{error}</p>}
                <div className="admin-login-form-group">
                    <label htmlFor="username" className="admin-login-label">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="admin-login-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="admin-login-form-group">
                    <label htmlFor="password" className="admin-login-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="admin-login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="admin-login-button">Login</button>
            </form>
        </div>
    );
};

export default AdminLoginPage;
