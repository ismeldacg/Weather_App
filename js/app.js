const container = document.querySelector('.container');
const windowHidden = document.querySelector('#wind-hide');
const result = document.querySelector('#result');
const formular = document.querySelector('#formular');
const wind = document.querySelector('#wind-speed');
const dampness = document.querySelector('#humidity');
const sensation = document.querySelector('#feels-like');
const sunRise = document.querySelector('#sun-rise');
const sunSet = document.querySelector('#sun-set');
const countryOption = document.querySelector('#country');

const countryId = [{name: "Argentina", id: "AR"}, {name:"China", id:"CN"}, {name: "Colombia", id: "CO"}, {name: "Germany", id:"DE"},
    {name: "Mexico", id: "MX"}, {name: "Spain", id:"ES"}, {name:"United States", id:"US"}, {name: "United Kingdom", id: "GB"},
    {name: "Venezuela", id:"VE"}
]
window.addEventListener('load', () => {
    showCountry();
    formular.addEventListener('submit', searchWeather);
})

function showCountry() {
    for(let i=0; i<countryId.length; i++) {
        const countryList = document.createElement('option');
        countryList.textContent = countryId[i].name;
        countryList.value = countryId[i].id;
        countryOption.appendChild(countryList);
    }  
}
function searchWeather(e) {
    e.preventDefault();
    // Validate 
    const city = document.querySelector('#city').value;
    const country = document.querySelector('#country').value;

    if(city === '' || country === '') {
        // There was an error
        showError('Both fields are required');
        return;
    }

    // Query to API
    queryAPI(city, country);

}

function showError(message) {
    windowHidden.classList.add('hidden');
    const alert = document.querySelector('.bg-red-100');

    if(!alert) {
        // Create an alert
        const alert = document.createElement('div');

        alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alert.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${message}</span>
        `;
        container.appendChild(alert);

        //Delete alert after 5 sec
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
    
}

function queryAPI(city, country) {
    const appId = 'a6c1764a03d9fa38b3d224c471337991';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${appId}`;

    Spinner(); // show a spinner during to load
    fetch(url)
        .then( answer => answer.json())
        .then( data => {
            cleanHTML(); // clean previous HTML
            if(data.cod === "404") {
                showError('City not found');
                return;
            }
            // Print result in HTML
            showWeather(data);
        })
    
}
function showWeather(data){
    const { name, main: { feels_like, humidity, temp, temp_max, temp_min }, sys: { sunrise, sunset }, timezone , wind: { speed }, weather } = data;
    const celsius = kelvinToCelsius(temp);
    const max = kelvinToCelsius(temp_max);
    const min = kelvinToCelsius(temp_min);
    const description = weather[0].main;
    const weatherIcon = weather[0].icon;

    const urlIcon = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

    const feelsLike = kelvinToCelsius(feels_like);

    const windSpeed = speedConversor(speed);

    const sunriseTime = sunTimeConversor(sunrise,timezone)
    const sunsetTime = sunTimeConversor(sunset,timezone)

    const imgIcon = document.createElement('img');
    imgIcon.src = urlIcon;
    imgIcon.classList.add('mx-auto');

    const nameCity = document.createElement('p');
    nameCity.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${name} - ${countryOption.value}`;
    nameCity.classList.add('font-bold', 'text-2xl');

    const current = document.createElement('p');
    current.innerHTML = `${celsius} &#8451;`;
    current.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `${max} / ${min} &#8451;`;
    tempMax.classList.add('font-bold', 'text-xl');

    const weatherDesc = document.createElement('p');
    weatherDesc.innerHTML = description;
    weatherDesc.classList.add('font-bold', 'text-xl');

    const datum = new Date();
    const day = datum.getDay();
    const month = datum.getMonth();
    const year = datum.getFullYear();
    const monthName = ['January', 'Frebruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayToday = datum.getDate();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = document.createElement('p');
    today.innerHTML = `${dayName[day]}, the ${dayToday} of ${monthName[month]}, ${year}`;
    today.classList.add('text-base', 'mt-3');

    windowHidden.classList.remove('hidden');
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('text-center', 'text-white');
    resultDiv.appendChild(nameCity);
    resultDiv.appendChild(current);
    if(max!==min){
        resultDiv.appendChild(tempMax);
    }
    resultDiv.appendChild(imgIcon);
    resultDiv.appendChild(weatherDesc);
    resultDiv.appendChild(today);

    result.appendChild(resultDiv);
    //console.log(celsius);
    const city = document.querySelector('#city');
    city.value = '';
    const country = document.querySelector('#country');
    country.value = '';

    // wind speed
    const velocity = document.createElement('p');
    velocity.innerHTML = `${windSpeed} Km/h`;
    velocity.classList.add('font-bold', 'text-2xl', 'text-blue-600');
    wind.appendChild(velocity);

    // humidity
    const wet = document.createElement('p');
    wet.innerHTML = `${humidity} %`;
    wet.classList.add('font-bold', 'text-2xl', 'text-blue-600');
    dampness.appendChild(wet);

    //feels_like 
    const feelsTemp = document.createElement('p');
    feelsTemp.innerHTML = `${feelsLike} &#8451;`;
    feelsTemp.classList.add('font-bold', 'text-2xl', 'text-blue-600');
    sensation.appendChild(feelsTemp);

    //sunrise time
    const timeSunrise = document.createElement('p');
    timeSunrise.innerHTML = sunriseTime;
    timeSunrise.classList.add('font-bold', 'text-xl', 'text-blue-600');
    sunRise.appendChild(timeSunrise);

    //sunset time
    const timeSunset = document.createElement('p');
    timeSunset.innerHTML = sunsetTime;
    timeSunset.classList.add('font-bold', 'text-xl', 'text-blue-600');
    sunSet.appendChild(timeSunset);

}
const kelvinToCelsius= degree => parseInt(degree - 273.15);

const speedConversor = speed => parseInt(speed * 3.6);

const sunTimeConversor = (suntime, timezone) => {
    
    let d = new Date(suntime*1000);
    let timeZone = timezone/3600;
    let hourUTC = d.getUTCHours()
    let minuto = d.getUTCMinutes();
    if(minuto < 10){
        minuto = '0'+minuto;
    }
    let hours = timeZone + hourUTC;
    let tiempo = hours + ':' + minuto;
    return tiempo;

}
function cleanHTML() {
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }
    let windChild = wind.childNodes.length;
    
    if(windChild === 5){
        wind.removeChild(wind.lastChild);
        dampness.removeChild(dampness.lastChild);
        sensation.removeChild(sensation.lastChild);
        sunRise.removeChild(sunRise.lastChild);
        sunSet.removeChild(sunSet.lastChild);
    }
}
function Spinner() {
    cleanHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');
    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    `
    result.appendChild(divSpinner);

}