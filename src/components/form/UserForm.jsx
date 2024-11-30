import React, { useState } from 'react';
import './styles/UserForm.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserForm = ({
    formType,
    formData,
    onChange,
    onSubmit,
    onCancel,
    errorMessage = {}
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{formType === "add" ? "Add User" : "Edit User"}</h3>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={onChange}
                            placeholder="First Name"
                            required
                        />
                        {errorMessage.firstName && (
                            <span className="error">{errorMessage.firstName}</span>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onChange}
                            placeholder="Last Name"
                            required
                        />
                        {errorMessage.lastName && (
                            <span className="error">{errorMessage.lastName}</span>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            placeholder="Email"
                            required
                        />
                        {errorMessage.email && (
                            <span className="error">{errorMessage.email}</span>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={onChange}
                            placeholder="Username"
                            required
                        />
                        {errorMessage.username && (
                            <span className="error">{errorMessage.username}</span>
                        )}
                    </div>
                    <div className="form-group password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            placeholder="Password"
                            required={formType === "add"}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="password-toggle-button"
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        {errorMessage.password && (
                            <span className="error">{errorMessage.password}</span>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={onChange}
                            placeholder="Phone Number"
                        />
                        {errorMessage.phoneNumber && (
                            <span className="error">{errorMessage.phoneNumber}</span>
                        )}
                    </div>
                    <div className="form-group">
                        <select
                            name="role"
                            value={formData.role}
                            onChange={onChange}
                            required
                        >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                        {errorMessage.role && (
                            <span className="error">{errorMessage.role}</span>
                        )}
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="submit-button">
                            {formType === "add" ? "Add User" : "Save Changes"}
                        </button>
                        <button type="button" onClick={onCancel} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;