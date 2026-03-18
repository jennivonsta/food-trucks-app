function Form() {
  return (
    <section className="form-page">
      <div className="form-card">
        <h1>Add Food Truck</h1>

        <form className="food-truck-form">
          <div className="form-group">
            <label htmlFor="name">Food Truck Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter food truck name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Current Location</label>
            <input
              id="location"
              name="current_location"
              type="text"
              placeholder="Enter current location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dailySpecial">Daily Special</label>
            <input
              id="dailySpecial"
              name="daily_special"
              type="text"
              placeholder="Enter daily special"
            />
          </div>

          <div className="form-group">
            <label htmlFor="slogan">Slogan</label>
            <input
              id="slogan"
              name="slogan"
              type="text"
              placeholder="Enter slogan"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vegan">Has Vegan Options?</label>
            <div className="select-wrapper">
              <select id="vegan" name="has_vegan_options" defaultValue="false">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priceLevel">Price Level</label>
            <div className="select-wrapper">
              <select id="priceLevel" name="price_level" defaultValue="1">
                <option value="1">1 (Cheap)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (Expensive)</option>
              </select>
            </div>
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="rating">Rating (between 0 to 5)</label>
            <input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="0"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}

export default Form;