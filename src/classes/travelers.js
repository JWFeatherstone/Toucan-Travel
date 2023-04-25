class Travelers {
  constructor(travelersData) {
    this.data = travelersData;
  }

  getTravelerById(id) {
    return this.data.find(traveler => traveler.id === id);
  }
}

export default Travelers;