function checkStatus(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
}

function fetchTravelers() {
  return fetch('http://localhost:3001/api/v1/travelers')
    .then(checkStatus)
}

function fetchTrips() {
  return fetch('http://localhost:3001/api/v1/trips')
    .then(checkStatus)
}

function fetchDestinations() {
  return fetch('http://localhost:3001/api/v1/destinations')
    .then(checkStatus)
}

export { fetchTravelers, fetchTrips, fetchDestinations }