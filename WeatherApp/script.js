let cityInput=document.getElementById("city_input"),
searchBtn=document.getElementById("searchBtn"),
api_key='0e8d6335d38f6fb7ff74f1437506f5af',
currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
fiveDaysForecastCard=document.querySelector('.day-forecast'),
apiCard=document.querySelectorAll('.highlights .card')[0],
aqiList=['Good','Fair','Moderate','Poor','Very Poor'],
sunriseCard=document.querySelectorAll('.highlights .card')[1],
humidityVal=document.getElementById('humidityVal'),
pressureVal=document.getElementById('pressureVal'),
visibilityVal=document.getElementById('visibilityVal'),
windVal=document.getElementById('windVal'),
feelsVal=document.getElementById('feelsVal'),
hourlyForecastCard=document.querySelector('.hourly-forecast');

function getweatherDetails(name,lat,lon,country,state){
    let FORECAST_API_URL=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API_URL=`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days=[
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months=[
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    fetch(AIR_POLLUTION_API_URL).then(res=> res.json()).then(data=>{
        let {co,no,no2,o3,so2,pm2_5,pm10,nh3}=data.list[0].components;
        apiCard.innerHTML=`
        <div class="card-head">
              <p>Air Quality</p>
              <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi -1]}</p>
            </div>
            <div class="air-indices">
              <i class="fa-regular fa-wind fa-3x"></i>
              <div class="item">
                <p>PM2.5</p>
                <h2>${pm2_5}</h2>
              </div>
               <div class="item">
                <p>PM10</p>
                <h2>${pm10}</h2>
              </div>
               <div class="item">
                <p>SO2</p>
                <h2>${so2}</h2>
              </div>
               <div class="item">
                <p>CO</p>
                <h2>${co}</h2>
              </div>
               <div class="item">
                <p>NO</p>
                <h2>${no}</h2>
              </div>
               <div class="item">
                <p>NO2</p>
                <h2>${no2}</h2>
              </div>
                 <div class="item">
                <p>NH3</p>
                <h2>${nh3}</h2>
              </div>
                  <div class="item">
                <p>O3</p>
                <h2>${o3}</h2>
              </div>
            </div>
        `;
    }).catch(()=>{
        alert("Failed to fetch air pollution");
    })

    fetch(WEATHER_API_URL).then(res=>res.json()).then(data=>{
        let date=new Date();
        currentWeatherCard.innerHTML=`
        <div class="current-weather">
            <div class="details">
              <p>Now</p>
              <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
              <p>${data.weather[0].description}</p>
            </div>
            <div class="weather-icon">
              <img src="./assets/weather_icons/02d.png" alt="" class="'now-img">
            </div>
          </div>
          <hr>
          <div class="card-footer">
            <p><i class="fa-light fa-calendar">${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}</i></p>
            <p><i class="fa-light fa-location-dot">${name}, ${country}</i></p>
          </div>
        `;

    let {sunrise,sunset}=data.sys,
    {timezone, visibility}=data,
    {humidity,pressure,feels_like}=data.main,
    {speed}=data.wind,
    sRiseTimne=moment.utc(sunrise,'X').add(timezone,'second').format('hh:mm A'),
    sSetTimne=moment.utc(sunset,'X').add(timezone,'second').format('hh:mm A');

    sunriseCard.innerHTML=`
    <div class="card-head">
              <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
              <div class="item">
                <div class="icon">
                  <i class="fa-light fa-sunrise fa-4x"></i>
                </div>
                <div>
                  <p>Sunrise</p>
                  <h2>${sRiseTimne}</h2>
                </div>
              </div>
              <div class="item">
                <div class="icon">
                  <i class="fa-light fa-sunset fa-4x"></i>
                </div>
                <div>
                  <p>Sunset</p>
                  <h2>${sSetTimne}</h2>
                </div>
              </div>
            </div>
    `;
    
    humidityVal.innerHTML=`${humidity}%`;
    pressureVal.innerHTML=`${pressure}hPa`;
    visibilityVal.innerHTML=`${visibility/1000}km`;
    windVal.innerHTML=`${speed}m/s`;
    feelsVal.innerHTML=`${(feels_like -273.15).toFixed(2)}&deg;C`;
    }).catch(()=>{
        alert('Failed to fetch current weather');
    });
    fetch(FORECAST_API_URL).then(res=>res.json()).then(data=>{
        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML='';
        for(i=0;i<=7;i++){
            let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
            let hr = hrForecastDate.getHours();
            let a= 'PM';
            if(hr<12) a='AM';
            if(hr==0) hr=12;
            if(hr>12) hr=hr-12;
            hourlyForecastCard.innerHTML+=`
            <div class="card">
            <p>${hr} ${a}</p>
            <img src="./assets/weather_icons/02d.png" alt="">
            <p>${(hourlyForecast[i].main.temp -273.15).toFixed(2)}&deg;C</p>
            </div>
            `;
        }
        let uniqueForecastDays=[];
        let fiveDaysForecast=data.list.filter(forecast=>{
            let forecastDate=new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        fiveDaysForecastCard.innerHTML='';
        for(i=1;i<fiveDaysForecast.length;i++){
            let date=new Date(fiveDaysForecast[i].dt_txt);
            fiveDaysForecastCard.innerHTML+=`
            <div class="forecast-item">
              
                <div class="icon-wrapper">
                  <img src="./assets/weather_icons/02d.png" alt="">
                  <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                </div>
                <p>${date.getDate()} ${months[date.getMonth()]}</p>
                <p>${days[date.getDay()]}</p>
              
            </div>
            `;
        }
    }).catch(()=>{
        alert('Failed to fetch weather forecast');
    });
}


function getCityCoordinates(){
    let cityName=cityInput.value.trim();
    cityInput.value='';
    if(!cityName) return;
    let GEOCODING_API_URL= `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res=> res.json()).then(data=>{
        let {name,lat,lon,country,state}=data[0];
        getweatherDetails(name,lat,lon,country,state);

    }).catch(()=>{
        alert(`Failed to fetch coordinates of ${cityName}`);
    })

}

searchBtn.addEventListener("click", getCityCoordinates);