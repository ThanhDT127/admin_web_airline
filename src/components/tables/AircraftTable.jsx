import React from 'react';
import './styles/AircraftTable.scss'

const AircraftTable = ({ currentAircrafts, onEdit, onDelete }) => {
  return (
    <table className="aircraft-table">
      <thead>
        <tr>
          <th>Model</th>
          <th>Total Seats</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentAircrafts.map((aircraft) => (
          <tr key={aircraft.id}>
            <td>{aircraft.model}</td>
            <td>{aircraft.totalSeat}</td>
            <td>
              <button onClick={() => onEdit(aircraft)} className="edit-button">
                Edit
              </button>
              <button onClick={() => onDelete(aircraft.id)} className="delete-button">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AircraftTable;
