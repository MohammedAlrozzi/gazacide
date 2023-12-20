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
    const { dateOfIncident, tags } = req.query;
  
    // Filter incidents based on dateOfIncident and tags if provided
    let filteredIncidents = incidents;
  
    if (dateOfIncident) {
      filteredIncidents = filteredIncidents.filter((incident) => incident.dateOfIncident === dateOfIncident);
    }
  
    if (tags) {
      const tagsArray = tags.split(',').map((tag) => tag.trim());
      filteredIncidents = filteredIncidents.filter((incident) =>
        tagsArray.every((tag) => incident.tags && incident.tags.includes(tag))
      );
    }
  
    // Respond with the organized data
    const organizedData = filteredIncidents.map((incident) => ({
      tokenNumber: incident.tokenNumber,
      connectedTo: incident.connectedTo,
      dateOfIncident: incident.dateOfIncident,
      dateOfReporting: incident.dateOfReporting,
      geolocation: incident.geolocation,
      area: incident.area,
      reportedBy: incident.reportedBy,
      tags: incident.tags,
    }));
  
    res.json(organizedData);
  });
  
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

  