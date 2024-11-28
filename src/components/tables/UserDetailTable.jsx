// src/components/tables/UserTable.jsx
import React from 'react';
import './styles/UserDetailTable.scss';

const UserDetailTable = ({ user }) => {
    return (
        <div className="user-table-container">
            <table className="user-table">
                <thead>
                    <tr>
                        <th className="user-table-th" >User ID</th>
                        <th className="user-table-th" >Email</th>
                        <th className="user-table-th" >First Name</th>
                        <th className="user-table-th" >Last Name</th>
                        <th className="user-table-th" >Username</th>
                        <th className="user-table-th" >Phone Number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.username}</td>
                        <td>{user.phoneNumber}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UserDetailTable;
