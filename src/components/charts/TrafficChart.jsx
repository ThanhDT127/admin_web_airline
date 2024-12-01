import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './styles/TrafficChart.scss';
import { fetchWithToken } from '../../views/fetchWithToken';

const TrafficChart = () => {
    const [data, setData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    const getPastTenYears = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 10 }, (_, i) => currentYear - i);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const flightsResponse = await fetchWithToken(`http://localhost:8080/api/flights/all`);
            const flightsData = await flightsResponse.json();
            const bookingsResponse = await fetchWithToken(`http://localhost:8080/api/bookings/all`);
            const bookingsData = await bookingsResponse.json();

            const monthlyFlights = Array(12).fill(0);
            flightsData.forEach((flight) => {
                const flightDate = new Date(flight.departureTime);
                if (flightDate.getFullYear() === parseInt(year)) {
                    const month = flightDate.getMonth();
                    monthlyFlights[month] += 1;
                }
            });

            const monthlyBookings = Array(12).fill(0);
            const monthlyIncome = Array(12).fill(0);
            bookingsData.forEach((booking) => {
                const bookingDate = new Date(booking.bookingDate);
                if (bookingDate.getFullYear() === parseInt(year)) {
                    const month = bookingDate.getMonth();
                    monthlyBookings[month] += 1;
                    if (booking.status === "CONFIRMED") {
                        monthlyIncome[month] += booking.totalPrice;
                    }
                }
            });

            const formattedData = monthlyFlights.map((_, index) => ({
                month: new Date(0, index).toLocaleString('en', { month: 'short' }),
                Flights: monthlyFlights[index],
                Bookings: monthlyBookings[index],
                Income: monthlyIncome[index],
            }));

            setData(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            fetchData();
        }, 30000);
        return () => clearInterval(intervalId);
    }, [year]);

    const exportChartToPDF = async () => {
        const chartElement = document.querySelector('.traffic-chart-container');
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Resize image to fit A4
        pdf.save(`Traffic_Chart_${year}.pdf`);
    };

    if (loading) {
        return <div className="loading">Loading chart...</div>;
    }

    return (
        <div className="traffic-chart-container">
            <h2 className="chart-title">Monthly Traffic and Income Data</h2>
            <button className="export-chart-btn" onClick={exportChartToPDF}>
                Export Chart to PDF
            </button>
            <div className="year-selector">

                <label>Select Year: </label>
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                    {getPastTenYears().map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

            </div>
            <LineChart width={900} height={600} data={data} className="traffic-chart">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Bookings" stroke="#8884d8" />
                <Line type="monotone" dataKey="Flights" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Income" stroke="#ffc658" />
            </LineChart>

        </div>
    );
};

export default TrafficChart;
