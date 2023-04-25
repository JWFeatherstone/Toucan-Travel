class Trips {
  constructor(tripsData) {
    this.data = tripsData;
  }

  getTripsByUserId(id) {
    return this.data.filter(trip => trip.userID === id);
  }

  getNewTripId() {
    let tripIds = this.data.map(trip => trip.id);
    return Math.max(...tripIds) + 1;
  };

  getUserTripsByStatus(id, status) {
    let userTrips = this.getTripsByUserId(id);
    return userTrips.filter(trip => trip.status === status);
  } 

  getUserTripsByDate(id, pastOrUpcoming, date) {
    let approvedTrips = this.getUserTripsByStatus(id, 'approved');
    if (pastOrUpcoming === 'past') {
      return approvedTrips.filter(trip => trip.date < date);
    } else if (pastOrUpcoming === 'upcoming') {
      return approvedTrips.filter(trip => trip.date > date);
    }
  }

  getFavoriteDestination(id) {
    let trips = this.getUserTripsByStatus(id, 'approved');
    let mostFrequented = trips.reduce((destinations, trip) => {
      if (!destinations[trip.destinationID]) {
        destinations[trip.destinationID] = 1;
      } else {
        destinations[trip.destinationID] += 1;
      }
      return destinations;
    }, {});
    console.log(mostFrequented)
    let favoriteDestination = Object.keys(mostFrequented).sort((a, b) => mostFrequented[b] - mostFrequented[a])[0];
    return Number(favoriteDestination);
  }

  calculateTotalSpent(id, destinations) {
    let trips = this.getUserTripsByStatus(id, 'approved');
    let totalSpent = trips.reduce((total, trip) => {
      total += destinations.calculateTripCost(trip.destinationID, trip.travelers, trip.duration);
      return total
    } , 0);
    return totalSpent;
  }
};

export default Trips;