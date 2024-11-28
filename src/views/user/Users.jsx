import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './Users.scss';
import config from "../config.json";
import UserTable from '../../components/tables/UserTable';
import Pagination from '../../components/Pagination/Pagination';
import UserForm from '../../components/form/UserForm';
import { fetchWithToken } from '../fetchWithToken';
const { SERVER_API } = config;

function Users() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState("add"); // "add" hoặc "edit"
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        phoneNumber: "",
        role: "CUSTOMER",
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchWithToken(`${SERVER_API}/users/all`);
            const data = await response.json();
            setUsers(data.sort((a, b) => b.id - a.id)); // Sắp xếp giảm dần theo ID
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    const openForm = (type, user = null) => {
        setFormType(type);
        if (type === "edit" && user) {
            setFormData({ ...user }); // Load dữ liệu người dùng khi chỉnh sửa
            setCurrentUser(user);
        } else {
            setFormData({
                email: "",
                firstName: "",
                lastName: "",
                username: "",
                password: "",
                phoneNumber: "",
                role: "CUSTOMER",
            });
            setCurrentUser(null);
        }
        setShowForm(true);
        setErrorMessage("");
    };

    const closeForm = () => {
        setShowForm(false);
        setCurrentUser(null);
        setErrorMessage("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const userData = {
            email: formData.get('email')?.trim(),
            firstName: formData.get('firstName')?.trim(),
            lastName: formData.get('lastName')?.trim(),
            username: formData.get('username')?.trim(),
            password: formData.get('password')?.trim(),
            phoneNumber: formData.get('phoneNumber')?.trim(),
            role: formData.get('role')?.trim() || "CUSTOMER",
        };
        console.log(userData)
        // Chuyển chữ cái đầu tiên của firstName và lastName thành chữ hoa
        userData.firstName = userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1);
        userData.lastName = userData.lastName.charAt(0).toUpperCase() + userData.lastName.slice(1);

        const errors = {};

        // Validation
        if (!userData.firstName) {
            errors.firstName = "First name is required.";
        }

        if (!userData.lastName) {
            errors.lastName = "Last name is required.";
        }

        if (!userData.email) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (!userData.username) {
            errors.username = "Username is required.";
        } else if (/\s/.test(userData.username)) {
            errors.username = "Username cannot contain spaces.";
        } else if (!/^[a-zA-Z0-9]+$/.test(userData.username)) {
            errors.username = "Username can only contain letters and numbers.";
        } else if (userData.username.length < 3 || userData.username.length > 20) {
            errors.username = "Username must be between 3 and 20 characters.";
        }

        if (userData.password) {
            if (userData.password.length < 5 || userData.password.length > 16) {
                errors.password = "Password must be between 5 and 16 characters.";
            } else if (!/[a-zA-Z]/.test(userData.password) || !/\d/.test(userData.password)) {
                errors.password = "Password must contain at least one letter and one number.";
            } else if (/\s/.test(userData.password)) {
                errors.password = "Password cannot contain spaces.";
            }
        } else {
            errors.password = "Password is required.";
        }

        if (!userData.phoneNumber || !/^\d+$/.test(userData.phoneNumber)) {
            errors.phoneNumber = "Phone number must be a valid number.";
        } else if (userData.phoneNumber.length < 9 || userData.phoneNumber.length > 12) {
            errors.phoneNumber = "Phone number must be between 9 and 12 digits.";
        }

        if (!userData.role) {
            errors.role = "Role selection is required.";
        }

        const duplicateUser = users.find(
            user => user.username.toLowerCase() === userData.username.toLowerCase() &&
                user.id !== currentUser?.id
        );
        if (duplicateUser) {
            errors.username = "An user with this username already exists.";
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return;
        }

        try {
            let response;
            if (formType === "edit" && currentUser) {
                response = await fetchWithToken(`${SERVER_API}/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
            } else {
                response = await fetchWithToken(`${SERVER_API}/users/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                });
            }

            if (response.ok) {
                alert(currentUser ? "User updated successfully" : "User added successfully");
                setShowForm(false);
                fetchUsers();
            } else {
                const errorResponse = await response.json();
                alert(`Failed to submit user data: ${errorResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting user data:', error);
            alert('An error occurred while submitting user data. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetchWithToken(`${SERVER_API}/users/${id}`, { method: "DELETE" });
                if (response.ok) {
                    alert("User deleted successfully.");
                    fetchUsers();
                } else {
                    alert("Failed to delete user.");
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("An error occurred while deleting the user.");
            }
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, "User_List.xlsx");
    };

    const filteredUsers = users.filter((user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(user.phoneNumber).includes(searchTerm)
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) {
        return <div>Loading data...</div>;
    }

    return (
        <div className="user-list-container">
            <h2>User List</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search users by name or phone number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="toolbar">
                <button onClick={() => openForm("add")} className="add-button">Add User</button>
                <button onClick={exportToExcel} className="export-users-button">Export to Excel</button>
            </div>

            {showForm && (
                <UserForm
                    formType={formType}
                    formData={formData}
                    onChange={handleFormChange}
                    onSubmit={handleSubmit}
                    onCancel={closeForm}
                    errorMessage={errorMessage}
                />
            )}

            <UserTable
                currentUsers={currentUsers}
                onEdit={(user) => openForm("edit", user)}
                onDelete={handleDelete}
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default Users;
