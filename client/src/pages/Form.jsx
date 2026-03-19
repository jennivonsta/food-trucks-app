import { useState } from "react";
import "../App.css";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    currentLocation: "",
    dailySpecial: "",
    slogan: "",
    hasVeganOptions: false,
    priceLevel: 1,
    rating: 0,
  });

  // Send form data to the API to add a new food truck
  async function writeFoodTruckData() {
    const dataForAPI = {
      name: formData.name,
      current_location: formData.currentLocation,
      daily_special: formData.dailySpecial,
      slogan: formData.slogan,
      has_vegan_options: formData.hasVeganOptions,
      price_level: Number(formData.priceLevel),
      rating: Number(formData.rating),
    };

    await fetch("/api/add-one-food-truck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForAPI),
    });
  }

  // handle changes to the form inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // handle when the user submits the form
  const handleSubmit = (e) => {
    e.preventDefault();
    writeFoodTruckData();
    alert("Thanks for submitting a new food truck!");
  };

  // render JSX for the form to the page
  return (
    <>
      <h1>Add Food Truck</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Food Truck Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Current Location
          <input
            type="text"
            name="currentLocation"
            value={formData.currentLocation}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Daily Special
          <input
            type="text"
            name="dailySpecial"
            value={formData.dailySpecial}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Slogan
          <input
            type="text"
            name="slogan"
            value={formData.slogan}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Has Vegan Options?
          <select
            name="hasVeganOptions"
            value={formData.hasVeganOptions}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>

        <label>
          Price Level
          <select
            name="priceLevel"
            value={formData.priceLevel}
            onChange={handleInputChange}
          >
            <option value="1">1 (Cheap)</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5 (Expensive)</option>
          </select>
        </label>

        <label>
          Rating (between 0 to 5)
          <input
            type="number"
            name="rating"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleInputChange}
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Form;