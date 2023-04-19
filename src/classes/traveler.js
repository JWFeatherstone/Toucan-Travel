class Traveler {
  constructor(traveler) {
    this.id = traveler.id;
    this.name = traveler.name;
    this.travelerType = traveler.travelerType;
  }

  getFirstName() {
    return this.name.split(' ')[0];
  }
}

export default Traveler;