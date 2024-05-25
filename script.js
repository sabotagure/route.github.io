document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            processCSV(text);
        };
        reader.readAsText(file);
    }
});

function processCSV(data) {
    const addresses = data.split('\n').map(line => {
        const [name, lat, lon] = line.split(',');
        return { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
    });
    calculateRoute(addresses);
}

function calculateRoute(addresses) {
    const outputDiv = document.getElementById('output');
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

    // Output the best path
    let result = 'Optimal Route: <br>';
    for (let i = 0; i < numAddresses; i++) {
        const index = bestPath[i];
        result += addresses[index].name + '<br>';
    }
    result += 'Total Distance: ' + minDist.toFixed(2) + ' km';
    outputDiv.innerHTML = result;
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
    const addresses = data.split('\n').map(line => {
        const [name, lat, lon] = line.split(',');
        return { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
    });
    calculateRoute(addresses);
}

// The rest of your JavaScript code...
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
    const addresses = data.split('\n')
                         .map(line => line.trim()) // Trim whitespace
                         .filter(line => line)    // Filter out empty lines
                         .map(line => {
                             const [name, lat, lon] = line.split(',');
                             return { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
                         });
    calculateRoute(addresses);
}

// The rest of your JavaScript code...
function calculateRouteFromCSV(data) {
    const addresses = data.split('\n')
                         .map(line => line.trim()) // Trim whitespace
                         .filter(line => line)    // Filter out empty lines
                         .map(line => {
                             const [name, lat, lon] = line.split(',');
                             return { name: name.trim(), lat: parseFloat(lat), lon: parseFloat(lon) };
                         });

    console.log("Addresses:", addresses); // Debugging output

    calculateRoute(addresses);
}
function calculateRoute(addresses) {
    const outputDiv = document.getElementById('output');
    const numAddresses = addresses.length;
    let minDist = Infinity;
    let bestPath = [];

    // Check if addresses array is empty
    if (numAddresses === 0) {
        outputDiv.innerHTML = "No addresses provided.";
        return;
    }

    // Check if any address object is undefined or missing properties
    for (let i = 0; i < numAddresses; i++) {
        const address = addresses[i];
        if (!address || typeof address.name !== 'string' || typeof address.lat !== 'number' || typeof address.lon !== 'number') {
            outputDiv.innerHTML = "Invalid address data.";
            return;
        }
    }

    // The rest of your calculateRoute function...
}
