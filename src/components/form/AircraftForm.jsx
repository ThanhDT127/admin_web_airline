import React from 'react';
import './styles/AircraftForm.scss';

const AircraftForm = ({ currentAircraft, onSubmit, onCancel, errorMessage }) => {
    return (
        <div className="aircraft-form-container">
            <h3>{currentAircraft ? "Edit Aircraft" : "Add Aircraft"}</h3>
            <form onSubmit={onSubmit}>
                <label>
                    Aircraft Model:
                    <input
                        name="model"
                        type="text"
                        defaultValue={currentAircraft?.model || ""}
                        required
                    />
                    {errorMessage?.model && <span className="error">{errorMessage.model}</span>}
                </label>
                <label>
                    Total Seats:
                    <input
                        name="totalSeat"
                        type="number"
                        defaultValue={currentAircraft?.totalSeat || ""}
                        required
                    />
                    {errorMessage?.totalSeat && <span className="error">{errorMessage.totalSeat}</span>}
                </label>
                <div className="button-group">
                    <button type="submit" className="submit-button">{currentAircraft ? "Save Changes" : "Add Aircraft"}</button>
                    <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AircraftForm;
