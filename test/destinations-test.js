import chai from 'chai';
const expect = chai.expect;
import destinationsTestData from './destinations-testdata';
import Destinations from '../src/classes/destinations';

describe('destinations property tests', function() {
  let destinations;
  beforeEach(function() {
    destinations = new Destinations(destinationsTestData);
  });

  it('should be a function', function() {
    expect(Destinations).to.be.a("function");
  });

  it('should be an instance of Travelers', function() {
    expect(destinations).to.be.an.instanceof(Destinations);
  });

  it('should have a property of data', function() {
    expect(destinations).to.have.property('data');
  });

  it('should store an array of traveler objects with individual traveler properties', function() {
    expect(destinations.data[0]).to.deep.equal({
      "id": 1,
      "destination": "Lima, Peru",
      "estimatedLodgingCostPerDay": 70,
      "estimatedFlightCostPerPerson": 400,
      "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
      "alt": "overview of city buildings with a clear sky"
      }, );
  });
});

describe('destinations methods tests', function() {
  let destinations;
  beforeEach(function() {
    destinations = new Destinations(destinationsTestData);
  });

  it('should be able to retrieve a destination based on its ID number', function() {
    expect(destinations.getDestinationById(2)).to.deep.equal({
      "id": 2,
      "destination": "Stockholm, Sweden",
      "estimatedLodgingCostPerDay": 100,
      "estimatedFlightCostPerPerson": 780,
      "image": "https://images.unsplash.com/photo-1560089168-6516081f5bf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
      "alt": "city with boats on the water during the day time"
      }, );
  });

  it('should be able to calculate the total cost of a proposed trip', function() {
    expect(destinations.calculateTripCost(2, 4, 4)).to.deep.equal(3872);
  });

});