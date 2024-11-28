import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './AirportList.scss';
import config from "../config.json";
import Pagination from '../../components/Pagination/Pagination';
import AirportForm from '../../components/form/AirportForm';
import AirportTable from '../../components/tables/AirportTable';
import { fetchWithToken } from '../fetchWithToken';

const { SERVER_API } = config;

const AirportList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const airportsPerPage = 5;
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentAirport, setCurrentAirport] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    // Fetch all airports data
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await fetchWithToken(`${SERVER_API}/airports/all`);
                const data = await response.json();
                setAirports(data.sort((a, b) => b.id - a.id));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching airports:', error);
                setLoading(false);
            }
        };

        fetchAirports();
    }, []);

    const handleEdit = (airport) => {
        setCurrentAirport(airport);
        setShowForm(true);
    };

    const handleDelete = async (airportId) => {
        if (window.confirm("Are you sure you want to delete this airport?")) {
            try {
                const response = await fetchWithToken(`${SERVER_API}/airports/delete/${airportId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert("Airport deleted successfully");
                    setAirports(airports.filter(airport => airport.id !== airportId));
                } else {
                    alert("Failed to delete airport");
                }
            } catch (error) {
                console.error('Error deleting airport:', error);
            }
        }
    };

    const handleAddNew = () => {
        setCurrentAirport(null);
        setShowForm(true);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const airportData = {
            code: formData.get('code').trim(),
            name: formData.get('name').trim(),
            city: formData.get('city').trim(),
            country: formData.get('country').trim(),
        };
        console.log(airportData);
        const errors = {};

        if (!airportData.code) {
            errors.code = "Code is required.";
        } else if (!/^[A-Z0-9]{3,10}$/.test(airportData.code)) {
            errors.code = "Airline code must be 3-10 uppercase letters (no spaces , no special character).";
        }

        if (!airportData.name) {
            errors.name = "Name is required.";
        } else if (airportData.name.length > 50) {
            errors.name = "Name must not exceed 50 characters.";
        } else if (airportData.name.length < 3) {
            errors.name = "Name must be lager 3 characters.";
        } else if (!/^[A-Za-z\s]+$/.test(airportData.name)) {
            errors.name = "Name must contain only letters and spaces.";
        }

        if (!airportData.city) {
            errors.city = "City is required.";
        } else if (airportData.city.length > 50) {
            errors.city = "City must not exceed 50 characters.";
        } else if (airportData.city.length < 3) {
            errors.city = "Name must be lager 3 characters.";
        } else if (!/^[A-Za-z\s]+$/.test(airportData.city)) {
            errors.city = "Name must contain only letters and spaces.";
        }

        if (!airportData.country) {
            errors.country = "Country is required.";
        } else if (airportData.country.length > 50) {
            errors.country = "Country must not exceed 50 characters.";
        } else if (airportData.country.length < 3) {
            errors.country = "Name must be lager 3 characters.";
        } else if (!/^[A-Za-z\s]+$/.test(airportData.country)) {
            errors.country = "Name must contain only letters and spaces.";
        }

        if (currentAirport) {
            const hasChanges =
                airportData.code !== currentAirport.code ||
                airportData.name !== currentAirport.name ||
                airportData.city !== currentAirport.city ||
                airportData.country !== currentAirport.country;

            if (!hasChanges) {
                alert("No fields have been modified.");
                return;
            }
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return;
        }

        try {
            let response;
            if (currentAirport) {
                response = await fetchWithToken(`${SERVER_API}/airports/${currentAirport.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airportData),
                });
            } else {
                response = await fetchWithToken(`${SERVER_API}/airports/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airportData),
                });
            }

            if (response.ok) {
                alert(currentAirport ? "Airport updated successfully!" : "Airport added successfully!");
                setShowForm(false);
                const response = await fetchWithToken(`${SERVER_API}/airports/all`);
                const data = await response.json();
                setAirports(data.sort((a, b) => b.id - a.id));
            } else {
                console.log("Error submitting airport data.");
            }
        } catch (error) {
            console.error("Error submitting airport data:", error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(airports);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Airports");
        XLSX.writeFile(workbook, "Airports_List.xlsx");
    };

    const filteredAirports = airports.filter((airport) =>
        airport.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastAirport = currentPage * airportsPerPage;
    const indexOfFirstAirport = indexOfLastAirport - airportsPerPage;
    const currentAirports = filteredAirports.slice(indexOfFirstAirport, indexOfLastAirport);
    const totalPages = Math.ceil(filteredAirports.length / airportsPerPage);

    if (loading) {
        return <div>Loading airports...</div>;
    }

    return (
        <div className="airport-list-container">
            <h2>Airports</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search airports by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button className="add-airport-button" onClick={handleAddNew}>
                Add Airport
            </button>

            <button className="export-airport-button" onClick={exportToExcel}>
                Export to Excel
            </button>

            {showForm && (
                <AirportForm
                    currentAirport={currentAirport}
                    onSubmit={handleSubmitForm}
                    onCancel={() => setShowForm(false)}
                    errorMessage={errorMessage}
                />
            )}
            <AirportTable
                airports={currentAirports}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />


        </div>
    );
};

export default AirportList;
