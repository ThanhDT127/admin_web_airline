// Table.jsx
import React from 'react';

const BookingTable = ({ bookings, users, flights }) => {
    return (
        <table className="booking-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Flight Number</th>
                    <th>Status</th>
                    <th>Total Price</th>
                    <th>Seat Class</th>
                    <th>Ticket Name</th>
                    <th>Luggage</th>
                    <th>Passengers</th>
                </tr>
            </thead>

            <tbody>
                {bookings.map((booking) => (
                    <tr key={booking.bookingId}>
                        <td>{users[booking.user.id]}</td>
                        <td>{flights[booking.flightId]}</td>
                        <td>{booking.status}</td>
                        <td>{booking.totalPrice}</td>
                        <td>{booking.bookingTicketType[0]?.ticketType.seatClass || 'Unknown'}</td>
                        <td>{booking.bookingTicketType[0]?.ticketType.name || 'Unknown'}</td>
                        <td>
                            {booking.luggage.length > 0 ? (
                                booking.luggage.map((lug, index) => (
                                    <div key={index}>
                                        Price: {lug.price} - Weight: {lug.weight}kg
                                    </div>
                                ))
                            ) : (
                                'No Luggage'
                            )}
                        </td>
                        <td>
                            {booking.passengers.length > 0 ? (
                                booking.passengers.map((passenger, index) => (
                                    <div key={index}>
                                        {passenger.firstName} {passenger.lastName} (DOB: {passenger.dateOfBirth})
                                    </div>
                                ))
                            ) : (
                                'No Passengers'
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>
    );
};

export default BookingTable;
