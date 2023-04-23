/*
**************
CSS FILE IMPORTS
**************
*/
import '@glidejs/glide/dist/css/glide.core.min.css'
import '@glidejs/glide/dist/css/glide.theme.min.css'
import './css/styles.css';


/*
**************
IMAGE IMPORTS
**************
*/

import './images/turing-logo.png'
import './images/Calendar-Icon.svg'
import './images/azores.jpg'
import './images/iceland.jpg'
import './images/mediterranean.jpg'
import './images/mtstmichel.jpg'
import './images/namibia.jpg'
import './images/peru.jpg'
import './images/montana.png'


/*
**************
CLASS IMPORTS
**************
*/

import Travelers from './classes/travelers';
import Traveler from './classes/traveler';
import Trips from './classes/trips';
import Destinations from './classes/destinations';
import backgrounds from './backgrounds';

/*
**************
THIRD PARTY LIBRARY IMPORTS
**************
*/

import dayjs from 'dayjs';
import { easepick }  from '@easepick/bundle'
import { RangePlugin } from '@easepick/range-plugin'
import { LockPlugin } from '@easepick/lock-plugin'
import SlimSelect from 'slim-select'
import Glide from '@glidejs/glide'

/*
**************
IMPORTED FUNCTIONS
**************
*/
import './api-calls';
import {
  fetchTravelers,
  fetchTrips,
  fetchDestinations,
  postNewTrip
} from './api-calls';

/*
**************
GLOBAL VARIABLES
**************
*/

let travelers, trips, destinations, traveler;
let date = dayjs().format('YYYY/MM/DD');
let picker;
let tripBooking = {};
let bgIndex;

/*
**************
EVENT LISTENERS
**************
*/

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


/*
**************
FETCH REQUESTS
**************
*/

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
  return dayJSDate.format('D MMMM YY');
}

function getPastOrUpcomingOrPending(trip) {
  if (trip.status === 'pending') {
    return 'Pending';
  } else if (dayjs(trip.date).isBefore(date)) {
    return 'Past';
  } else {
    return 'Upcoming';
  }
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
  body.classList.add('body-grid');
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
  let cost = formatter.format(destinations.calculateTripCost(tripBooking.destinationID, tripBooking.travelers, tripBooking.duration));
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
  addTravelerNavigationEventListeners();
}

function populateTravelerTripsPage() {
  let body = document.querySelector('body');
  body.classList.remove('body-grid');
  body.classList.add('body-carousel');
  body.innerHTML = '';
  body.innerHTML = `
  <main class="main-carousel">
    <div class="glide-wrap">
      <div class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides">
          </ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<"><< Prev</button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">">Next >></button>
        </div>
      </div>
    </div>
  </main>
  <footer class="carousel-footer">
    <nav>
      <button class="nav-btns bk-trip-js">Book Trip</button>
      <div class="nav-separator"></div>
      <button class="nav-btns my-trips-js">My Trips</button>
    </nav>
  </footer>
  `
}

function createTripCard(trip) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  let cost = formatter.format(destinations.calculateTripCost(trip.destinationID, trip.travelers, trip.duration))
  const card = `
    <li class="glide__slide">
    <h3 class="slide-title">${(destinations.getDestinationById(trip.destinationID).destination)} </h3>
      <div class="slide-text-container">
        <div class="slide-details-box ${getPastOrUpcomingOrPending(trip)}">
          <h4 class="booking-detail-header slide-header">Status:</h4>
          <p class="slide-text"> ${getPastOrUpcomingOrPending(trip)}</p>
        </div>
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Date:</h4>
          <p class="slide-text"> ${formatDateToSentence(trip.date)}</p>
        </div>
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Duration:</h4>
          <p class="slide-text"> ${trip.duration} days</p>
        </div>
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Travelers:</h4>
          <p class="slide-text"> ${trip.travelers}</p>
        </div>
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Total Cost:</h4>
          <p class="slide-text"> ${cost}</p>
        </div>
      </div>
      <div class="slide-img-container">
        <img class="slide-img" src="${destinations.getDestinationById(trip.destinationID).image}">
      </div>
    </li>
  `;
  return card;
}


function populateTravelerTripList(){
  let travelerTrips = trips.getTripsByUserId(traveler.id);
  console.log('Traveler Trips', travelerTrips)
  const carousel = document.querySelector('.glide__slides');
  carousel.innerHTML = '';
  travelerTrips.forEach(trip => {
    carousel.innerHTML += createTripCard(trip)
  });
  const glide = new Glide('.glide', {
    type: 'carousel',
    focusAt: 'center',
    perView: 3,
  })
  glide.mount()
}
