// CSS File Import
import './css/styles.css';

// Image Imports
import './images/turing-logo.png'

// Class Imports

import Travelers from './classes/travelers';
import Traveler from './classes/traveler';
import Trips from './classes/trips';
import Destinations from './classes/destinations';

// 3rd Party Library Imports
import dayjs from 'dayjs';

// API Call Imports
import './api-calls';
import {
  fetchTravelers,
  fetchTrips,
  fetchDestinations
} from './api-calls';

// Global Variables
let travelers, trips, destinations, traveler;
let date = dayjs().format('YYYY/MM/DD');

// Fetch Requests

Promise.all([fetchTravelers(), fetchTrips(), fetchDestinations()])
  .then(([travelersData, tripsData, destinationsData]) => {
    travelers = new Travelers(travelersData.travelers);
    trips = new Trips(tripsData.trips);
    destinations = new Destinations(destinationsData.destinations);
    traveler = new Traveler(travelers.getTravelerById(2));
  })
  .catch(error => {
    console.error('Error fetching data:', error.message);
  })

