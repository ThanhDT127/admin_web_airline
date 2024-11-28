// src/components/tables/FlightTable.jsx
import React from 'react';
import './styles/FlightTable.scss';

function FlightTable({ flights }) {
    return (
        <div className="flight-list-container">
            <h3>Top 10 Flights with Most Frequent Routes</h3>
            <table className="flight-table">
                <thead>
                    <tr>
                        <th>Flight Number</th>
                        <th>Departure Airport</th>
                        <th>Arrival Airport</th>
                        <th>Departure Time</th>
                        <th>Arrival Time</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map((flight) => (
                        <tr key={flight.flightId}>
                            <td>{flight.flightNumber}</td>
                            <td>{flight.departureAirport.airportName}</td>
                            <td>{flight.arrivalAirport.airportName}</td>
                            <td>{new Date(flight.departureTime).toLocaleString()}</td>
                            <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FlightTable;
