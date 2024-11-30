import React, { useEffect, useState } from 'react';
import './BookingList.scss';
import config from '../config.json';
import * as XLSX from 'xlsx';
import BookingTable from '../../components/tables/BookingTable';
import Pagination from '../../components/Pagination/Pagination';
import { fetchWithToken } from '../fetchWithToken';

const { SERVER_API } = config;

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState({});
    const [flights, setFlights] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState(""); // For search
    const bookingsPerPage = 10;

    // Fetching data on initial render and every 30 seconds
    useEffect(() => {
        fetchBookings();
        fetchUsers();
        fetchFlights();
        const interval = setInterval(() => {
            fetchBookings();
            fetchUsers();
            fetchFlights();
        }, 30000); // Update every 30 seconds

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [currentPage]);

    const fetchBookings = async () => {
        try {
            const response = await fetchWithToken(`${SERVER_API}/bookings/all`);
            const data = await response.json();
            setBookings(data);
            setTotalPages(Math.ceil(data.length / bookingsPerPage));
        } catch (error) {
            console.error('Error fetching booking list:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetchWithToken(`${SERVER_API}/users/all`);
            const data = await response.json();
            const userMap = {};
            data.forEach(user => {
                userMap[user.id] = {
                    fullName: `${user.firstName} ${user.lastName}`,
                    phoneNumber: user.phoneNumber,
                    email: user.email,
                    username: user.username,
                };
            });
            setUsers(userMap);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchFlights = async () => {
        try {
            const response = await fetchWithToken(`${SERVER_API}/flights/all`);
            const data = await response.json();
            const flightMap = {};
            data.forEach(flight => {
                flightMap[flight.flightId] = {
                    flightNumber: flight.flightNumber,
                    basePrice: flight.basePrice,
                };
            });
            setFlights(flightMap);
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    };

    const exportToExcel = () => {

        const sortedBookings = [...bookings].sort((a, b) => a.bookingId - b.bookingId);


        const formattedData = sortedBookings.map((booking) => {
            const user = users[booking.user.id] || {};
            const flight = flights[booking.flightId] || {};
            const ticketType = booking.bookingTicketType[0]?.ticketType || {};

            return {
                "Booking ID": booking.bookingId,
                "Full Name": user.fullName || "Unknown",
                "Username": user.username || "Unknown",
                "Phone Number": user.phoneNumber || "Unknown",
                "Email": user.email || "Unknown",
                "Flight Number": flight.flightNumber || "Unknown Flight",
                "Status": booking.status,
                "Total Price": booking.totalPrice,
                "Seat Class": ticketType.seatClass || "Unknown",
                "Ticket Name": ticketType.name || "Unknown",
                "Luggage": booking.luggage.length > 0
                    ? booking.luggage.map((lug) => `Price: ${lug.price}, Weight: ${lug.weight}kg`).join("; ")
                    : "No Luggage",
                "Passengers": booking.passengers.length > 0
                    ? booking.passengers.map(
                        (passenger) => `${passenger.firstName} ${passenger.lastName} (DOB: ${passenger.dateOfBirth})`
                    ).join("; ")
                    : "No Passengers",
            };
        });


        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
        XLSX.writeFile(workbook, "bookings.xlsx");
    };



    const filteredBookings = bookings.filter((booking) => {
        const user = booking.user;
        const userName = user ? user.username.toLowerCase() : '';
        const userPhone = user ? user.phoneNumber : '';
        const searchQuery = searchTerm.toLowerCase();


        return (
            userName.includes(searchQuery) ||
            String(userPhone).includes(searchQuery) ||
            String(booking.phoneNumber).includes(searchQuery)
        );
    });


    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const paginatedBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalFilteredPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    return (
        <div className="bookings-page">
            <h1>Manage Bookings</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search bookings by username or phone number..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);  // Reset page to 1 when search term changes
                    }}
                />
            </div>

            <button className="export-button" onClick={exportToExcel}>Export to Excel</button>

            <BookingTable bookings={paginatedBookings} users={users} flights={flights} />

            <Pagination
                currentPage={currentPage}
                totalPages={totalFilteredPages}  // Use totalFilteredPages instead of totalPages
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default BookingList;
