import React from 'react';
import './styles/DetailOrderlistTable.scss';

const DetailOrderlistTable = ({ bookings, flights, currentBookings }) => {
    return (
        <table className="booking-table">
            <thead>
                <tr className="header-table">
                    <th>Booking ID</th>
                    <th>Booking Date</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>Flight Details</th>
                    <th>Luggage</th>
                    <th>Passengers</th>
                </tr>
            </thead>
            <tbody>
                {currentBookings.map((booking, index) => (
                    <tr
                        key={`${booking.bookingId}-${index}`}
                        className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                    >
                        <td>{booking.bookingId}</td>
                        <td>{booking.bookingDate}</td>
                        <td>{booking.status}</td>
                        <td>{booking.totalPrice}</td>
                        <td>
                            {flights
                                .filter((flight) => flight.flightId === booking.flightId)
                                .map((flight, flightIndex) => (
                                    <div key={`${flight.flightId}-${flightIndex}`}>
                                        <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                                        <p><strong>Departure Time:</strong> {flight.departureTime}</p>
                                        <p><strong>Arrival Time:</strong> {flight.arrivalTime}</p>
                                        <p><strong>Departure Airport:</strong> {flight.departureAirport.airportName}</p>
                                        <p><strong>Arrival Airport:</strong> {flight.arrivalAirport.airportName}</p>
                                        <p><strong>Airline:</strong> {flight.airline.name}</p>
                                    </div>
                                ))}
                        </td>
                        <td>
                            {booking.luggage.length > 0 ? (
                                booking.luggage.map((item) => (
                                    <div key={item.id}>
                                        <p>Price: {item.price} USD</p>
                                        <p>Weight: {item.weight} kg</p>
                                    </div>
                                ))
                            ) : (
                                <p>No Luggage</p>
                            )}
                        </td>
                        <td>
                            {booking.passengers.length > 0 ? (
                                booking.passengers.map((passenger) => (
                                    <div key={passenger.passengerId}>
                                        <p>{`${passenger.firstName} ${passenger.lastName}`}</p>
                                        <p>Date of Birth: {passenger.dateOfBirth}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No Passengers</p>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DetailOrderlistTable;
