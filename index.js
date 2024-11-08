// starts off with the first place to show
var map = L.map('map').setView([56.9467, 24.1203], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// places the marker on the first shown place -> Riga
var marker = L.marker([56.9467, 24.1203]).addTo(map);
marker.bindPopup("<b>Rīga</b><br>Rīgas Centrālā stacija").openPopup();

// defines the source and destination coordinate systems
var sourceProj = 'EPSG:3059';
var destProj = 'EPSG:4326';

// fetches a json file
fetch('dati.json')
    .then(response => response.json())
    .then(data => {
        console.log('JSON data:', data); // Debug log

        // loops through the features array
        data.features.forEach(function(feature) {
            // extracts coordinates and properties
            var coordinates = feature.geometry.coordinates;
            var properties = feature.properties;

            console.log('Original coordinates:', coordinates); // Debug log

            // transforms the coordinates
            var transformedCoordinates = proj4(sourceProj, destProj, coordinates);

            console.log('Transformed coordinates:', transformedCoordinates); // Debug log

            // adds a marker for each feature
            L.marker([transformedCoordinates[1], transformedCoordinates[0]]).addTo(map)
                .bindPopup(properties.PLACENAME);
        });
    })
    .catch(error => console.error('Error fetching the JSON file:', error));