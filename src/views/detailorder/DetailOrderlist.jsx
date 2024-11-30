import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import config from '../config.json';
import './DetailOrderlist.scss';
import Pagination from '../../components/Pagination/Pagination';
import DetailOrderlistTable from '../../components/tables/DetailOrderlistTable';
import UserDetailTable from '../../components/tables/UserDetailTable'; // Import UserTable component
import { fetchWithToken } from '../fetchWithToken';
const { SERVER_API } = config;

const DetailOrderlist = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [flights, setFlights] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 5;
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {

                const userResponse = await fetchWithToken(`${SERVER_API}/users/${id}`);
                const userData = await userResponse.json();
                setUser(userData);

                // Lấy tất cả bookings và lọc theo userId
                const bookingsResponse = await fetchWithToken(`${SERVER_API}/bookings/all`);
                const bookingsData = await bookingsResponse.json();
                const userBookings = bookingsData.filter(booking => booking.user.id === Number(id));
                setBookings(userBookings);

                // Lấy thông tin flights liên quan đến bookings của user
                const flightIds = userBookings.map(booking => booking.flightId);
                const flightsResponse = await fetchWithToken(`${SERVER_API}/flights/all`);
                const flightsData = await flightsResponse.json();
                const relatedFlights = flightsData.filter(flight => flightIds.includes(flight.flightId));
                setFlights(relatedFlights);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(intervalId);

    }, [id]);

    if (loading) {
        return <div>Loading details...</div>;
    }


    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);


    const totalPages = Math.ceil(bookings.length / bookingsPerPage);


    return (
        <div className="detail-container">
            <h2>User Details</h2>
            {user && <UserDetailTable user={user} />}
            <h2>Bookings</h2>
            <DetailOrderlistTable
                bookings={bookings}
                flights={flights}
                currentBookings={currentBookings}
            />

            {/* Pagination component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage) => setCurrentPage(newPage)}
            />

            <Link to="/users">
                <button className="back-button">Back to List User</button>
            </Link>
        </div>
    );
};

export default DetailOrderlist;
