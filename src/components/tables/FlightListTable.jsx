import React from 'react';
import './styles/FlightListTable.scss';

const FlightListTable = ({ flights, currentFlights, onEdit, onDelete }) => {
    return (
        <div className="table-responsive">
            <table className="flight-table">
                <thead>
                    <tr>
                        <th colSpan="5">Flight Info</th>
                        <th colSpan="4">Departure</th>
                        <th colSpan="4">Arrival</th>
                        <th rowSpan="2">Base Price</th>
                        <th rowSpan="2">Status</th>
                        <th colSpan="2">Transit Points</th>
                        <th rowSpan="2">Actions</th>
                    </tr>
                    <tr>
                        <th>Flight Number</th>
                        <th>Aircraft Model</th>
                        <th>Total Seats</th>
                        <th>Airline Name</th>
                        <th>Airline Code</th>
                        <th>Departure Airport</th>
                        <th>Departure City</th>
                        <th>Departure Country</th>
                        <th>Departure Time</th>
                        <th>Arrival Airport</th>
                        <th>Arrival City</th>
                        <th>Arrival Country</th>
                        <th>Arrival Time</th>
                        <th>Arrival</th>
                        <th>Departure</th>
                    </tr>
                </thead>
                <tbody>
                    {currentFlights.map((flight) => (
                        <tr key={flight.flightId}>
                            <td>{flight.flightNumber}</td>
                            <td>{flight.aircraft?.model || 'Unknown'}</td>
                            <td>{flight.aircraft?.totalSeats || 'Unknown'}</td>
                            <td>{flight.airline?.name || 'Unknown'}</td>
                            <td>{flight.airline?.code || 'Unknown'}</td>

                            {/* Departure Info */}
                            <td>{flight.departureAirport?.airportName || 'Unknown'}</td>
                            <td>{flight.departureAirport?.city || 'Unknown'}</td>
                            <td>{flight.departureAirport?.country || 'Unknown'}</td>
                            <td>{new Date(flight.departureTime).toLocaleString()}</td>

                            {/* Arrival Info */}
                            <td>{flight.arrivalAirport?.airportName || 'Unknown'}</td>
                            <td>{flight.arrivalAirport?.city || 'Unknown'}</td>
                            <td>{flight.arrivalAirport?.country || 'Unknown'}</td>
                            <td>{new Date(flight.arrivalTime).toLocaleString()}</td>

                            <td>{flight.basePrice}</td>
                            <td>{flight.status}</td>

                            {/* Transit Points - Arrival and Departure */}
                            <td>
                                {flight.transitPointList.length > 0 ? (
                                    flight.transitPointList.map(point => (
                                        <div key={point.transitId}>
                                            {point.airport.airportName} ({point.airport.city}, {point.airport.country}) -
                                            Arrival: {new Date(point.arrivalTime).toLocaleString()}
                                        </div>
                                    ))
                                ) : (
                                    'None'
                                )}
                            </td>
                            <td>
                                {flight.transitPointList.length > 0 ? (
                                    flight.transitPointList.map(point => (
                                        <div key={point.transitId}>
                                            {point.airport.airportName} ({point.airport.city}, {point.airport.country}) -
                                            Departure: {new Date(point.departureTime).toLocaleString()}
                                        </div>
                                    ))
                                ) : (
                                    'None'
                                )}
                            </td>


                            <td>
                                <button onClick={() => onEdit(flight)} className="edit_button">Edit</button>
                                <button onClick={() => onDelete(flight.flightId)} className="delete_button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FlightListTable;
