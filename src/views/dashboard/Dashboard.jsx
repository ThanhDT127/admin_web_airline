// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatisticCard from '../../components/cards/StatisticCard';
import TrafficChart from '../../components/charts/TrafficChart';
import RevenueChart from '../../components/charts/RevenueChart';
import FlightTable from '../../components/tables/TopFlightTable';
import Pagination from '../../components/Pagination/Pagination';
import { fetchWithToken } from '../fetchWithToken';
import config from '../config.json';
import './Dashboard.scss';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const { SERVER_API } = config;

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 5;
  const [filterType, setFilterType] = useState('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetchWithToken(`${SERVER_API}/bookings/all`);
        const data = await response.json();
        const confirmedBookings = data.filter(booking => booking.status === 'CONFIRMED');
        setBookings(confirmedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  // Fetch flights
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetchWithToken(`${SERVER_API}/flights/all`);
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };
    fetchFlights();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWithToken(`${SERVER_API}/users/all`);
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  const totalUsers = users.length;
  const totalFlights = flights.length;
  const totalBookings = bookings.length;
  const totalIncome = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);


  const calculateRevenue = (type) => {
    const revenueByTime = {};
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.bookingDate);
      let timeKey;
      if (type === 'month') {
        if (bookingDate.getFullYear() === selectedYear) {
          timeKey = bookingDate.toLocaleString('en-US', { month: 'long' });
        }
      } else if (type === 'year') {
        timeKey = `${bookingDate.getFullYear()}`;
      } else {
        if (bookingDate.getFullYear() === selectedYear && (bookingDate.getMonth() + 1) === selectedMonth) {
          timeKey = `${bookingDate.getDate()}`;
        }
      }
      if (timeKey) {
        revenueByTime[timeKey] = (revenueByTime[timeKey] || 0) + booking.totalPrice;
      }
    });

    const sortedRevenue = Object.keys(revenueByTime)
      .sort((a, b) => {
        if (type === 'month') {
          const monthOrder = {
            January: 1, February: 2, March: 3, April: 4,
            May: 5, June: 6, July: 7, August: 8,
            September: 9, October: 10, November: 11, December: 12
          };
          return monthOrder[a] - monthOrder[b];
        } else {
          return parseInt(a) - parseInt(b);
        }
      })
      .reduce((obj, key) => {
        obj[key] = revenueByTime[key];
        return obj;
      }, {});
    return sortedRevenue;
  };

  const revenueData = calculateRevenue(filterType);

  // Function to calculate top 10 flights
  const getTopFlights = () => {
    const flightMap = {};

    flights.forEach((flight) => {
      const key = `${flight.departureAirport.airportId}-${flight.arrivalAirport.airportId}`;
      flightMap[key] = (flightMap[key] || 0) + 1;
    });

    const sortedFlights = Object.entries(flightMap)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10);

    return sortedFlights.map(([key]) => {
      const [departure, arrival] = key.split('-');
      return flights.find(
        (flight) =>
          flight.departureAirport.airportId === parseInt(departure) &&
          flight.arrivalAirport.airportId === parseInt(arrival)
      );
    });
  };

  const topFlights = getTopFlights();


  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = topFlights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(topFlights.length / flightsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }
  // console.log(topFlights)
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="statistics">
        <StatisticCard title="Total Users" value={totalUsers} icon="👥" color="#6f42c1" />
        <StatisticCard title="Total Flights" value={totalFlights} icon="✈️" color="#007bff" />
        <StatisticCard title="Total Bookings" value={totalBookings} icon="📑" color="#ffc107" />
        <StatisticCard title="Total Income" value={`$${totalIncome.toFixed(2)}`} icon="💰" color="#28a745" />
      </div>

      <div className="charts">
        <TrafficChart />
      </div>

      <div className="chart_revenue">
        <RevenueChart
          revenueData={revenueData}
          filterType={filterType}
          setFilterType={setFilterType}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </div>

      {/* Flights Table */}
      <FlightTable flights={currentFlights} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </div>
  );
}

export default Dashboard;
