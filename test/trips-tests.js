import chai from 'chai';
const expect = chai.expect;
import tripsTestData from './trips-testdata';
import Trips from '../src/classes/trips';

describe('destinations property tests', function() {
  let trips;
  beforeEach(function() {
    trips = new Trips(tripsTestData);
  });

  it('should be a function', function() {
    expect(Trips).to.be.a("function");
  });

  it('should be an instance of Travelers', function() {
    expect(trips).to.be.an.instanceof(Trips);
  });

  it('should have a property of data', function() {
    expect(trips).to.have.property('data');
  });

  it('should store an array of traveler objects with individual traveler properties', function() {
    expect(trips.data[0]).to.deep.equal({
      "id": 1,
      "userID": 44,
      "destinationID": 49,
      "travelers": 1,
      "date": "2022/09/16",
      "duration": 8,
      "status": "approved",
      "suggestedActivities": []
      }, );
  });
});