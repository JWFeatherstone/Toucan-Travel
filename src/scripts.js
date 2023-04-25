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
import { KbdPlugin, easepick }  from '@easepick/bundle'
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

function addSubmitBookingEventListener() {
  document.querySelector('.submit-trip-btn-js').addEventListener('click', function() {
    handleSubmitBooking();
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

let fetchAPIs = () => {
  Promise.all([fetchTravelers(), fetchTrips(), fetchDestinations()])
  .then(([travelersData, tripsData, destinationsData]) => {
    travelers = new Travelers(travelersData.travelers);
    trips = new Trips(tripsData.trips);
    destinations = new Destinations(destinationsData.destinations);
    console.log(destinations)
    traveler = new Traveler(travelers.getTravelerById(2));
    bgIndex = getRandomIndex(backgrounds);
    showTravelerPage(date, destinations, bgIndex);
  })
  .catch(error => {
    console.error('Error fetching data:', error.message);
  })
}

fetchAPIs();


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

function showTravelerPage(today, destinations, bgIndex) {
  populateTravelerPage(bgIndex)
  populateDestinationList(destinations);
  addSubmitBookingEventListener();
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
        <select required name="destinationInput" placeholder="Destination" class="trip-input" id="destinationInput" data-id="destinations">
        </select>
      </div>
      <div class="input-holder date-holder">
        <label for="calendarStart" class="trip-input date-label">Depart</label>
        <input type="date" id="calendarStart" name="date-start" min="${dayjs(date).format('YYYY-MM-DD')}" class="calendar trip-input" aria-label="Choose a start date (mm/dd/yyyy) for your vacation."required>
      </div>
      <div class="input-holder date-holder">
        <label for="calendarEnd" class="trip-input date-label">Return</label>
        <input type="date" id="calendarEnd" name="date-start" min="${dayjs(date).format('YYYY-MM-DD')}" class="calendar trip-input" aria-label="Choose an end date (mm/dd/yyyy) for your vacation."required>
      </div>
      <div class="input-holder travelers-holder">
        <div class="search-icon"></div>
        <select required class="trip-input" id="numTravelerInput">
          <option value="1">1 Traveler</option>
          <option value="2">2 Travelers</option>
          <option value="3">3 Travelers</option>
          <option value="4">4 Travelers</option>
          <option value="5">5 Travelers</option>
          <option value="6">6 Travelers</option>
          <option value="7">7 Travelers</option>
          <option value="8">8 Travelers</option>
          <option value="9">9 Travelers</option>
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

function handleSubmitBooking() {
  event.preventDefault();
  const startDate = document.querySelector('#calendarStart').value;
  const endDate = document.querySelector('#calendarEnd').value;
  dateErrorHandling(startDate, endDate)
  const diff = dayjs(endDate).diff(dayjs(startDate), 'day');
  tripBooking = {
    id: trips.getNewTripId(),
    userID: traveler.id,
    destinationID: parseInt(document.querySelector('#destinationInput').value),
    travelers: parseInt(document.querySelector('#numTravelerInput').value),
    date: dayjs(startDate).format('YYYY/MM/DD'),
    duration: diff,
    status: 'pending',
    suggestedActivities: []
  }
  showConfirmBookingPage(startDate, endDate);
}

function populateDestinationList(destinations) {
  let alphabetizedDestinations = destinations.data.sort((a, b) => {
    return a.destination.localeCompare(b.destination);
  });
  alphabetizedDestinations.forEach(destination => {
    let dropDown = document.querySelector('#destinationInput');
    dropDown.innerHTML += `
      <option id="destination_${destination.id}" value="${destination.id}" aria-label="${destination.destination}">${destination.destination}</option>
    `;
  });  
}

function dateErrorHandling(startDate, endDate) {
  if (dayjs(startDate).isAfter(endDate)) {
    showStatusMessages('start after end');
    setTimeout(() => {
      showTravelerPage(date, destinations, bgIndex);
    }, 2000);
    return;
  } else if (startDate === endDate) {
    showStatusMessages('same date');
    setTimeout(() => {
      showTravelerPage(date, destinations, bgIndex);
    }, 2000);
    return;
  } else if (startDate === '' || endDate === '') {
    console.log("yyyy")
    showStatusMessages('empty date');
    setTimeout(() => {
      showTravelerPage(date, destinations, bgIndex);
    }, 2000);
    return;
  }
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
  } else if (message === 'empty date' || message === 'same date') {
    body.innerHTML = `
    <main class="booking-main">
      <section class="status-info">
          <h2 class="status-title">Booking Request Error</h2>
          <p class="status-subtext">Please select a date range for your booking.</p>
      </section>
    </main>
    `
  } else if (message === 'start after end') {
    body.innerHTML = `
    <main class="booking-main">
      <section class="status-info">
          <h2 class="status-title">Booking Request Error</h2>
          <p class="status-subtext">The return date must be after the departure date.</p>
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

function createTripsSummaryCard() {
  let totalSpent = trips.calculateTotalSpent(traveler.id, destinations);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  let faveDestination = trips.getFavoriteDestination(traveler.id);
  let cost = formatter.format(totalSpent)
  const card = `
    <li class="glide__slide traveler-summary-slide">
      <h3 class="slide-title">${traveler.name}</h3>
      <div class="slide-text-container">
        <div class="slide-details-box trips-heading-box">
          <h4 class="booking-detail-header slide-header summary-header">Trips</h4>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header summary-header">Upcoming</h4>
          <p class="slide-text"> ${trips.getUserTripsByDate(traveler.id, "upcoming", date).length}</p>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header summary-header">Pending</h4>
          <p class="slide-text"> ${trips.getUserTripsByStatus(traveler.id, "pending").length}</p>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header summary-header">Past</h4>
          <p class="slide-text"> ${trips.getUserTripsByDate(traveler.id, "past", date).length}</p>
        </div> 
        <div class="slide-details-box trips-heading-box">
          <h4 class="booking-detail-header slide-header summary-header">Traveler Profile</h4>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Traveler Style:</h4>
          <p class="slide-text"> ${traveler.travelerType.charAt(0).toUpperCase()}${traveler.travelerType.slice(1)}</p>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Total Spent:</h4>
          <p class="slide-text"> ${cost}</p>
        </div> 
          <div class="slide-details-box trips-heading-box">
          <h4 class="booking-detail-header slide-header summary-header">Traveler Stats</h4>
        </div> 
        <div class="slide-details-box">
          <h4 class="booking-detail-header slide-header">Favorite Destination:</h4>
          <p class="slide-text"> ${destinations.getDestinationById(faveDestination).destination}</p>
        </div> 
      </div>
    </li>
  `;
  return card
}


function populateTravelerTripList() {
  let travelerTrips = trips.getTripsByUserId(traveler.id);
  console.log('Traveler Trips', travelerTrips)
  const carousel = document.querySelector('.glide__slides');
  carousel.innerHTML = '';
  carousel.innerHTML += createTripsSummaryCard();
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
