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
  fetchDestinations,
  postNewTrip
} from './api-calls';

// Global Variables
let travelers, trips, destinations, traveler;
let date = dayjs().format('YYYY/MM/DD');
let picker;
let tripBooking = {};
let bgIndex;

// Event Listeners

function addSubmitBookingEventListener(picker) {
  document.querySelector('.submit-trip-btn-js').addEventListener('click', function() {
    handleSubmitBooking(picker);
    })
}

function addTravelerNavigationEventListeners() {
  document.querySelector('footer').addEventListener('click', function() {
    if (event.target.classList.contains('bk-trip-js')) {
      showTravelerPage(date, destinations, bgIndex, picker);
    } else if (event.target.classList.contains('my-trips-js')) {
      showTravelerTripsPage();
    }
  })
}




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

// UTILITY FUNCTIONS


function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function formatDateToSentence(date) {
  const customParseFormat = require('dayjs/plugin/customParseFormat');
  dayjs.extend(customParseFormat);
  const dateString = dayjs(date).format('YYYY/MM/DD');
  const dayJSDate = dayjs(dateString, 'YYYY/MM/DD');
  return dayJSDate.format('D MMMM');
}



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
  addTravelerNavigationEventListeners();
}

/* Booking Page - Search Bar */

function handleSubmitBooking(picker) {
  event.preventDefault();
  if (document.querySelector('#datepicker').value === '') {
    showStatusMessages('date error');
    setTimeout(() => {
      showTravelerPage(date, destinations, bgIndex, picker);
    }, 2000);
    return;
  }
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
  showConfirmBookingPage(start, end);
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

function showConfirmBookingPage(start, end) {
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
          <h4 class="booking-detail-header">Travelers</h4>
          <p class="booking-detail-text"> ${tripBooking.travelers}</p>
        </div>
        <div class="confirm-booking-details-box">
          <h4 class="booking-detail-header">Dates</h4>
          <p class="booking-detail-text">${formatDateToSentence(start)} to ${formatDateToSentence(end)} (${tripBooking.duration} days)</p>
        </div>
        <div class="confirm-booking-details-box">
          <h4 class="booking-detail-header">Total Cost</h4>
          <p class="booking-detail-text"> ${cost}</p>
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
  document.querySelector('.confirm-booking-btn-js').addEventListener('click', function(event) {
    event.preventDefault();
    postNewTrip(tripBooking)
      .then((response) => {
        handlePostSuccess(response);
      })
      .catch((error) => {
        handlePostFailure(error);
      });
  });  
  document.querySelector('.cancel-booking-btn-js').addEventListener('click', function() {
    event.preventDefault();
    showTravelerPage(date, destinations, bgIndex, picker);
  });
}

function handlePostSuccess(response) {
  console.log('Success:', response);
  fetchTrips().then(tripData => {
    trips = new Trips(tripData.trips);
    showStatusMessages("success");
    setTimeout(function() {
      showTravelerPage(date, destinations, bgIndex, picker);
    }, 4000);
  })
}
function handlePostFailure(error) {
  console.error('Error:', error);
  showStatusMessages("failure");
  setTimeout(function() {
    showTravelerPage(date, destinations, bgIndex, picker);
  }, 20000);
}

function showStatusMessages(message) {
  let body = document.querySelector('body');
  body.innerHTML = '';
  if (message === "success") {
  body.innerHTML = `
  <main class="booking-main">
    <section class="status-info">
      <h2 class="status-title">Success!</h2> 
      <p class="status-subtext"> Your booking request has been sent to our travel agents. You will receive a confirmation email shortly.</p>
    </section>
  </main>
  `
  } else if (message === 'failure') {
    body.innerHTML = `
    <main class="booking-main">
      <section class="status-info">
          <h2 class="status-title">Booking Request Error</h2> 
          <p class="status-subtext"> There was an issue with our booking systems. Please try again later.</p>
      </section>
    </main>
    `
  } else if (message === 'date error') {
    body.innerHTML = `
    <main class="booking-main">
      <section class="status-info">
          <h2 class="status-title">Booking Request Error</h2>
          <p class="status-subtext">Please select a date range for your booking.</p>
      </section>
    </main>
    `
  }
}

// Traveler Pages: Trips Page //

function showTravelerTripsPage() {
  populateTravelerTripsPage();
  populateTravelerTripList();
}

function populateTravelerTripsPage() {
  let body = document.querySelector('body');
  body.innerHTML = '';
  body.innerHTML = `
  <main class="traveler-main">
    <section class="traveler-trips-container">
      <h2 class="traveler-trips-title">My Trips</h2>
      <section class="traveler-trips-cards-container">
      </section>
    </section>
  </main>
  `
}

function populateTravelerTripList(){
  let travelerTrips = trips.getTripsByUserId(traveler.id);
  let travelerTripsContainer = document.querySelector('.traveler-trips-cards-container');
  travelerTripsContainer.innerHTML = '';
  travelerTrips.forEach(trip => {
    travelerTripsContainer.innerHTML += `
    <section class="traveler-trip-card">
      <img class="traveler-trip-img" src="${destinations.getDestinationById(trip.destinationID).image}">
      <h3 class="traveler-trip-title">${destinations.getDestinationById(trip.destinationID).destination}</h3>
      <p class="traveler-trip-dates">${formatDateToSentence(trip.date)}</p>
      <p class="traveler-trip-status">${trip.status}</p>
    </section>
    `
  })
}
