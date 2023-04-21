// CSS File Import
import './css/styles.css';

// Image Imports
import './images/turing-logo.png'
import './images/Calendar-Icon.svg'
import './images/azores.jpg'
import './images/iceland.jpg'
import './images/mediterranean.jpg'
import './images/mtstmichel.jpg'
import './images/namibia.jpg'
import './images/peru.jpg'
import './images/montana.png'


// Class Imports

import Travelers from './classes/travelers';
import Traveler from './classes/traveler';
import Trips from './classes/trips';
import Destinations from './classes/destinations';
import backgrounds from './backgrounds';

// 3rd Party Library Imports
import dayjs from 'dayjs';

// API Call Imports
import './api-calls';
import {
  fetchTravelers,
  fetchTrips,
  fetchDestinations
} from './api-calls';

// Traveler Page Imports

import { showTravelerPage } from './traveler-page';

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
    let bgIndex = getRandomIndex(backgrounds);
    showTravelerPage(date, destinations, bgIndex);
  })
  .catch(error => {
    console.error('Error fetching data:', error.message);
  })

document.querySelector('.submit-trip-btn').addEventListener('click', function() {
  event.preventDefault();
  const start = picker.getStartDate();
  const end = picker.getEndDate();
  const startDate = dayjs(start).format('YYYY/MM/DD');
  const endDate = dayjs(end).format('YYYY/MM/DD');
  console.log(startDate, endDate);
});

// Functions

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}