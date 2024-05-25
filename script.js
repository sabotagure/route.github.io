let addressesData = [];

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
            parseCSV(text);
        };
        reader.readAsText(file);
    }
}

function parseCSV(data) {
    console.log('Parsing CSV data...');
    const lines = data.split('\n').map(line => line.trim());

    // Parse CSV data
    lines.forEach(line => {
        const [name, lat, lon] = line.split(',');
        const address = { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
        addressesData.push(address);
    });

    console.log('Parsed addresses:', addressesData);
}

function calculateRoute() {
    if (!addressesData.length) {
        console.error('No addresses data found.');
        return;
    }

    console.log('Calculating route...');
    const orderedAddresses = orderAddressesByProximity(addressesData);
    const route = findOptimalRoute(orderedAddresses);
    console.log('Optimal route:', route);
    displayRoute(route);
}

function orderAddressesByProximity(addresses) {
    console.log('Ordering addresses by proximity...');
    const numAddresses = addresses.length;
    const orderedAddresses = [];
    const remainingAddresses = [...addresses];

    let currentAddress = remainingAddresses.shift(); // Start with the first address
    orderedAddresses.push(currentAddress);

    while (remainingAddresses.length > 0) {
        let nearestIndex = -1;
        let nearestDistance = Infinity;

        remainingAddresses.forEach((address, index) => {
            const distance = calculateDistance(currentAddress, address);
            if (distance < nearestDistance) {
                nearestIndex = index;
                nearestDistance = distance;
            }
        });

        currentAddress = remainingAddresses.splice(nearestIndex, 1)[0];
        orderedAddresses.push(currentAddress);
    }

    return orderedAddresses;
}

function findOptimalRoute(addresses) {
    console.log('Optimizing route...');
    // Placeholder for optimizing route
    return addresses;
}

function displayRoute(route) {
    const outputDiv = document.getElementById('output');
    let result = 'Optimal Route: <br>';
    route.forEach(point => {
        result += `${point.name},${point.lat},${point.lon}<br>`;
    });
    result += 'Total Distance: ' + calculateTotalDistance(route).toFixed(2) + ' km';
    outputDiv.innerHTML = result;
}

function calculateTotalDistance(route) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        let fromPoint = route[i];
        let toPoint = route[i + 1];
        if (fromPoint && toPoint) {
            totalDistance += calculateDistance(fromPoint, toPoint);
        } else {
            console.error('One of the points is undefined.');
        }
    }
    return totalDistance;
}

function calculateDistance(point1, point2) {
    const { lat: lat1, lon: lon1 } = point1;
    const { lat: lat2, lon: lon2 } = point2;
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}
