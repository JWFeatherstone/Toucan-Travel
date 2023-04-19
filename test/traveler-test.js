import chai from 'chai';
const expect = chai.expect;
import Traveler from '../src/classes/traveler';
import Travelers from '../src/classes/travelers';
import travelersTestData from './travelers-testdata';

describe('travelers property tests', function() {
  let travelers, traveler;
  beforeEach(function() {
    travelers = new Travelers(travelersTestData);
    traveler = new Traveler(travelers.getTravelerById(1))
  });

  it('should be a function', function() {
    expect(Traveler).to.be.a("function");
  });

  it('should be an instance of Travelers', function() {
    expect(traveler).to.be.an.instanceof(Traveler);
  });

  it('should represent a traveler object with an id, name, and travelerType', function() {
    expect(traveler).to.deep.equal({
      "id": 1,
      "name": "Ham Leadbeater",
      "travelerType": "relaxer"
    }, )
  });
});

describe('traveler method tests', function() {
  let travelers, traveler;
  beforeEach(function() {
    travelers = new Travelers(travelersTestData);
    traveler = new Traveler(travelers.getTravelerById(1))
  });

  it('should be able to retrieve the traveler/s first name', function() {
    expect(traveler.getFirstName()).to.deep.equal('Ham');
  });
});
