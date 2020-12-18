async function getWeatherDataByLocation(location) {
	try {
		const weatherDataFetch = await fetch(
			'http://api.openweathermap.org/data/2.5/weather?&appid=3b833f089623b82fe87a17fa4b179d2a&units=metric&lang=es&q=' +
				location,
			{ mode: 'cors' }
		);
		const weatherData = await weatherDataFetch.json();
		renderPage(weatherData);
	} catch (err) {
		locationErrorHandler(err);
	}
}

function locationErrorHandler(err) {
	const locationError = document.querySelector('[data-form="location-error"]');
	locationError.classList.remove('hidden');
	console.log(err);
}

function getGeolocation() {
	const geoError = document.querySelector('[data-form="geolocation-error"]');

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(geolocationHandler);
	} else {
		geoError.classList.remove('hidden');
	}
}

async function geolocationHandler(data) {
	try {
		const weatherDataFetch = await fetch(
			'http://api.openweathermap.org/data/2.5/weather?&appid=3b833f089623b82fe87a17fa4b179d2a&units=metric&lang=es&lat=' +
				data.coords.latitude +
				'&lon=' +
				data.coords.longitude,
			{ mode: 'cors' }
		);
		const weatherData = await weatherDataFetch.json();
		renderPage(weatherData);
	} catch (err) {
		geoErrorHandler(err);
	}
}

function geoErrorHandler(err) {
	const geoError = document.querySelector('[data-form="geolocation-error"]');
	geoError.textContent = 'Hubo un problema con la geolocación';
	geoError.classList.remove('hidden');
	console.log(err);
}

function renderPage(weatherData) {
	renderLocation(weatherData.name, weatherData.sys.country);
	renderWeather(
		weatherData.weather[0].description,
		weatherData.weather[0].icon,
		weatherData.main.temp,
		weatherData.wind.speed,
		weatherData.main.feels_like,
		weatherData.main.humidity
	);
}

function renderLocation(location, country) {
	const locationDOM = document.querySelector('[data-location]');
	const countryDOM = document.querySelector('[data-country]');
	locationDOM.textContent = location;
	countryDOM.textContent = country;
}

function renderWeather(general, iconCode, temp, wind, ST, hum) {
	const weatherGeneralDOM = document.querySelector('[data-weather="general"]');
	const weatherIconDOM = document.querySelector('[data-weather="icon"]');
	const weatherTempDOM = document.querySelector('[data-weather="temp"]');
	const weatherWindDOM = document.querySelector('[data-weather="wind"]');
	const weatherSTDOM = document.querySelector('[data-weather="ST"]');
	const weatherHumDOM = document.querySelector('[data-weather="humidity"]');

	weatherGeneralDOM.textContent =
		[...general][0].toUpperCase() + [...general].slice(1).join(''); //Mayus
	weatherIconDOM.src = 'imgs/' + iconCode + '.png';
	weatherTempDOM.textContent = temp + 'º';
	weatherWindDOM.textContent =
		'Viento: ' + (wind * 3.6).toPrecision(3) + ' km/h'; // m/s a km/h
	weatherSTDOM.textContent = 'S. Térmica: ' + ST + 'º';
	weatherHumDOM.textContent = 'Humedad: ' + hum + '%';
}

(function addFormListener() {
	const form = document.querySelector('[data-form="form"]');
	const geoloc = document.querySelector('[data-form="geoloc"]');
	form.addEventListener('submit', (e) => formHandler(e));
	form.addEventListener('submit', getGeolocation);
})();

function formHandler(e) {
	e.preventDefault();

	const locationError = document.querySelector('[data-form="location-error"]');
	const formInput = document.querySelector('[data-form="input"]');
	locationError.classList.add('hidden');
	getWeatherDataByLocation(formInput.value);
}

getGeolocation();
