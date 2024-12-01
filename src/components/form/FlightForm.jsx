import React from "react";
import "./styles/FlightForm.scss";

const FlightForm = ({
    currentFlight,
    aircrafts,
    airlines,
    airports,
    transitPoints,
    setTransitPoints,
    showTransitPointFields,
    handleAddTransitPoint,
    handleRemoveTransitPoint,
    handleSubmitForm,
    setShowForm,

}) => {

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="flight-form">
                    <h3>{currentFlight ? "Edit Flight" : "Add Flight"}</h3>
                    <form onSubmit={handleSubmitForm}>
                        <label>
                            Flight Number:
                            <input type="text" name="flightNumber" required defaultValue={currentFlight?.flightNumber} />
                        </label>
                        <label>
                            Aircraft Model:
                            <select name="aircraftId" required defaultValue={currentFlight?.aircraft.aircraftId}>
                                <option value="">Select Aircraft</option>
                                {aircrafts.map((aircraft) => (
                                    <option key={aircraft.id} value={aircraft.id}>
                                        {aircraft.model}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Airline Name:
                            <select name="airlineId" required defaultValue={currentFlight?.airline.airlineId}>
                                <option value="">Select Airline</option>
                                {airlines.map((airline) => (
                                    <option key={airline.id} value={airline.id}>
                                        {airline.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Departure Airport:
                            <select name="departureAirportId" required defaultValue={currentFlight?.departureAirport.airportId}>
                                <option value="">Select Departure Airport</option>
                                {airports.map((airport) => (
                                    <option key={airport.id} value={airport.id}>
                                        {airport.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Arrival Airport:
                            <select name="arrivalAirportId" required defaultValue={currentFlight?.arrivalAirport.airportId}>
                                <option value="">Select Arrival Airport</option>
                                {airports.map((airport) => (
                                    <option key={airport.id} value={airport.id}>
                                        {airport.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Departure Time:
                            <input
                                type="datetime-local"
                                name="departureTime"
                                required
                                defaultValue={
                                    currentFlight
                                        ? new Date(currentFlight.departureTime).toISOString().slice(0, 16)
                                        : ""
                                }
                            />
                        </label>
                        <label>
                            Arrival Time:
                            <input
                                type="datetime-local"
                                name="arrivalTime"
                                required
                                defaultValue={
                                    currentFlight
                                        ? new Date(currentFlight.arrivalTime).toISOString().slice(0, 16)
                                        : ""
                                }
                            />
                        </label>
                        <label>
                            Base Price:
                            <input type="number" name="basePrice" required defaultValue={currentFlight?.basePrice} />
                        </label>
                        <label>
                            Status:
                            <select name="status" required defaultValue={currentFlight?.status}>
                                <option value="SCHEDULED">SCHEDULED</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="DELAYED">DELAYED</option>
                            </select>
                        </label>

                        {showTransitPointFields &&
                            transitPoints.map((point, index) => (
                                <div key={index} className="transit-point">
                                    <h3>Transit Point</h3>
                                    <label>
                                        Stop Order:
                                        <span>{point.stopOrder}</span>
                                    </label>
                                    <label>
                                        Airport Stop:
                                        <select
                                            value={point.airport.airportId}
                                            onChange={(e) => {
                                                // Tìm sân bay được chọn trong danh sách airports
                                                const selectedAirport = airports.find(
                                                    (airport) => airport.id === parseInt(e.target.value)
                                                );

                                                if (selectedAirport) {

                                                    const newPoints = [...transitPoints];
                                                    newPoints[index] = {
                                                        ...newPoints[index],
                                                        airport: {
                                                            airportId: selectedAirport.id,
                                                            airportCode: selectedAirport.airportCode,
                                                            airportName: selectedAirport.name,
                                                            city: selectedAirport.city,
                                                            country: selectedAirport.country,
                                                            timezone: selectedAirport.timezone,
                                                        }
                                                    };

                                                    setTransitPoints(newPoints);
                                                }
                                            }}
                                        >
                                            <option value="">Select Airport</option>
                                            {airports.map((airport) => (
                                                <option key={airport.id} value={airport.id}>
                                                    {airport.name}
                                                </option>
                                            ))}
                                        </select>

                                    </label>

                                    <label>
                                        Arrival Time:
                                        <input
                                            type="datetime-local"
                                            value={point.arrivalTime || ''}
                                            onChange={(e) => {
                                                const newPoints = [...transitPoints];
                                                newPoints[index].arrivalTime = e.target.value;
                                                setTransitPoints(newPoints);
                                            }}
                                        />
                                    </label>
                                    <label>
                                        Departure Time:
                                        <input
                                            type="datetime-local"
                                            value={point.departureTime || ''}
                                            onChange={(e) => {
                                                const newPoints = [...transitPoints];
                                                newPoints[index].departureTime = e.target.value;
                                                setTransitPoints(newPoints);
                                            }}
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        className="button-remove-transitpoint"
                                        onClick={() => handleRemoveTransitPoint(index)}
                                    >
                                        Remove Transit Point
                                    </button>
                                </div>
                            ))}


                        <button type="button" className="button-add-transitpoint" onClick={handleAddTransitPoint}>
                            Add Transit Point
                        </button>
                        <button className="button-submit">{currentFlight ? "Save Changes" : "Add Flight"}</button>
                        <button type="button" className="button-cancel" onClick={() => {
                            setShowForm(false);
                            // setShowTransitPointFields(false);
                            setTransitPoints([]);
                        }}>
                            Cancel
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default FlightForm;
