async function getWeatherData(location) {
	const weatherDataFetch = await fetch(
		'http://api.openweathermap.org/data/2.5/weather?&appid=3b833f089623b82fe87a17fa4b179d2a&units=metric&lang=es&q=' +
			location,
		{ mode: 'cors' }
	);
	const weatherData = await weatherDataFetch.json();

	console.log(weatherData);
}

getWeatherData('buenos aires');
