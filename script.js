let addressesData;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', processCSV);
    document.getElementById('calculateButton').addEventListener('click', calculateRoute);
});

function processCSV() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            addressesData = parseCSV(text);
            console.log('Addresses data:', addressesData);
        };
        reader.readAsText(file);
    }
}

function parseCSV(data) {
    console.log('Parsing CSV data...');
    const lines = data.split('\n').map(line => line.trim());

    // Parse CSV data
    const addresses = lines.slice(1) // Skip header
        .map(line => {
            const parts = line.split(',');
            const name = parts.shift().trim();
            const lat = parseFloat(parts.shift());
            const lon = parseFloat(parts.shift());
            return { name, lat, lon };
        });

    return addresses;
}

function calculateRoute() {
    if (!addressesData) {
        console.error('No addresses data found.');
        return;
    }

    console.log('Calculating route...');
    const route = findOptimalRoute(addressesData);
    displayRoute(route);
}

function findOptimalRoute(addresses) {
    console.log('Optimizing route...');
    // Placeholder for now
    return addresses;
}

function displayRoute(route) {
    const outputDiv = document.getElementById('output');
    let result = 'Optimal Route: <br>';
    route.forEach(point => {
        result += `${point.name},${point.lat},${point.lon}<br>`;
    });
    outputDiv.innerHTML = result;
}
