import chai from 'chai';
const expect = chai.expect;
import tripsTestData from './trips-testdata';
import travelersTestData from './travelers-testdata';
import destinationsTestData from './destinations-testdata';
import Trips from '../src/classes/trips';
import Travelers from '../src/classes/travelers';
import Traveler from '../src/classes/traveler';
import Destinations from '../src/classes/destinations';

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

describe('destinations method tests', function() {
  let trips, travelers, traveler, destinations, date;
  beforeEach(function() {
    trips = new Trips(tripsTestData);
    date = "2022/09/16";
    destinations = new Destinations(destinationsTestData);
    travelers = new Travelers(travelersTestData);
    traveler = new Traveler(travelers.getTravelerById(2));
  });

  it('should be able to retrieve a user/s trips', function() {
    expect(trips.getTripsByUserId(traveler.id)).to.deep.equal(tripsTestData.filter(trip => trip.userID === traveler.id));
  });

  it('should be able to retrieve a user/s trips depending on their status', function() {
    expect(trips.getUserTripsByStatus(traveler.id, 'approved')).to.deep.equal(tripsTestData.filter(trip => trip.userID === traveler.id && trip.status === 'approved'));
  });

  it('should be able to retrieve a user/s approved trips depending on whether they are past or upcoming', function() {
    expect(trips.getUserTripsByDate(traveler.id, 'past', date)).to.deep.equal([{
        "id": 100,
        "userID": 2,
        "destinationID": 6,
        "travelers": 6,
        "date": "2020/3/28",
        "duration": 10,
        "status": "approved",
        "suggestedActivities": []
      },
    ] );
    expect(trips.getUserTripsByDate(traveler.id, 'upcoming', date)).to.deep.equal([{
      "id": 61,
      "userID": 2,
      "destinationID": 19,
      "travelers": 2,
      "date": "2023/07/25",
      "duration": 5,
      "status": "approved",
      "suggestedActivities": []
    }
    ]);
  });

  it('should be able to calculate a user/s total spent on trips', function() {
    expect(trips.calculateTotalSpent(traveler.id, destinations)).to.equal(8074);
  });
})