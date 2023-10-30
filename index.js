const express = require('express');
const app = express();
const port = 5000; // Use the port of your choice
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')

// Define a basic route
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
  "origin": "*",
}))


app.post('/save-vehicle', (req, res) => {
  const newVehicle = req.body;

  // Read existing data from the JSON file
  fs.readFile('vehicles.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read data from the JSON file' });
      return;
    }

    let vehicles = [];

    try {
      vehicles = JSON.parse(data);
      if (!Array.isArray(vehicles)) {
        // Ensure vehicles is an array; if not, create a new array
        vehicles = [];
      }
    } catch (error) {
      console.error('Failed to parse JSON data:', error);
    }

    // Add the new vehicle to the existing array
    vehicles.push(newVehicle);

    // Save the updated array back to the JSON file
    fs.writeFile('vehicles.json', JSON.stringify(vehicles), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save data to the JSON file' });
        return;
      }

      res.json({ message: 'Vehicle saved successfully' });
    });
  });
});

app.get('/get-vehicles', (req, res) => {
  try {
    // Read the JSON file
    const data = fs.readFileSync('vehicles.json', 'utf-8');

    // Parse the JSON data
    const vehicles = JSON.parse(data);

    // Send the data as a JSON response to the frontend
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});