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
import { easepick }  from '@easepick/bundle'
import { RangePlugin } from '@easepick/range-plugin'
import { LockPlugin } from '@easepick/lock-plugin'

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
    populateDestinationList();
    traveler = new Traveler(travelers.getTravelerById(2));
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

// Date Picker
  function displayCalendar(){
    const DateTime = easepick.DateTime;
    const picker = new easepick.create({
    element: document.getElementById('datepicker'),
    css: [
      'https://cdn.jsdelivr.net/npm/@easepick/core@1.2.1/dist/index.css',
      'https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css',
      'https://cdn.jsdelivr.net/npm/@easepick/lock-plugin@1.2.1/dist/index.css',
    ],
    plugins: [RangePlugin, LockPlugin],
    format: "DD MMMM YY",
    RangePlugin: {
      tooltipNumber(num) {
        return num - 1;
      },
      delimiter: ' to ',
      locale: {
        one: 'night',
        other: 'nights'
      },
      minDays: 1,
    },
    LockPlugin: {
      minDate: date,
    },
  });
};

displayCalendar();


// DOM Manipulation

function populateDestinationList() {
  let destinationList = document.querySelector('#destinationInput');
  destinationList.innerHTML = '<option value="" disabled selected hidden>Please Choose...</option>'
  destinations.data.forEach(destination => {
    destinationList.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`
  })
}