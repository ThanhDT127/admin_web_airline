import React from 'react';
import './styles/AirlineForm.scss';

const AirlineForm = ({ currentAirline, onSubmit, onCancel, errorMessage }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onCancel}>&times;</span>
                <h3>{currentAirline ? "Edit Airline" : "Add Airline"}</h3>
                <form onSubmit={onSubmit}>
                    <label>
                        Airline Name:
                        <input
                            name="name"
                            type="text"
                            defaultValue={currentAirline?.name || ""}
                            required
                        />
                        {errorMessage?.name && <span className="error">{errorMessage.name}</span>}
                    </label>
                    <label>
                        Airline Code:
                        <input
                            name="code"
                            type="text"
                            defaultValue={currentAirline?.code || ""}
                            required
                        />
                        {errorMessage?.code && <span className="error">{errorMessage.code}</span>}
                    </label>
                    <div className="button-container">
                        <button type="submit" className="submit-button">{currentAirline ? "Save Changes" : "Add Airline"}</button>
                        <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AirlineForm;
