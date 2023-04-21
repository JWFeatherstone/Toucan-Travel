import { easepick }  from '@easepick/bundle'
import { RangePlugin } from '@easepick/range-plugin'
import { LockPlugin } from '@easepick/lock-plugin'
import SlimSelect from 'slim-select'


function showTravelerPage(today, destinations, bgIndex) {
  populateTravelerPage(bgIndex)
  displayCalendar(today);
  populateDestinationList(destinations);
  populateTravelerNumberSelect();
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
      <button class="nav-btns submit-btn">Submit</button>
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

/* Traveler Page - Search Bar */

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

function displayCalendar(today){
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
});
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



function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}


export { showTravelerPage }