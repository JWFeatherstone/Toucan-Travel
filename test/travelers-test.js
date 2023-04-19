import chai from 'chai';
const expect = chai.expect;
import Travelers from '../src/classes/travelers';
import travelersTestData from './travelers-testdata';

describe('travelers property tests', function() {
  let travelers;
  beforeEach(function() {
    travelers = new Travelers(travelersTestData);
  });

  it('should be a function', function() {
    expect(Travelers).to.be.a("function");
  });

  it('should be an instance of Travelers', function() {
    expect(travelers).to.be.an.instanceof(Travelers);
  });

  it('should have a property of data', function() {
    expect(travelers).to.have.property('data');
  });

  it('should store an array of traveler objects with individual traveler properties', function() {
    expect(travelers.data[0]).to.deep.equal({
      "id": 1,
      "name": "Ham Leadbeater",
      "travelerType": "relaxer"
    }, );
  });
});
