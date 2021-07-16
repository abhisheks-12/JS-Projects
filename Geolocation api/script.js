'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat,lng]
    this.distance = distance; // in km
    this.duration = duration; //in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadance) {
    super(coords, distance, duration);
    this.cadance = cadance;
    this.calcPace(); // calling Methods
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed(); // calling Methods
    // this.type = 'cycling';
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//////////////////////////////
// Experimental  code
// const run1 = new Running([39,12],5.2,24,178);
// const cycling1= new Cycling([39,-12],27,95,523);
// console.log(run1);
// console.log(cycling1);

/////////////////////////////////
// Application Architecture

class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoom = 13;

  constructor() {
    // get user position
    this._getPosition();

    // get dat from local storage
    this._getlocalStorage();

    // event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    // CHANGE
    inputType.addEventListener('change', this._toggleElevation.bind(this));
    containerWorkouts.addEventListener('click', this._moveToPopUp.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    // console.log(`https://www.google.com/maps/place/+Maharashtra/@${latitude},${longitude}/data=!3m1!4b1!4m5!3m4!1s0x3bc182450c753bad:0xb3493b19ae7886ca!8m2!3d17.277693!4d74.1843535`);

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoom);
    // console.log(map);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // HANDLING MAP EVENTS
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach((work)=> {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevation() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const inputPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // get fata from form
    const type = inputType.value;
    const distance = Number(inputDistance.value);
    const duration = Number(inputDuration.value);
    let workout;

    // lat and lng
    const { lat, lng } = this.#mapEvent.latlng;

    // if workout is running create running object
    if (type === 'running') {
      const cadance = Number(inputCadence.value);
      // check data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadance)
        !validInputs(distance, duration, cadance) &&
        !inputPositive(distance, duration, cadance)
      )
        return alert('Input must be positive number');

      workout = new Running([lat, lng], distance, duration, cadance);
    }

    // if workout is cycling create cyling obj
    if (type === 'cycling') {
      const elevation = Number(inputElevation.value);

      if (
        !validInputs(distance, duration, elevation) &&
        !inputPositive(distance, duration)
      )
        return alert('Input must be positive number');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // add an object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // render workout on map as marker
    this._renderWorkoutMarker(workout);

    // render workout on list
    this._renderWorkout(workout);

    // hide workout and clear input fileds
    this._hideForm();

    // set local storage
    this._setlocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    `;

    if (workout.type === 'running') {
      html += ` <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">🦶🏼</span>
      <span class="workout__value">${workout.cadance}</span>
      <span class="workout__unit">spm</span>
    </div>
     </li>`;
    }

    if (workout.type === 'cycling') {
      html += ` <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>`;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopUp(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoom, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // workout.click();
  }

  // here workouts is key
  _setlocalStorage(){
     localStorage.setItem('workouts',JSON.stringify(this.#workouts))
  }
  
  _getlocalStorage(){
    const data = JSON.parse(localStorage.getItem('workouts'));
    console.log(data);

    if(!data) return;

    // restoring data
    this.#workouts = data;

    this.#workouts.forEach((work)=> {
      this._renderWorkout(work);;
      // this._renderWorkoutMarker(work);
    });

  }
  reset(){
    localStorage.removeItem('workouts');
    location.reload();
  }

  
}

// creating object
const app = new App();
// app.reset();