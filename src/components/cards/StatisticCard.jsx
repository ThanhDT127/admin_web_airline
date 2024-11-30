// src/components/cards/StatisticCard.jsx
import React from 'react';
import './StatisticCard.scss';

function StatisticCard({ title, value, change, icon, color, value2, value3 }) {
    return (
        <div className="statistic-card" style={{ backgroundColor: color }}>
            <div className="statistic-icon">{icon}</div>
            <div className="statistic-info">
                <h3>{value}</h3>
                <p>{title}</p>
                <small>{change}</small>
            </div>
        </div>
    );
}

export default StatisticCard;
