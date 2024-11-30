import React, { useState, useEffect } from 'react';
import './AircraftList.scss';
import config from "../config.json";
import * as XLSX from 'xlsx';
import AircraftForm from "../../components/form/AircraftForm";
import AircraftTable from '../../components/tables/AircraftTable';
import Pagination from '../../components/Pagination/Pagination';
import { fetchWithToken } from '../fetchWithToken';

const { SERVER_API } = config;

const AircraftList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const aircraftPerPage = 5;
    const [aircrafts, setAircrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentAircraft, setCurrentAircraft] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchAircrafts = async () => {
            try {
                const response = await fetchWithToken(`${SERVER_API}/aircraft/all`);
                const data = await response.json();
                setAircrafts(data.sort((a, b) => b.id - a.id));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching aircrafts:', error);
                setLoading(false);
            }
        };
        const intervalId = setInterval(fetchAircrafts, 30000);

        fetchAircrafts();

        return () => clearInterval(intervalId);
    }, []);

    const handleEdit = (aircraft) => {
        setCurrentAircraft(aircraft);
        setShowForm(true);
    };

    const handleDelete = async (aircraftId) => {
        if (window.confirm("Are you sure you want to delete this aircraft?")) {
            try {
                const response = await fetchWithToken(`${SERVER_API}/aircraft/delete/${aircraftId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert("Aircraft deleted successfully");
                    setAircrafts(aircrafts.filter(aircraft => aircraft.id !== aircraftId));
                } else {
                    alert("Failed to delete aircraft");
                }
            } catch (error) {
                console.error('Error deleting aircraft:', error);
            }
        }
    };

    const handleAddNew = () => {
        setCurrentAircraft(null);
        setShowForm(true);
        setErrorMessage("");
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const aircraftData = {
            model: formData.get('model')?.trim(),
            totalSeat: parseInt(formData.get('totalSeat'), 10),
        };

        const errors = {};

        // Validation
        if (!aircraftData.model) {
            errors.model = "Model name is required.";
        } else if (!/^[a-zA-Z0-9\s\-]+$/.test(aircraftData.model)) {
            errors.model = "Model name must only contain letters, numbers, spaces, and dashes.";
        } else if (aircraftData.model.length < 3 || aircraftData.model.length > 50) {
            errors.model = "Model name must be between 3 and 50 characters.";
        }

        if (!aircraftData.totalSeat || isNaN(aircraftData.totalSeat)) {
            errors.totalSeat = "Total seats must be a valid number.";
        } else if (!Number.isInteger(aircraftData.totalSeat)) {
            errors.totalSeat = "Total seats must be an integer.";
        } else if (aircraftData.totalSeat <= 0) {
            errors.totalSeat = "Total seats must be greater than 0.";
        } else if (aircraftData.totalSeat > 2000) {
            errors.totalSeat = "Total seats must not exceed 2000.";
        }

        const duplicateAircraft = aircrafts.find(
            aircraft => aircraft.model.toLowerCase() === aircraftData.model.toLowerCase() &&
                aircraft.id !== currentAircraft?.id
        );
        if (duplicateAircraft) {
            errors.model = "An aircraft with this model already exists.";
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return;
        }

        try {
            let response;
            if (currentAircraft) {

                if (
                    currentAircraft &&
                    currentAircraft.model === aircraftData.model &&
                    currentAircraft.totalSeat === aircraftData.totalSeat
                ) {
                    alert("No changes detected. Please make changes before submitting.");
                    return;
                }

                response = await fetchWithToken(`${SERVER_API}/aircraft/${currentAircraft.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(aircraftData),
                });
            } else {
                response = await fetchWithToken(`${SERVER_API}/aircraft/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(aircraftData),
                });
            }

            if (response.ok) {
                alert(currentAircraft ? "Aircraft updated successfully" : "Aircraft added successfully");
                setShowForm(false);
                const updatedAircrafts = await fetchWithToken(`${SERVER_API}/aircraft/all`);
                const data = await updatedAircrafts.json();
                setAircrafts(data.sort((a, b) => b.id - a.id));
            } else {
                const errorResponse = await response.json();
                alert(`Failed to submit aircraft data: ${errorResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting aircraft data:', error);
            alert('An error occurred while submitting aircraft data. Please try again.');
        }
    };
    const exportToExcel = () => {
        setAircrafts(aircrafts.sort((a, b) => a.id - b.id))
        const worksheet = XLSX.utils.json_to_sheet(aircrafts);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Aircrafts");
        XLSX.writeFile(workbook, "Aircrafts_List.xlsx");
    };

    const filteredAircrafts = aircrafts.filter((aircraft) =>
        aircraft.model.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastAircraft = currentPage * aircraftPerPage;
    const indexOfFirstAircraft = indexOfLastAircraft - aircraftPerPage;
    const currentAircrafts = filteredAircrafts.slice(indexOfFirstAircraft, indexOfLastAircraft);
    const totalPages = Math.ceil(filteredAircrafts.length / aircraftPerPage);

    if (loading) {
        return <div>Loading aircrafts...</div>;
    }

    return (
        <div className="aircraft-list-container">
            <h2>Aircrafts</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search aircraft by model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button className="add-aircraft-button" onClick={handleAddNew}>
                Add Aircraft
            </button>
            <button className="export-aircraft-button" onClick={exportToExcel}>
                Export to Excel
            </button>
            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <AircraftForm
                            currentAircraft={currentAircraft}
                            onSubmit={handleSubmitForm}
                            onCancel={() => setShowForm(false)}
                            errorMessage={errorMessage}
                        />
                    </div>
                </div>
            )}

            <AircraftTable
                currentAircrafts={currentAircrafts}
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

export default AircraftList;
