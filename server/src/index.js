// ---------------------------------
// Boilerplate Code to Set Up Server
// ---------------------------------

// imports the Express library so the app can create a server and routes
import express from "express";
// imports PostgreSQL tools from the pg package so the app can connect to the database
import pg from "pg";
// imports the config file that stores the database URL
import config from "./config.js";

// creates a new PostgreSQL connection pool and stores it in the db variable
const db = new pg.Pool({
  // uses the database URL from config and adds uselibpqcompat=true to the connection string
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  // turns on SSL because Neon requires a secure connection
  ssl: true,
});

// creates the Express app and stores it in the app variable
const app = express();
// tells Express to automatically read JSON data from incoming requests
app.use(express.json());

// sets the port number the server will run on
const port = 3000;
// starts the server listening on port 3000
app.listen(port, () => {
  // logs a message to the terminal so we know the server started successfully
  console.log(`Server is listening on port ${port}`);
});

// ---------------------------------
// Helper Functions
// ---------------------------------

// 1. getAllFoodTrucks()
// this helper function gets all food trucks from the database
async function getAllFoodTrucks() {
  // runs a SQL query to select every row from the food_trucks table
  const result = await db.query("SELECT * FROM food_trucks;");
  // returns just the rows array from the query result
  return result.rows;
}


// 2. getFoodTruckById(id)
// this helper function finds one food truck by its id
async function getFoodTruckById(id) {
  // runs a SQL query to select the row where the id matches the value passed in
  const result = await db.query("SELECT * FROM food_trucks WHERE id = $1", [
    // passes the id into the SQL query as the value for $1
    id,
  ]);

  // returns the first matching row from the results
  return result.rows[0];
}


// 3. getVeganFoodTrucks()


// 4. getFoodTrucksByPrice(price)
// this helper function finds food trucks by a certain price level
async function getFoodTruckByPrice(price) {
  // runs a SQL query to select all food trucks where the price_level matches the value passed in
  const result = await db.query(
    // this SQL statement filters the food_trucks table by price_level
    "SELECT * FROM food_trucks WHERE price_level = $1", [price]
  );
  // returns all matching food truck rows
  return result.rows;
   }

// 5. GET /get-top-rated-food-trucks
// creates a GET route that returns the top rated food trucks
app.get("/get-top-rated-food-trucks", async (req, res) => {
  // calls the helper function to get trucks with rating 4.5 or higher
  const trucks = await getTopRatedFoodTrucks();
  // sends the trucks back as JSON
  res.json(trucks);
});


// 6. GET /get-food-trucks-sorted-by-rating
// creates a GET route that returns food trucks sorted by rating
app.get("/get-food-trucks-sorted-by-rating", async (req, res) => {
  // calls the helper function that sorts the trucks by rating
  const trucks = await getFoodTrucksSortedByRating();
  // sends the sorted trucks back as JSON
  res.json(trucks);
});

// 7. getFoodTrucksSortedByPrice()
// this helper function gets food trucks sorted by price level
async function sortedByPrice() {
  // runs a SQL query that selects the name, id, and price_level columns and sorts them by price_level from highest to lowest
  const result = await db.query(
    "SELECT name, id, price_level FROM food_trucks ORDER BY price_level DESC",
  );
  // logs the sorted rows to the terminal for testing
  console.log(result.rows);
  // returns the sorted rows
  return result.rows;
}

// 8. getFoodTrucksCount()
// this helper function counts how many food trucks are in the table
async function getFoodTrucksCount() {
  // runs a SQL query that counts all rows in the food_trucks table
  const result = await db.query("SELECT COUNT(*) FROM food_trucks")
  // returns the first row, which contains the count value
  return result.rows[0];
}


// 9. addOneFoodTruck(name, current_location, daily_special, slogan, has_vegan_options, price_level, rating)
// this helper function adds one new food truck into the database
async function addOneFoodTruck(
  // this parameter stores the food truck name
  name,
  // this parameter stores the current location
  current_location,
  // this parameter stores the daily special
  daily_special,
  // this parameter stores the slogan
  slogan,
  // this parameter stores whether the truck has vegan options
  has_vegan_options,
  // this parameter stores the price level
  price_level,
  // this parameter stores the rating
  rating,
) {
  // runs an INSERT query to add a new food truck into the table
  const result = await db.query(
    // this SQL inserts values into the listed columns and returns the newly added row
    `INSERT INTO food_trucks
     (name, current_location, daily_special, slogan, has_vegan_options, price_level, rating)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    // this array provides the values that replace $1 through $7 in the SQL query
    [
      // sends the name value as $1
      name,
      // sends the current_location value as $2
      current_location,
      // sends the daily_special value as $3
      daily_special,
      // sends the slogan value as $4
      slogan,
      // sends the has_vegan_options value as $5
      has_vegan_options,
      // sends the price_level value as $6
      price_level,
      // sends the rating value as $7
      rating,
    ],
  );

  // returns the newly inserted row
  return result.rows[0];
}

// 10. deleteOneFoodTruck(id)
// this function deletes a food truck using its id
async function deleteOneFoodTruck(id) {

  // first we look up the truck by id so we can grab its name
  // this helps us show a nicer success message later
  const truckName = await db.query(
    // this query finds the name of the truck with the matching id
    `SELECT name FROM food_trucks WHERE id = $1`,
    // $1 gets replaced with the id we pass in
    [id],
  );

  // if nothing comes back, that means the truck doesn't exist
  if (truckName.rows.length === 0) {
    // return a message saying no truck was found
    return `No truck found with id ${id}, or name ${truckName}`;
  }

  // now we actually delete the truck from the database
  await db.query(`DELETE FROM food_trucks WHERE id = $1`, [id]);

  // get the name from the earlier query
  const name = truckName.rows[0].name;

  // log a success message in the terminal
  console.log(`Success! Food truck #${id}, ${name} was deleted!`);

  // return a success message back to the user
  return `Success! Food truck #${id}, ${name} was deleted!`;
}

// 11. updateFoodTruckLocation(id, newLocation)
// this helper function updates the current_location of one food truck
async function updateFoodTruckLocation(id, newLocation) {
  // runs an UPDATE query to change the current_location where the id matches
  const result = await db.query(
    "UPDATE food_trucks SET current_location = $1 WHERE id = $2",
    // passes in newLocation as $1 and id as $2
    [newLocation, id],
  );
  // returns the result of the update query
  return result;
}



// 12. updateFoodTruckRating(id, newRating)


// ---------------------------------
// API Endpoints
// ---------------------------------

// 1. GET /get-all-food-trucks
// creates a GET route that returns all food trucks
app.get("/get-all-food-trucks", async (req, res) => {
  // calls the helper function to get all food trucks
  const trucks = await getAllFoodTrucks();
  // sends the food trucks back as JSON
  res.json(trucks);
});

// 2. GET /get-food-truck-by-id/:id
// creates a GET route with a URL parameter called id
app.get("/get-food-truck-by-id/:id", async (req, res) => {
  // gets the id from the request URL parameters
  // gets the id from the URL
  const id = req.params.id;

  // calls the helper function to find the food truck with that id
  // calls the helper function
  const foodTruck = await getFoodTruckById(id);

  // sends the found food truck back as JSON
  // sends the food truck back as JSON
  res.json(foodTruck);
});



// 3. GET /get-vegan-food-trucks


// 4. GET /get-food-trucks-by-price/:price

// creates a GET route that returns food trucks matching a certain price level
app.get("/get-food-trucks-by-price/:price", async (req, res) => {
  // gets the price value from the URL parameters
  const price = req.params.price;
  // calls the helper function using the price from the URL
  const trucks = await getFoodTruckByPrice(price);
  // sends the matching trucks back as JSON
  res.json(trucks);
});

// 5. GET /get-top-rated-food-trucks
// creates a GET route that returns the top rated food trucks
app.get("/get-top-rated-food-trucks", async (req, res) => {
  // calls the helper function to get trucks with rating 4.5 or higher
  const trucks = await getTopRatedFoodTrucks();
  // sends the trucks back as JSON
  res.json(trucks);
});

// 6. GET /get-food-trucks-sorted-by-rating
// creates a GET route that returns food trucks sorted by rating
app.get("/get-food-trucks-sorted-by-rating", async (req, res) => {
  // calls the helper function that sorts the trucks by rating
  const trucks = await getFoodTrucksSortedByRating();
  // sends the sorted trucks back as JSON
  res.json(trucks);
});


// 7. GET /get-food-trucks-sorted-by-price

// creates a GET route that returns food trucks sorted by price
app.get("/get-food-trucks-sorted-by-price", async (req, res) => {
  // calls the helper function that sorts trucks by price
  const sortedFoodTruckPrice = await sortedByPrice();
  // sends the sorted results back as JSON
  res.json(sortedFoodTruckPrice);
});


// 8. GET /get-food-trucks-count
// creates a GET route that returns the total count of food trucks
app.get("/get-food-trucks-count", async (req, res) => {
  // calls the helper function that counts the food trucks
  const count = await getFoodTrucksCount()
  // sends the count back as JSON
  res.json(count);
})

// 9. POST /add-one-food-truck
// creates a POST route that adds one new food truck
app.post("/add-one-food-truck", async (req, res) => {
  // uses object destructuring to pull the food truck data out of req.body
  const {
    // gets the name from req.body
    name,
    // gets the current_location from req.body
    current_location,
    // gets the daily_special from req.body
    daily_special,
    // gets the slogan from req.body
    slogan,
    // gets the has_vegan_options value from req.body
    has_vegan_options,
    // gets the price_level from req.body
    price_level,
    // gets the rating from req.body
    rating,
  } = req.body;

  // calls the helper function and passes in all the form values
  const truck = await addOneFoodTruck(
    // passes the name into the helper function
    name,
    // passes the current_location into the helper function
    current_location,
    // passes the daily_special into the helper function
    daily_special,
    // passes the slogan into the helper function
    slogan,
    // passes the has_vegan_options value into the helper function
    has_vegan_options,
    // passes the price_level into the helper function
    price_level,
    // passes the rating into the helper function
    rating,
  );

  // sends a success message back to the user after the truck is added
  res.send(`Success! ${truck.name} was added!`);
});


// 10. POST /delete-one-food-truck/:id
// creates a POST route that deletes one food truck using the id in the URL
app.post("/delete-one-food-truck/:id", async (req, res) => {
  // starts a try block so errors can be caught
  try {
    // this comment explains that the id comes from the URL parameter
    // Creates a variable from the ':id' entered in the url.
    // stores the id from the URL into a variable
    let id = req.params.id;

    // calls the delete helper function using the id
    const result = await deleteOneFoodTruck(id);

    // sends the result message back to the client
    res.send(result);
  } catch (error) {
    // logs the error in the terminal if something goes wrong
    console.error(error);
    // sends a 500 error response with a message in JSON format
    res.status(500).json({
      // this is the custom error message sent back if the delete fails
      error:
        "There was an issue while deleting the food truck. Please review your request and try again",
    });
  }
});


// 11. POST /update-food-truck-location
// creates a POST route that updates a food truck location
app.post("/update-food-truck-location", async (req, res) => {
  // gets the id from the request body
  const id = req.body.id;
  // gets the newLocation value from the request body
  const newLocation = req.body.newLocation;

  // calls the helper function to update the food truck location
  await updateFoodTruckLocation(id, newLocation);

  // sends a success message after the update finishes
  res.send("Success! The food truck location was updated!");
});

// ✨💖🐼 Secret message from Nicole 🐼💖✨
// Why did the programmer quit their job? Because they didn't get arrays :) *
