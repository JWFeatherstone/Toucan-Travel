class Destinations {
  constructor(destinationsData) {
    this.data = destinationsData;
  }

  getDestinationById(id) {
    return this.data.find(destination => destination.id === id);
  }

  calculateTripCost(id, travelers, duration) {
    let destination = this.getDestinationById(id);
    let lodgingCost = destination.estimatedLodgingCostPerDay * duration;
    let flightCost = destination.estimatedFlightCostPerPerson * travelers;
    let totalCost = Number(((lodgingCost + flightCost)*1.1).toFixed(2));
    return totalCost;
  }
}

export default Destinations;