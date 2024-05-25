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
            const [name, lat, lon] = line.split(',');
            return { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
        });

    return addresses;
}

function calculateRoute() {
    if (!addressesData) {
        console.error('No addresses data found.');
        return;
    }

    console.log('Calculating route...');
    const orderedAddresses = orderAddressesByProximity(addressesData);
    const route = findOptimalRoute(orderedAddresses);
    displayRoute(route);
}

function orderAddressesByProximity(addresses) {
    console.log('Ordering addresses by proximity...');
    // Placeholder for reordering addresses based on proximity
    // Currently returning the original order
    return addresses;
}

function findOptimalRoute(addresses) {
    console.log('Optimizing route...');
    const numAddresses = addresses.length;
    let minDist = Infinity;
    let bestPath = [];

    // Initialize path with the order of addresses
    let path = [];
    for (let i = 0; i < numAddresses; i++) {
        path.push(i);
    }

    // Calculate initial distance
    let initialDist = calculateTotalDistance(path, addresses);

    // 2-opt algorithm
    for (let i = 0; i < numAddresses - 1; i++) {
        for (let j = i + 1; j < numAddresses; j++) {
            let newPath = twoOptSwap(path, i, j);
            let newDist = calculateTotalDistance(newPath, addresses);
            if (newDist < minDist) {
                minDist = newDist;
                bestPath = newPath;
            }
        }
    }

    // Reconstruct the best route
    const route = [];
    bestPath.forEach(index => {
        const address = addresses[index];
        if (address) {
            route.push(address);
        }
    });

    return route;
}

function calculateTotalDistance(route, addresses) {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        let fromPoint = addresses[route[i]];
        let toPoint = addresses[route[i + 1]];
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

function twoOptSwap(path, i, j) {
    const newPath = [...path];
    while (i < j) {
        const temp = newPath[i];
        newPath[i] = newPath[j];
        newPath[j] = temp;
        i++;
        j--;
    }
    return newPath;
}

function displayRoute(route) {
    const outputDiv = document.getElementById('output');
    let result = 'Optimal Route: <br>';
    route.forEach(point => {
        result += `${point.name},${point.lat},${point.lon}<br>`;
    });
    result += 'Total Distance: ' + calculateTotalDistance(route, addressesData).toFixed(2) + ' km';
    outputDiv.innerHTML = result;
}
