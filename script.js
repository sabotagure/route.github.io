document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fileInput').addEventListener('change', processCSV);
    document.getElementById('calculateButton').addEventListener('click', function() {
        processCSV();
    });
});

function processCSV() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            calculateRouteFromCSV(text);
        };
        reader.readAsText(file);
    }
}

function calculateRouteFromCSV(data) {
    console.log('Processing CSV data...');
    const lines = data.split('\n').map(line => line.trim());

    // Parse CSV data
    const addresses = lines.slice(1) // Skip header
                         .map(line => {
                             const [name, lat, lon] = line.split(',');
                             return { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
                         });

    // Calculate the most efficient route
    const route = calculateRoute(addresses);

    // Log the route to check its contents
    console.log('Route:', route);

    // Display the route
    displayRoute(route);
}

function calculateRoute(addresses) {
    const numAddresses = addresses.length;
    let minDist = Infinity;
    let bestPath = [];

    // Generate initial path (starting with index 0)
    let path = [];
    for (let i = 0; i < numAddresses; i++) {
        if (i !== 0) path.push(i);
    }

    // Calculate initial distance
    let initialDist = calculateTotalDistance(0, path, addresses);

    // 2-opt algorithm
    for (let i = 0; i < numAddresses - 1; i++) {
        for (let j = i + 1; j < numAddresses; j++) {
            let newPath = twoOptSwap(path, i, j);
            let newDist = calculateTotalDistance(0, newPath, addresses);
            if (newDist < minDist) {
                minDist = newDist;
                bestPath = newPath;
            }
        }
    }

    // Reconstruct the best route
    const route = [addresses[0]];
    bestPath.forEach(index => {
        const address = addresses[index];
        if (address) {
            route.push(address);
        }
    });

    return route;
}

function calculateTotalDistance(startIndex, path, addresses) {
    let totalDistance = 0;
    let currentIndex = startIndex;
    for (let i = 0; i < path.length; i++) {
        const nextIndex = path[i];
        const currentAddress = addresses[currentIndex];
        const nextAddress = addresses[nextIndex];
        if (currentAddress && nextAddress) {
            totalDistance += calculateDistance(currentAddress, nextAddress);
        }
        currentIndex = nextIndex;
    }
    return totalDistance;
}

function calculateDistance(point1, point2) {
    if (!point1 || !point2) return 0;
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
        result += point.name + '<br>';
    });
    result += 'Total Distance: ' + calculateTotalDistance(0, Array.from({ length: route.length - 1 }, (_, i) => i + 1), route).toFixed(2) + ' km';
    outputDiv.innerHTML = result;
}
