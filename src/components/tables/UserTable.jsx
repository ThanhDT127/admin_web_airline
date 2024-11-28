import React from 'react';
import { Link } from 'react-router-dom';
import './styles/UserTable.scss'
function UserTable({ currentUsers, onEdit, onDelete }) {
    return (
        <table className="user-table">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>UserName</th>
                    {/* <th>Password</th> */}
                    <th>Role</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {currentUsers.map((user) => (
                    <tr key={user.id}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.username}</td>
                        {/* <td>{user.password}</td> */}
                        <td>{user.role}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>
                            <button onClick={() => onEdit(user)} className="edit-button">Edit</button>
                            <button onClick={() => onDelete(user.id)} className="delete-button">Delete</button>
                            <Link to={`/details/${user.id}`}>
                                <button className="details-button">Details</button>
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default UserTable;
