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
    const lines = data.split('\n');

    // Check if the first line is a header
    let startIdx = 0;
    const firstLine = lines[0].trim().split(',');
    if (firstLine.length !== 3 || isNaN(parseFloat(firstLine[1])) || isNaN(parseFloat(firstLine[2]))) {
        startIdx = 1; // Skip the first line if it's a header
    }

    const addresses = lines.slice(startIdx)
                         .map(line => line.trim()) // Trim whitespace
                         .filter(line => line)    // Filter out empty lines
                         .map(line => {
                             const [name, lat, lon] = line.split(',');
                             return { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
                         });

    const route = calculateRoute(addresses);
    displayRoute(route);
}

function calculateRoute(addresses) {
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

    return bestPath.map(index => addresses[index]);
}

function calculateTotalDistance(path, addresses) {
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        let fromIndex = path[i];
        let toIndex = path[i + 1];
        totalDistance += calculateDistance(addresses[fromIndex], addresses[toIndex]);
    }
    // Add distance from last address back to the start
    totalDistance += calculateDistance(addresses[path[path.length - 1]], addresses[path[0]]);
    return totalDistance;
}

function calculateDistance(point1, point2) {
    console.log("Point1:", point1);
    console.log("Point2:", point2);

    const { lat: lat1, lon: lon1 } = point1;
    const { lat: lat2, lon: lon2 } = point2;

    console.log("Lat1:", lat1);
    console.log("Lon1:", lon1);
    console.log("Lat2:", lat2);
    console.log("Lon2:", lon2);

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
    for (let i = 0; i < route.length; i++) {
        result += route[i].name + '<br>';
    }
    result += 'Total Distance: ' + calculateTotalDistance(route, route).toFixed(2) + ' km';
    outputDiv.innerHTML = result;
}
