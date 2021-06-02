'use strict';

window.addEventListener('load', () => {
    const ACCESS_KEY = 'c0183ea59ff959ec94df2ec3818ae631';
    const locationTimezone = document.querySelector('.location__timezone');
    const locationPlace = document.querySelector('.location__place');
    const iconBlock = document.querySelector('.icon');
    const temperatureDegree = document.querySelector('.temperature__degree');
    const characteristicsPrecip = document.querySelector('.characteristics__precip');
    const characteristicsWind = document.querySelector('.characteristics__wind');
    const characteristicsPressure = document.querySelector('.characteristics__pressure');
    const update = document.querySelector('.update');
    let long;
    let lat;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {

            long = position.coords.longitude;  // get longitude
            lat = position.coords.latitude;  // get latitude

            const api = `http://api.weatherstack.com/current?access_key=${ACCESS_KEY}&query=${lat},${long}`;

            try {
                getWeatherData(api);
            } catch (error) {
                console.log('error: ', error);
                document.body.textContent = "Oops! The app did not get data. Please, try again later!";
            }

            // update data
            setTimeout(() => update.disabled = false, 2500);
            update.addEventListener('click', () => {
                getWeatherData(api);
            })

        });
    } else {
        locationTimezone.textContent = "Oops! The app is not working. Cannot determine your geolocation. Maybe, you closed access!"
    }

    //  fetchAPI
    function getWeatherData(url) {
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                const { temperature, pressure, precip, wind_speed: windSpeed, weather_icons: icon, weather_code: code } = data.current;  // get present weather's data
                const { country, name, region, timezone_id: timezone, localtime: time } = data.location;  // get user location

                // Set DOM elements
                locationTimezone.textContent = `${timezone}, ${time.substr(-5, 5)}`;
                locationPlace.textContent = `${name}, ${region}, ${country}`;
                temperatureDegree.innerHTML = `${temperature}<span class="temperature__system"> Celsius</span>`;
                characteristicsPrecip.textContent = `Probability of precipitation - ${precip} millimeters`;
                characteristicsWind.textContent = `Speed of wind - ${windSpeed} km/hours`;
                characteristicsPressure.textContent = `Atmospheric pressure - ${pressure} millibar`;
                setIcons(icon, code);
            })
            .catch(err => console.log(err));
    }

    // Set weather's icons
    function setIcons(icon, code) {
        let skycons = new Skycons({ 'color': '#FFFFFF' });
        let night = icon[0].includes('night', 0);
        skycons.play();

        let weatherCodes = {
            CLEAR: [113],
            PARTLY_CLOUDY: [116],
            CLOUDY: [119, 122],
            FOG: [143, 248, 260],
            RAIN: [176, 200, 263, 266, 293, 296, 299, 302, 305, 308, 353, 356, 359, 386, 389],
            SLEET: [179, 182, 185, 281, 284, 311, 314, 317, 320, 350, 362, 365, 374, 377],
            SNOW: [227, 230, 323, 326, 329, 332, 335, 338, 368, 371, 392, 395],
        }

        for (const key in weatherCodes) {
            const element = weatherCodes[key];

            if (element.includes(code)) {
                switch (key) {
                    case 'CLEAR':
                        night ? skycons.add(iconBlock, Skycons.CLEAR_NIGHT)
                            : skycons.add(iconBlock, Skycons.CLEAR_DAY);
                        break;
                    case 'PARTLY_CLOUDY':
                        night ? skycons.add(iconBlock, Skycons.PARTLY_CLOUDY_NIGHT)
                            : skycons.add(iconBlock, Skycons.PARTLY_CLOUDY_DAY);
                        break;
                    case 'CLOUDY':
                        skycons.add(iconBlock, Skycons.CLOUDY);
                        break;
                    case 'FOG':
                        skycons.add(iconBlock, Skycons.FOG);
                        break;
                    case 'RAIN':
                        skycons.add(iconBlock, Skycons.RAIN);
                        break;
                    case 'SLEET':
                        skycons.add(iconBlock, Skycons.SLEET);
                        break;
                    case 'SNOW':
                        skycons.add(iconBlock, Skycons.SNOW);
                        break;
                    default:
                        break;
                }
                break;
            } else {
                skycons.remove(iconBlock);
            }
        }
    }

});
