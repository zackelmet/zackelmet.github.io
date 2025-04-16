let map;
let asnChart;
let countryChart;
let attackLayer;

// Initialize the map
function initMap() {
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Use a dark theme for the map
    document.querySelector('.leaflet-tile-pane').style.filter = 'invert(90%) hue-rotate(180deg)';
}

// Parse the input data
function parseData(text) {
    const entries = text.split('[+]').filter(entry => entry.trim());
    return entries.map(entry => {
        const lines = entry.trim().split('\n');
        const ipMatch = lines[0].match(/IP: ([\d.]+) - (\d+) attempts/);
        const asnMatch = lines.find(l => l.includes('ASN:'))?.match(/ASN: (\d+)/);
        const locationMatch = lines.find(l => l.includes('Location:'))?.match(/Location: ([^,]+), ([^,]+), ([A-Z]+)/);
        const latLonMatch = lines.find(l => l.includes('Lat/Lon:'))?.match(/Lat\/Lon: ([-\d.]+), ([-\d.]+)/);
        
        return {
            ip: ipMatch?.[1],
            attempts: parseInt(ipMatch?.[2] || '0'),
            asn: asnMatch?.[1],
            location: locationMatch ? {
                city: locationMatch[1].trim(),
                state: locationMatch[2].trim(),
                country: locationMatch[3].trim()
            } : null,
            coordinates: latLonMatch ? [parseFloat(latLonMatch[1]), parseFloat(latLonMatch[2])] : null
        };
    });
}

// Update the attack map
function updateMap(data) {
    if (attackLayer) {
        map.removeLayer(attackLayer);
    }

    const markers = data.map(entry => {
        if (entry.coordinates) {
            return L.circle(entry.coordinates, {
                color: '#ff3300',
                fillColor: '#ff3300',
                fillOpacity: 0.5,
                radius: Math.sqrt(entry.attempts) * 20000
            }).bindPopup(`
                <b>IP:</b> ${entry.ip}<br>
                <b>Attempts:</b> ${entry.attempts}<br>
                <b>Location:</b> ${entry.location?.city}, ${entry.location?.state}, ${entry.location?.country}
            `);
        }
    }).filter(marker => marker);

    attackLayer = L.layerGroup(markers).addTo(map);
}

// Update the ASN distribution chart
function updateAsnChart(data) {
    const asnCounts = {};
    data.forEach(entry => {
        if (entry.asn) {
            asnCounts[entry.asn] = (asnCounts[entry.asn] || 0) + entry.attempts;
        }
    });

    const sortedAsns = Object.entries(asnCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

    if (asnChart) {
        asnChart.destroy();
    }

    asnChart = new Chart(document.getElementById('asnChart'), {
        type: 'bar',
        data: {
            labels: sortedAsns.map(([asn]) => `ASN ${asn}`),
            datasets: [{
                label: 'Attack Attempts',
                data: sortedAsns.map(([,count]) => count),
                backgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#333333' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#333333' }
                }
            }
        }
    });
}

// Update the country distribution chart
function updateCountryChart(data) {
    const countryCounts = {};
    data.forEach(entry => {
        if (entry.location?.country) {
            countryCounts[entry.location.country] = (countryCounts[entry.location.country] || 0) + entry.attempts;
        }
    });

    const sortedCountries = Object.entries(countryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);

    if (countryChart) {
        countryChart.destroy();
    }

    countryChart = new Chart(document.getElementById('countryChart'), {
        type: 'bar',
        data: {
            labels: sortedCountries.map(([country]) => country),
            datasets: [{
                label: 'Attack Attempts',
                data: sortedCountries.map(([,count]) => count),
                backgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#333333' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#333333' }
                }
            }
        }
    });
}

// Update statistics in the overview section
function updateStats(data) {
    const totalConnections = data.reduce((sum, entry) => sum + entry.attempts, 0);
    const uniqueIPs = new Set(data.map(entry => entry.ip)).size;
    
    document.getElementById('total-connections').textContent = totalConnections;
    document.getElementById('unique-ips').textContent = uniqueIPs;
}

// Load and process data
async function loadData() {
    try {
        const response = await fetch('output.txt');
        const text = await response.text();
        const data = parseData(text);
        
        initMap();
        updateMap(data);
        updateAsnChart(data);
        updateCountryChart(data);
        updateStats(data);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize everything when the page loads
window.onload = loadData; 