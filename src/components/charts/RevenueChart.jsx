// src/components/charts/RevenueChart.jsx
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './styles/RevenueChart.scss';

// Register components used by Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function RevenueChart({ revenueData, filterType, setFilterType, selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }) {
    const chartData = {
        labels: Object.keys(revenueData),
        datasets: [
            {
                label: `Revenue by ${filterType}`,
                data: Object.values(revenueData),
                fill: true,
                borderColor: 'blue',
                backgroundColor: 'rgba(75,192,192,0.2)',
                tension: 0.1,
            }
        ]
    };

    return (
        <div className="chart_revenue">
            <h2>Revenue Chart</h2>
            <div className="chart-options">
                <button className='button_option_chart_revenue' onClick={() => setFilterType('day')}>By Day</button>
                <button className='button_option_chart_revenue' onClick={() => setFilterType('month')}>By Month</button>
                <button className='button_option_chart_revenue' onClick={() => setFilterType('year')}>By Year</button>
            </div>

            {filterType === 'month' && (
                <div className="dropdown-container">
                    <label>Select Year: </label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                        {[...Array(10)].map((_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>
                </div>
            )}

            {filterType === 'day' && (
                <div className="dropdown-container">
                    <label>Select Year: </label>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                        {[...Array(10)].map((_, i) => {
                            const year = new Date().getFullYear() - i;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>
                    <label>Select Month: </label>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                                {new Date(0, month - 1).toLocaleString('en-US', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="chart-container">
                <Line data={chartData} />
            </div>
        </div>
    );
}

export default RevenueChart;
