import React from 'react';
import './styles/AirportForm.scss'
const AirportForm = ({ currentAirport, onSubmit, onCancel, errorMessage }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onCancel}>&times;</span>
                <h3>{currentAirport ? "Edit Airport" : "Add Airport"}</h3>
                <form onSubmit={onSubmit}>
                    <label>
                        Code:
                        <input
                            name="code"
                            type="text"
                            maxLength="10"
                            defaultValue={currentAirport?.code || ""}
                            required
                        />
                        {errorMessage?.code && <span className="error">{errorMessage.code}</span>}
                    </label>
                    <label>
                        Name:
                        <input
                            name="name"
                            type="text"
                            maxLength="15"
                            defaultValue={currentAirport?.name || ""}
                            required
                        />
                        {errorMessage?.name && <span className="error">{errorMessage.name}</span>}
                    </label>
                    <label>
                        City:
                        <input
                            name="city"
                            type="text"
                            defaultValue={currentAirport?.city || ""}
                            required
                        />
                        {errorMessage?.city && <span className="error">{errorMessage.city}</span>}
                    </label>
                    <label>
                        Country:
                        <input
                            name="country"
                            type="text"
                            defaultValue={currentAirport?.country || ""}
                            required
                        />
                        {errorMessage?.country && <span className="error">{errorMessage.country}</span>}
                    </label>
                    <button type="submit" className="submit-button">{currentAirport ? "Save Changes" : "Add Airport"}</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AirportForm;
