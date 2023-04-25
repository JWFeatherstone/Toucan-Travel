# Toucan Travel

## Abstract
A web application allowing travelers to log in to view their trip history and to book new trips.

## Preview of App
![demo](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmJmN2E2OTU5ZTAyY2VkMWY1NzQ2NTg1MTgxZjVhMzQxZmU2MTIyMiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/OhWUJqhz5Z6an0eIYX/giphy.gif)

## Technologies Used
### Core
- Javascript
- CSS & HTML
- Webpack module bundler
- Fetch API
- Mocha Javascript testing framework and Chai assertion library

### Third Party Libraries
- Day.js
- Glide.js

### Other
- Git/GitHub
- GitHub project board
- Figma and Adobe Illustrator for wireframing and vector graphics

## API Installation Guide
1. Navigate to [This API](https://github.com/turingschool-examples/travel-tracker-api)
2. Copy SSH key on GitHub inside the code dropdown
3. Using the terminal, run git clone [SSH key here]
4. Run npm install 
5. Run npm start

## Installation Guide
### Setting up the Backend Server
1. Follow the setup instructions provided [here](https://github.com/turingschool-examples/travel-tracker-api) to clone down and start the backend server where the user data APIs are held.


### Setting up the Frontend Site
1. Fork this repository to your GitHub account.
2. Copy SSH key on GitHub inside the code dropdown.
3. Using the terminal, run git clone [SSH key here].
4. cd into the repository.
5. Open it in your text editor.
6. Run npm install 
7. Run npm start
8. Click the hyperlink where the project is running to launch the application in the web browser or enter http://localhost:8080/ into your web browser.


## Project Specification and Background
[Project Spec and Rubric](https://frontend.turing.edu/projects/travel-tracker.html)

This application was developed for the [Turing School of Software and Design's](https://frontend.turing.edu/) Module 2 final solo project. The project, [Travel Tracker](https://frontend.turing.edu/projects/travel-tracker.html), challenged students to build a web application - using APIs hosting traveler, destination, and trip data - that would allow travelers to log in to their account, explore and define trip options, book trips, and view their trip history over time.

## Features
The app presents users with a login page. Upon logging in with their given username and password, they are directed to a booking page allowing them to define, for a potential booking:

1. A destination.
1. Departure and return dates.
1. The number of travelers.

The user is then directed to a booking confirmation page to confirm the details of their booking before submitting their request to the server. 

The user is also able to view their travel statistics - such as their amount spent with the travel agency, Toucan Travel; their past, upcoming, and pending bookings; and their favorite destination - and a carousel with the details of all their bookings.

## Contributors

- John Featherstone - [GitHub](https://github.com/JWFeatherstone) | [LinkedIn](https://www.linkedin.com/in/john-w-featherstone/)

## Wins and Challanges

### Wins:
- Robust and user-friendly error handling.
- Clean and consistent design and readable user interface.
- 100% accessibility score using Lighthouse and the WAV accessibility analysis tools.

### Challenges:
- The integration of third party libraries proved difficult. Two libraries included in the initial layout of the website - SlimSelect, a custom select menu library, and Easepick, which added a modified calendar and the ability to select a range of dates - proved inconsistent with providing users with an accessible user interface, particularly for screen readers, and were ultimately removed.
- A lot remains to be refactored on the project. Due to illness during the final days of the project period, I had to compromise for settling for the MVP and reigning in the original scope. This was a lesson in terms of time management: initially I spent a lot of time building out and tweaking the design for the site's interface as I went along, whereas in the closing days of the project I had to rush to get the MVP finished. I think, in the future, building out the skeleton of the MVP should be paramount to allow sufficient time to focus on streamling and organizing the code.
