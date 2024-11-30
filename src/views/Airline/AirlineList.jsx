import React, { useState, useEffect } from 'react';
import './AirlineList.scss';
import config from "../config.json";
import Pagination from '../../components/Pagination/Pagination';
import AirlineForm from '../../components/form/AirlineForm';
import AirlineTable from '../../components/tables/AirlineTable';
import { fetchWithToken } from '../fetchWithToken';
const { SERVER_API } = config;

const AirlineList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const airlinesPerPage = 5;
    const [airlines, setAirlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentAirline, setCurrentAirline] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    // Fetch all airlines

    useEffect(() => {
        const fetchAirlines = async () => {
            try {
                const response = await fetchWithToken(`${SERVER_API}/airlines/all`);
                const data = await response.json();

                // setAirlines(data);
                setAirlines(data.sort((a, b) => b.id - a.id));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching airlines:', error);
                setLoading(false);
            }
        };

        const intervalId = setInterval(fetchAirlines, 30000);

        fetchAirlines();

        return () => clearInterval(intervalId);

    }, []);

    useEffect(() => {
    }, [currentPage]);

    const handleEdit = (airline) => {
        setCurrentAirline(airline);
        setShowForm(true);
    };

    const handleDelete = async (airlineId) => {
        if (window.confirm("Are you sure you want to delete this airline?")) {
            try {
                const response = await fetchWithToken(`${SERVER_API}/airlines/delete/${airlineId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert("Airline deleted successfully");
                    setAirlines(airlines.filter(airline => airline.id !== airlineId));

                } else {
                    alert("Failed to delete airline");
                }
            } catch (error) {
                console.error('Error deleting airline:', error);
            }
        }
    };


    const handleAddNew = () => {
        setCurrentAirline(null);
        setShowForm(true);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const airlineData = {
            name: formData.get('name')?.trim(),
            code: formData.get('code')?.trim(),
        };
        console.log(airlineData)
        const errors = {};

        // Validation
        if (!airlineData.name) {
            errors.name = "Airline name is required.";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(airlineData.name)) {
            errors.name = "Airline name can only contain letters, numbers, and spaces.";
        } else if (airlineData.name.length < 3 || airlineData.name.length > 50) {
            errors.name = "Airline name must be between 3 and 50 characters.";
        }


        if (!airlineData.code) {
            errors.code = "Airline code is required.";
        } else if (!/^[A-Z0-9]{3,10}$/.test(airlineData.code)) {
            errors.code = "Airline code must be 3-10 uppercase letters (no spaces , no special character).";
        }


        const duplicate = airlines.find(
            (airline) =>
                airline.code === airlineData.code && airline.id !== currentAirline?.id
        );

        if (duplicate) {
            errors.code = "An airline with this code already exists.";
        }



        if (Object.keys(errors).length > 0) {
            setErrorMessage(errors);
            return;
        }


        if (
            currentAirline &&
            currentAirline.name === airlineData.name &&
            currentAirline.code === airlineData.code
        ) {
            alert("No changes detected. Please make changes before submitting.");
            return;
        }

        try {
            let response;
            if (currentAirline) {
                // Cập nhật airline
                response = await fetchWithToken(`${SERVER_API}/airlines/${currentAirline.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airlineData),
                });
            } else {
                // Thêm mới airline
                response = await fetchWithToken(`${SERVER_API}/airlines/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airlineData),
                });
            }

            if (response.ok) {
                alert(currentAirline ? "Airline updated successfully!" : "Airline added successfully!");
                setShowForm(false);
                const updatedAirlines = await fetchWithToken(`${SERVER_API}/airlines/all`);
                const data = await updatedAirlines.json();
                setAirlines(data.sort((a, b) => b.id - a.id));
            } else {
                const errorResponse = await response.json();
                alert(`Failed to submit airline: ${errorResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error submitting airline data:', error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(airlines);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Airlines");
        XLSX.writeFile(workbook, "Airlines_List.xlsx");
    };

    const filteredAirlines = airlines.filter((airline) =>
        airline.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastAirline = currentPage * airlinesPerPage;
    const indexOfFirstAirline = indexOfLastAirline - airlinesPerPage;
    const currentAirlines = filteredAirlines.slice(indexOfFirstAirline, indexOfLastAirline);
    const totalPages = Math.ceil(filteredAirlines.length / airlinesPerPage);

    if (loading) {
        return <div>Loading airlines...</div>;
    }


    return (
        <div className="airline-list-container">
            <h2>Airlines</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search airlines by code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button className="add-airline-button" onClick={handleAddNew}>
                Add Airline
            </button>

            <button className="export-airlines-button" onClick={exportToExcel}>
                Export to Excel
            </button>

            {showForm && (
                <AirlineForm
                    currentAirline={currentAirline}
                    onSubmit={handleSubmitForm}
                    onCancel={() => setShowForm(false)}
                    errorMessage={errorMessage}
                />
            )}

            <AirlineTable
                airlines={currentAirlines}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />


            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </div>
    );
};

export default AirlineList;
