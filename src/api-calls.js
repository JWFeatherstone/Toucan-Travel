function checkStatus(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
}

function fetchTrips() {
  return fetch('http://localhost:3001/api/v1/trips')
    .then(checkStatus)
}

function fetchDestinations() {
  return fetch('http://localhost:3001/api/v1/destinations')
    .then(checkStatus)
}

function fetchTraveler(id) {
  return fetch(`http://localhost:3001/api/v1/travelers/${id}`)
    .then(checkStatus)
}

function postNewTrip(trip) {
  return fetch('http://localhost:3001/api/v1/trips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trip)
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.message === `Trip with id ${trip.id} successfully posted`) {
        return 'Post request successful'
      } else { 
        return 'Post request failed'
      }
    });
}


export { fetchTraveler, fetchTrips, fetchDestinations, postNewTrip }