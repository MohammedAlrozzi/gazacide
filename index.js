// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());

// // Sample data structure (replace this with your actual data structure)
// let incidents = [
//   {
//     tokenNumber: 1,
//     connectedTo: "Some connection",
//     dateOfIncident: "2023-12-20",
//     dateOfReporting: "2023-12-21",
//     geolocation: "latitude,longitude",
//     area: "Some Area",
//     reportedBy: "John Doe",
//   },
//   // Add more incidents as needed
// ];

// app.get('/', (req, res) => {
//   // Respond with the organized data
//   const organizedData = incidents.map((incident) => ({
//     tokenNumber: incident.tokenNumber,
//     connectedTo: incident.connectedTo,
//     dateOfIncident: incident.dateOfIncident,
//     dateOfReporting: incident.dateOfReporting,
//     geolocation: incident.geolocation,
//     area: incident.area,
//     reportedBy: incident.reportedBy,
//   }));

//   res.json(organizedData);
// });

// // Add a new incident
// app.post('/add-incident', (req, res) => {
//   const newIncident = req.body;
//   incidents.push(newIncident);
//   res.json({ message: 'Incident added successfully', newIncident });
// });

// // Retrieve JSON data for a specific tokenNumber
// app.get('/incident/:tokenNumber', (req, res) => {
//   const tokenNumber = parseInt(req.params.tokenNumber, 10);
//   const incident = incidents.find((item) => item.tokenNumber === tokenNumber);

//   if (incident) {
//     res.json(incident);
//   } else {
//     res.status(404).json({ message: 'Incident not found' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Sample data structure (replace this with your actual data structure)
let incidents = [];

// Load data from CSV file
fs.createReadStream('path/to/your/csvfile.csv')
  .pipe(csv())
  .on('data', (row) => {
    incidents.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });

app.get('/', (req, res) => {
  // Respond with the organized data
  const organizedData = incidents.map((incident) => ({
    tokenNumber: incident.tokenNumber,
    connectedTo: incident.connectedTo,
    dateOfIncident: incident.dateOfIncident,
    dateOfReporting: incident.dateOfReporting,
    geolocation: incident.geolocation,
    area: incident.area,
    reportedBy: incident.reportedBy,
  }));

  res.json(organizedData);
});

// Add a new incident
app.post('/add-incident', (req, res) => {
  const newIncident = req.body;
  incidents.push(newIncident);
  res.json({ message: 'Incident added successfully', newIncident });
});

// Retrieve JSON data for a specific tokenNumber
app.get('/incident/:tokenNumber', (req, res) => {
  const tokenNumber = parseInt(req.params.tokenNumber, 10);
  const incident = incidents.find((item) => item.tokenNumber === tokenNumber);

  if (incident) {
    res.json(incident);
  } else {
    res.status(404).json({ message: 'Incident not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
