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
    // const [searchTerm, setSearchTerm] = useState("");
    const bookingsPerPage = 10;

    useEffect(() => {
        fetchBookings();
        fetchUsers();
        fetchFlights();
    }, [currentPage]);

    const fetchBookings = async () => {
        try {
            const response = await fetchWithToken(`${SERVER_API}/bookings/all`);
            const data = await response.json();
            setBookings(data.sort((a, b) => a.bookingId - b.bookingId));
            setTotalPages(Math.ceil(data.length / bookingsPerPage));
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bookings:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetchWithToken(`${SERVER_API}/users/all`);
            const data = await response.json();
            const userMap = {};
            data.forEach(user => {
                userMap[user.id] = `${user.firstName} ${user.lastName}`;
            });
            setUsers(userMap);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách users:', error);
        }
    };

    const fetchFlights = async () => {
        try {
            const response = await fetchWithToken(`${SERVER_API}/flights/all`);
            const data = await response.json();
            const flightMap = {};
            data.forEach(flight => {
                flightMap[flight.flightId] = flight.flightNumber;
            });
            setFlights(flightMap);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách flights:', error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(bookings);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
        XLSX.writeFile(workbook, 'bookings.xlsx');
    };
    // const filteredUsers = users.filter((bookings) =>
    //     bookings.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     bookings.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     String(bookings.phoneNumber).includes(searchTerm)
    // );

    const paginatedBookings = bookings.slice((currentPage - 1) * bookingsPerPage, currentPage * bookingsPerPage);

    return (
        <div className="bookings-page">
            <h1>Quản lý Bookings</h1>

            {/* <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search bookings by user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div> */}

            <button className="export-button" onClick={exportToExcel}>Export to Excel</button>

            <BookingTable bookings={paginatedBookings} users={users} flights={flights} />


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </div>
    );
};

export default BookingList;
