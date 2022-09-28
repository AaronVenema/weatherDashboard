var cityInput= document.getElementById("city-input")
var searchBtn= document.getElementById("search-button")
var clearBtn= document.getElementById("clear-button")
var historyCont= document.getElementById("historyCont")
var forecast= document.getElementById("forecast")
let historyCityName= []
let weatherDays = []  
let currDay = null

function addToDOM(tag, content, appendTo){
  const elem = document.createElement(tag)
  elem.textContent = content
  appendTo.appendChild(elem)
}

function renderSearchHistory (){
  if (historyCont.innerHTML) { 
    historyCont.innerHTML = "";
  }
  for(let i=0; i< historyCityName.length; i++) {
    console.log(i)
    const btn = document.createElement("button");
    btn.setAttribute('type', "button");
    btn.setAttribute('class',"btn btn-dark m-2 mb-3 rounded-pill");
    btn.setAttribute('data-search', historyCityName[i]);
    btn.textContent= historyCityName[i];
    historyCont.appendChild(btn);
  }
}

function addToHistory (searchInputVal){
  if (historyCityName.indexOf(searchInputVal) != -1){
    return;
  }
  historyCityName.push(searchInputVal)
  localStorage.setItem('search-history', JSON.stringify(historyCityName))
  getSearchHistory();
}


function getSearchHistory(){
  var savedHistory = localStorage.getItem('search-history');
  if (savedHistory){
    historyCityName=JSON.parse(savedHistory)
  }
  console.log(savedHistory)
  console.log(historyCityName)
  renderSearchHistory();
}


function handleSearchFormSubmit(event) {
  event.preventDefault();
  forecast.innerHTML="";
  var searchInputVal = cityInput.value;
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  retrieve(searchInputVal);
  addToHistory(searchInputVal);
}

function retrieve(searchInputVal){
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInputVal}&appid=721eb51c87bcd053bffb1681ef4d705c&units=imperial`
fetch(url, {
})
.then(response => response.json())
.then(data => {

  weatherDays = []

  data.list.forEach( function(tsObj){

    // Makes a moment date object for each record
    const dateObj = moment.unix(tsObj.dt)
  
    // Generate the day # for the day in the date object
    const dateNum = dateObj.format("DDD")
    
    // If the current date in tsObj hasn't had a record put into weatherDays, do that now 
    // Then skip over all other records for this day
    if( dateNum !== currDay && weatherDays.length < 5 ){
      weatherDays.push( tsObj )
      currDay = dateNum
    }
    
  })
  console.log(weatherDays)
  
  //do stuff with the data

  // console data to dom element
  //   parse into object to get specific data (current day, temperature, windspeed, humidity, icon) 
for(let i=0; i< weatherDays.length; i++) {
    const elem = document.createElement("section")
    elem.setAttribute("class", "col row m-3 forecast bg-transparent text-white text-center")
    forecast.appendChild(elem)

    let currentDay= moment.unix(weatherDays[i].dt).format("dddd MM/DD/YYYY")
    addToDOM("span", currentDay, elem)

    let currentIcon = weatherDays[i].weather[0].icon
    var img = document.createElement("img")
    img.setAttribute("src", `https://openweathermap.org/img/wn/${currentIcon}@2x.png`)
    elem.appendChild(img)

    let currentTemp = weatherDays[i].main.temp;
    addToDOM("span", "Temperature: " + currentTemp, elem)

    let currentWind = weatherDays[i].wind.speed;
    addToDOM("span","Wind Speed: " + currentWind, elem)

    let currentHum = weatherDays[i].main.humidity;
    addToDOM("span","Humidity; " + currentHum, elem)
    };
  })
}
function clearSearchHistory(){
  historyCont.innerHTML = "";
  forecast.innerHTML = "";
  console.log("here")
}



function getCitySwag(name){
  forecast.innerHTML = "";
  retrieve(name);
}
// renderSearchHistory();
searchBtn.addEventListener('click', handleSearchFormSubmit);
clearBtn.addEventListener('click', clearSearchHistory);
historyCont.addEventListener('click', function(event){
  event.target.nodeName
  console.log(event.target.nodeName)
  if(event.target.nodeName=="BUTTON"){
    getCitySwag(event.target.innerText)
  }
});