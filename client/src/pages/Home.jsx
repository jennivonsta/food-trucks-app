import { useEffect, useState } from "react";
import "../App.css";

function Home() {
  const [foodTrucks, setFoodTrucks] = useState([]);

  // separate function 
  const getFoodTrucksData = async () => {
    try {
      const response = await fetch(
        "/api/get-all-food-trucks"
      );
      const data = await response.json();
      console.log(data);
      setFoodTrucks(data);
    } catch (error) {
      console.error("Error fetching food trucks:", error);
    }
  };

  // useEffect ONLY calls the function
  useEffect(() => {
    getFoodTrucksData();
  }, []);

  return (
    <section className="home-page">
      <div className="food-trucks-wrapper">
        <h1>All Food Trucks</h1>
        <h2>Total number of food trucks: {foodTrucks.length}</h2>

        <div className="food-trucks-grid">
          {foodTrucks.map((truck) => (
            <div className="food-truck-card" key={truck.id}>
              <h3>{truck.name}</h3>

              <p><strong>Id:</strong> {truck.id}</p>
              <p><strong>Location:</strong> {truck.current_location}</p>
              <p><strong>Daily Special:</strong> {truck.daily_special}</p>
              <p><strong>Slogan:</strong> {truck.slogan}</p>
              <p>
                <strong>Has Vegan Options:</strong>{" "}
                {truck.has_vegan_options ? "Yes ✅" : "No ❌"}
              </p>
              <p><strong>Price Level:</strong> {truck.price_level}</p>
              <p><strong>Rating:</strong> {truck.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;