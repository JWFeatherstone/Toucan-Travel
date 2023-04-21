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
import { easepick }  from '@easepick/bundle'
import { RangePlugin } from '@easepick/range-plugin'
import { LockPlugin } from '@easepick/lock-plugin'
import SlimSelect from 'slim-select'

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
let picker;
let tripBooking = {};
let bgIndex;

// Fetch Requests

Promise.all([fetchTravelers(), fetchTrips(), fetchDestinations()])
  .then(([travelersData, tripsData, destinationsData]) => {
    travelers = new Travelers(travelersData.travelers);
    trips = new Trips(tripsData.trips);
    destinations = new Destinations(destinationsData.destinations);
    traveler = new Traveler(travelers.getTravelerById(2));
    bgIndex = getRandomIndex(backgrounds);
    showTravelerPage(date, destinations, bgIndex, picker);
  })
  .catch(error => {
    console.error('Error fetching data:', error.message);
  })


/*
**************
FUNCTIONS
**************
*/

// DOM MANIPULATION 
// Traveler Pages: Booking Page

function showTravelerPage(today, destinations, bgIndex, picker) {
  populateTravelerPage(bgIndex, picker)
  populateDestinationList(destinations);
  populateTravelerNumberSelect();
  displayCalendar(today, picker);
}

function populateTravelerPage(bgIndex) {
  let body = document.querySelector('body');
  body.classList.add(`traveler-page${bgIndex}`);
  body.innerHTML = '';
  body.innerHTML = `
  <header>
    <form>
      <div class="input-holder destination-holder">
        <div class="search-icon"></div>
        <select required name="destinationInput" placeholder="Destination" class="trip-input" id="destinationInput">
        </select>
      </div>
      <div class="input-holder date-holder">
        <img src="./images/Calendar-Icon.svg" alt="Calendar icon" class="search-icon">
        <input id="datepicker" class="trip-input" placeholder="MM/DD/YY - MM/DD/YY">
      </div>
      <div class="input-holder travelers-holder">
        <div class="search-icon"></div>
        <select required class="trip-input" id="numTravelerInput">
        </select>
      </div>
      <button class="nav-btns submit-btn submit-trip-btn-js">Submit</button>
    </form>
  </header>
  <main>
  </main>
  <footer>
    <nav>
      <button class="nav-btns bk-trip-js">Book Trip</button>
      <div class="nav-separator"></div>
      <button class="nav-btns my-trips-js">My Trips</button>
    </nav>
  </footer>
  `
}

/* Booking Page - Search Bar */

function addSubmitBookingEventListener(picker) {
  document.querySelector('.submit-trip-btn-js').addEventListener('click', function() {
    event.preventDefault();
    const start = picker.getStartDate();
    const end = picker.getEndDate();
    const diff = dayjs(end).diff(dayjs(start), 'day');
    tripBooking = {
      id: trips.getNewTripId(),
      userID: traveler.id,
      destinationID: parseInt(document.querySelector('#destinationInput').value),
      travelers: parseInt(document.querySelector('#numTravelerInput').value),
      date: dayjs(start).format('YYYY/MM/DD'),
      duration: diff,
      status: 'pending',
      suggestedActivities: []
    }
    showConfirmBookingPage();
  });
}


function populateDestinationList(destinations) {
  let destinationSelect = new SlimSelect({
    select: '#destinationInput',
    data: [],
  })
  console.log(destinations.data[0].destination.charAt(0))
  let alphabetizedDestinations = destinations.data.sort((a, b) => {
    return a.destination.localeCompare(b.destination);
  });
  let selectDestinations = alphabetizedDestinations.map(destination => ({
    text: destination.destination, value: destination.id
  }))
  destinationSelect.setData(selectDestinations)
}

function displayCalendar(today, picker){
  const DateTime = easepick.DateTime;
  picker = new easepick.create({
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
    delimiter: ' - ',
    locale: {
      one: 'night',
      other: 'nights'
    },
    minDays: 1,
  },
  LockPlugin: {
    minDate: today,
  },
  onClickCalendarDay: function() {
    let startDate = picker.getStartDate;
    let endDate = picker.getEndDate;
    return startDate && endDate;
  }
});
  addSubmitBookingEventListener(picker);
};

function populateTravelerNumberSelect() {
  let numTravelerSelect = new SlimSelect({
    select: '#numTravelerInput',
    data: [],
    settings: {
      showSearch: false,
    }
  })
  numTravelerSelect.setData([
    {text: '1 Traveler', value: 1},
    {text: '2 Travelers', value: 2},
    {text: '3 Travelers', value: 3},
    {text: '4 Travelers', value: 4},
    {text: '5 Travelers', value: 5},
    {text: '6 Travelers', value: 6},
    {text: '7 Travelers', value: 7},
    {text: '8 Travelers', value: 8},
    {text: '9 Travelers', value: 9},
  ]);
}

/* Booking Page - Confirm Booking */

function showConfirmBookingPage() {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  let cost = formatter.format(destinations.calculateTripCost(tripBooking.destinationID, tripBooking.travelers, tripBooking.duration))
  let body = document.querySelector('body');
  body.innerHTML = '';
  body.innerHTML = `
  <main class="booking-main">
    <section class="confirm-booking-container">
      <div class="confirm-booking-info">
        <h2 class="booking-confirmation-title">Booking Confirmation</h2> 
        <p class="booking-confirmation-title-subtext"> Let's double check the details on your upcoming trip to ${(destinations.getDestinationById(tripBooking.destinationID).destination).split(",")[0]}.</p>
        <div class="confirm-booking-details-box">
          <h4>Travelers: ${tripBooking.travelers}</h4>
        </div>
        <div class="confirm-booking-details-box">
          <h4>Dates: Depart ${tripBooking.date} Return (${tripBooking.duration} days)</h4>
        </div>
        <div class="confirm-booking-details-box">
          <h4>Total Cost: ${cost}</h4>
        </div>
      </div>
      <section class="confirm-booking-btns-container">
        <button class="booking-btn confirm-btn confirm-booking-btn-js">Confirm</button>
        <button class="booking-btn cancel-btn cancel-booking-btn-js">Cancel</button>
      </section>
      <section class="confirm-booking-img-container">
        <div class="confirm-booking-img-bounding-box">
          <img class="confirm-booking-img" src="${destinations.getDestinationById(tripBooking.destinationID).image}">
        </div>
      </section>
    </section>
  </main>
  `
  document.querySelector('.confirm-booking-btn-js').addEventListener('click', function() {
    event.preventDefault();
  });
  document.querySelector('.cancel-booking-btn-js').addEventListener('click', function() {
    event.preventDefault();
    showTravelerPage(date, destinations, bgIndex, picker);
  });
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}