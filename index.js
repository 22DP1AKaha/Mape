// izveido karti ar skatu uz rīgu un pietuvinājumu 13
var mape = L.map('map').setView([56.9467, 24.1203], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, // max pietuvinājums
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mape);

// uztaisa marķieri rīgas centrālajā stacijā ar uznirstošo logu
var marker = L.marker([56.9467, 24.1203]).addTo(mape);
marker.bindPopup("<b>rīga</b><br>rīgas centrālā stacija").openPopup();

// definē koordinātu sistēmas no kuras un uz kuru pārveidot
var sourceProj = 'EPSG:3059';
var destProj = 'EPSG:4326';

// ielādē datus no "dati.json" un apstrādā tos
fetch('dati.json')
    .then(response => response.json()) // pārvērš atbildi par json formātu
    .then(data => {
        console.log('json data:', data); // parāda datus konsolē

        // katrai vietai (feature) dabū koordinātas un īpašības
        data.features.forEach(function(feature) {
            var coordinates = feature.geometry.coordinates;
            var properties = feature.properties;

            console.log('original coordinates:', coordinates); // sākotnējās koordinātas

            // pārveido koordinātas uz epsg:4326
            var transformedCoordinates = proj4(sourceProj, destProj, coordinates);

            console.log('transformed coordinates:', transformedCoordinates); // parāda pārveidotās koordinātas

            // izveido marķieri ar pārveidotām koordinātām un uznirstošo logu ar vietas nosaukumu
            L.marker([transformedCoordinates[1], transformedCoordinates[0]]).addTo(mape)
                .bindPopup(properties.PLACENAME);
        });
    })
    // kļūdas gadījumā izvada ziņu
    .catch(error => console.error('error fetching the json file:', error));
