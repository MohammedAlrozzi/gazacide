const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Sample data structure (replace this with your actual data structure)
let incidents = [];

// Load data from JSON file
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    incidents = JSON.parse(data);

    // Add a tokenNumber to each row
    incidents = incidents.map((incident, index) => ({
      ...incident,
      tokenNumber: index + 1,
    }));

    console.log('JSON file successfully processed.');
  } catch (parseError) {
    console.error('Error parsing JSON file:', parseError);
  }
});

app.get('/incidents', (req, res) => {
    const queryParams = req.query;
  
    // Filter incidents based on query parameters
    const filteredIncidents = incidents.filter((incident) =>
      Object.entries(queryParams).every(([key, value]) => {
        // If the property exists in the incident and the values match, include the incident
        return incident[key] !== undefined && incident[key].toString() === value.toString();
      })
    );
  
    // Respond with the organized data
    const organizedData = filteredIncidents.map((incident) => {
      const filteredIncident = {};
      // Include only the properties that match the query parameters
      Object.keys(incident).forEach((key) => {
        if (queryParams[key]) {
          filteredIncident[key] = incident[key];
        }
      });
      return filteredIncident;
    });
  
    res.json(organizedData);
  });
  

// app.get('/incidents', (req, res) => {
//     const { dateOfReporting } = req.query;
  
//     // Filter incidents based on dateOfReporting if provided
//     const filteredIncidents = dateOfReporting
//       ? incidents.filter((incident) => incident.dateOfReporting === dateOfReporting)
//       : incidents;
  
//     // Respond with the organized data
//     const organizedData = filteredIncidents.map((incident) => ({
//       tokenNumber: incident.tokenNumber,
//       connectedTo: incident.connectedTo,
//       dateOfIncident: incident.dateOfIncident,
//       dateOfReporting: incident.dateOfReporting,
//       geolocation: incident.geolocation,
//       area: incident.area,
//       reportedBy: incident.reportedBy,
//       tags: incident.tags,
//     }));
  
//     res.json(organizedData);
//   });


// Add a new incident
app.post('/add-incident', (req, res) => {
  const newIncident = req.body;
  newIncident.tokenNumber = incidents.length + 1;
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

  