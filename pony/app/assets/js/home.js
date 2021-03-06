
// import units from 'constants';

const mapStyles = {
  default: null,
  retro: [
    {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{color: '#c9b2a6'}]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{color: '#dcd2be'}]
    },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{color: '#ae9e90'}]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#93817c'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{color: '#a5b076'}]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#447530'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#f5f1e6'}]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{color: '#fdfcf8'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#f8c967'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#e9bc62'}]
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{color: '#e98d58'}]
    },
    {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [{color: '#db8555'}]
    },
    {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{color: '#806b63'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [{color: '#8f7d77'}]
    },
    {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#ebe3cd'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{color: '#dfd2ae'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{color: '#b9d3c2'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#92998d'}]
    }
  ],
  browns: [{"elementType":"geometry","stylers":[{"hue":"#ff4400"},{"saturation":-68},{"lightness":-4},{"gamma":0.72}]},{"featureType":"road","elementType":"labels.icon"},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"hue":"#0077ff"},{"gamma":3.1}]},{"featureType":"water","stylers":[{"hue":"#00ccff"},{"gamma":0.44},{"saturation":-33}]},{"featureType":"poi.park","stylers":[{"hue":"#44ff00"},{"saturation":-23}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"hue":"#007fff"},{"gamma":0.77},{"saturation":65},{"lightness":99}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"gamma":0.11},{"weight":5.6},{"saturation":99},{"hue":"#0091ff"},{"lightness":-86}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"lightness":-48},{"hue":"#ff5e00"},{"gamma":1.2},{"saturation":-23}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"saturation":-64},{"hue":"#ff9100"},{"lightness":16},{"gamma":0.47},{"weight":2.7}]}]
};
const pageButtons = document.querySelectorAll('ul.pager>li>a');
const pageCounters = document.querySelectorAll('.list-span');
const filterButton = document.querySelector('#filter');
const undoFilterButton = document.querySelector('#undo-filter');
const filterTextBox = document.querySelector('#trip-id');
const searchByIdTextBox = document.querySelector('#search-page-textbox');
const searchByIdButton = document.querySelector('#search-page');
const tableContent = document.querySelector('.table-content > table');
const mapDiv = document.querySelector('#map');
const follower = document.querySelector('#follower');
let mapLimits = mapDiv.getBoundingClientRect();
const followerLimits = follower.getBoundingClientRect();

const restoreButton = document.querySelector('#restore');
const clearButton = document.querySelector('#clear');
const centerSpan = document.querySelector('#map-center');

const radioButtonsForApiChoice = document.querySelectorAll('#prediction input[type=radio]')
const predictionSubmitButton = document.querySelector('#preddict-button');

class PanelLogic {
  constructor() {
    this.squareAnimationHTML = `
      <div class="loading-animation-container">
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
        <div class="square"></div>
      </div>`;
    this.errorHTML = `
      <div class="loading-animation-container">
        <p class="ubuntu">Error while displaying data. Or maybe no data registered.</p>
      </div>
    `;
    this.waitingAnimtionHTML = `
      <div class="loading-animation-container">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>`;
    this.formHTML = `
          <input type="adress" class="form-control control" placeholder="Enter address">
          <button class="btn btn-brown add-waypoint"><i class="fa fa-plus" aria-hidden="true"></i></button>
          <button class="btn btn-brown delete-waypoint"><i class="fa fa-eraser" aria-hidden="true"></i></button>`;
    this.parent = document.querySelector('.form-inline.row.routes');
    this.getDataBetweenDates = document.querySelector('#get-route-between-dates-btn');
    this.dateInputs = document.querySelectorAll('input[type=date]');
    this.displayButton = document.querySelector('#activate-route-panel');
    this.displayed = 1;
    this.displayRowsButton = document.querySelector('#activate-rows-list');
    this.displayedRows = 0;
    this.submitButton = document.querySelector('#submit-route-btn');
    this.dataDiv = document.querySelector('#received-data');
    this.route = [];
    this.updateProperties();
    this.displayLogic = {
      0: () => {
        this.displayButton.innerHTML = '<i class="fa fa-plus-square" aria-hidden="true"></i>';
        this.parent.parentNode.classList.add('hidden');
      },
      1: () => {
        this.displayButton.innerHTML = '<i class="fa fa-minus-square" aria-hidden="true"></i>';
        this.parent.parentNode.classList.remove('hidden');
      }
    }
    this.displayRowsLogic = {
      0: () => {
        this.displayRowsButton.innerHTML = '<i class="fa fa-plus-square" aria-hidden="true"></i>';
        document.querySelector('#rows-panel-body').classList.add('hidden');
      },
      1: () => {
        this.displayRowsButton.innerHTML = '<i class="fa fa-minus-square" aria-hidden="true"></i>';
        document.querySelector('#rows-panel-body').classList.remove('hidden');
      }
    }
    this.charts = document.querySelector('#charts');
    this.initialDatesInputsValues();
    this.chartAnchors = this.charts.querySelectorAll('a');
    this.addEvents();
  }
  
  updateProperties() {
    this.textBoxes = this.parent.querySelectorAll('input[type=adress]');
    this.addButtons = this.parent.querySelectorAll('.add-waypoint');
    this.removeButtons = this.parent.querySelectorAll('.delete-waypoint');
  }
  
  addEvents() {
    this.addButtons.forEach(btn => btn.addEventListener('click', addWaypointClick));
    this.removeButtons.forEach(btn => btn.addEventListener('click', deleteWaypointClick));
    this.submitButton.addEventListener('click', submitRoute);
    this.getDataBetweenDates.addEventListener('click', getDataBetweenDatesClick);
    this.displayButton.addEventListener('click', togglePanelBody);
    this.chartAnchors.forEach(btn => btn.addEventListener('click', chartButtonClick));
    this.displayRowsButton.addEventListener('click', toggleRowsPanelBody);
  }
  
  getRoute() {
    this.updateProperties();
    this.route = [];
    this.textBoxes.forEach(input => this.route.push(input.value));
    return this.route;
  }
  
  getDays() {
    return parseFloat(document.querySelector('#route-days-ago').value) || 0;
  }
  
  getTodayDateFormat() {
    const date = new Date();
    
    return [date.getFullYear(), (date.getMonth() + 1 < 10) ? `0${date.getMonth()  + 1}` : date.getMonth() + 1, date.getUTCDate()].join('-');
  }
  
  initialDatesInputsValues() {
    const date = this.getTodayDateFormat();
    
    this.dateInputs[0].value = '2017-05-16';
    this.dateInputs[1].value = '2017-05-23';
    //this.dateInputs.forEach(input => input.value = date);
  }
}

let routePanelLogic = new PanelLogic();

let pagination = {
  PAGE_SIZE: 5,
  currentPage: 1,
  minPage: 1,
  maxPage: null,
  size: null,
  trip_id: null,
  trip_data: {},
  normal_data: {}
};

let markers = [];
let map;

let mapEvents = {
  init: false,
  lastRouteRequest: null,
  lastFunction: null,
  trustedFunction: true,
  routeDistance: 0,
  chartData: null,
  chart: null,
  directionsService: null,
  directionsDisplay: null,
  tooltip: {
    timeout: null,
    timeoutTime: 5000,
    clearToolTip: (e) => {
      if (e)
        console.log({lat: e.latLng.lat(), lng: e.latLng.lng()})
      
      follower.classList.remove('visible');
    }
  },
  colors: ['#4a148c', '#2196f3', '#00bfa5', '#3e2723', '#212121', '#880e4f', '#1a237e', '#006064', '#ff4081', '#aa00ff', '#283593'],
  index: 0,
  polygonArray: [[]],
  linesArray: [[]],
  polygonPointsArray: [[]],
  latLng: [[]],
  polygons: [],
  mapSettings: {
    center: {lat: 46.770439, lng: 23.591423},
    zoom: 12,
    scrollwheel: true
  },
  getPointsInPolygon: (coords, callback) => {
    const polygon = coords;
    const XHR = new XMLHttpRequest();
    
    XHR.open('POST', '/api/entries/inpolygon', true);
    XHR.setRequestHeader('Content-type', 'application/json');
    XHR.onreadystatechange = () => {
      if (XHR.readyState === 4 && XHR.status === 200) {
        const response = JSON.parse(XHR.responseText);
        
        callback(null, response);
        return ;
      }
      
      callback(new Error('Error while retrieving data'));
    }
    XHR.send(JSON.stringify({polygon}));
  },
  getRouteData: (route, polygon, days, callback) => {
    const XHR = new XMLHttpRequest();
    
    XHR.open('POST', '/api/entries/routedata', true);
    XHR.setRequestHeader('Content-type', 'application/json');
    XHR.onreadystatechange = () => {
      if (XHR.readyState === 4 && XHR.status === 200) {
        const response = JSON.parse(XHR.responseText);
        
        callback(null, response);
        return ;
      }
      
      callback(new Error('Error while posting data'));
    }
    XHR.send(JSON.stringify({route, polygon, days}));
  },
  getRouteDataBetweenDates: (route, polygon, dates, callback) => {
    const XHR = new XMLHttpRequest();
    
    XHR.open('POST', '/api/entries/betweendates', true);
    XHR.setRequestHeader('Content-type', 'application/json');
    XHR.onreadystatechange = () => {
      if (XHR.readyState === 4 && XHR.status === 200) {
        const response = JSON.parse(XHR.responseText);
        
        callback(null, response, dates.start, dates.end);
        return ;
      }
    }
    XHR.send(JSON.stringify({route, polygon, dates}));
  }
};

let chartPagination = {
  MIN: 1,
  MAX: null,
  current: 1,
  dates: []
}

function Countdown() {
  this.setTimer = function (delay, times, updateFunction, callback) {
    this.times = times;
    this.delay = delay;
    this.interval = setInterval(updateFunction.bind(this), delay);

    const timeOutCallback= () => {
      callback();
      clearInterval(this.interval);
    };

    this.timeout = setTimeout(timeOutCallback.bind(this), (times + 1) * delay);
  };

  this.clearAll = () => {
    if (this.interval) 
      clearInterval(this.interval);
    if (this.timeout) 
      clearTimeout(this.timeout);
  }
}

function smoothScrollTo(start, end, total, delay) {
  const timer = new Countdown();
  const times = total / delay;

  const SCROLL_X = (end.x - start.x) / times;
  const SCROLL_Y = (end.y - start.y) / times;

  console.log(SCROLL_X, SCROLL_Y, times)

  const updateFunction = () => window.scrollBy(SCROLL_X, SCROLL_Y);
  const callback = () => window.scrollTo(end.x, end.y);

  timer.setTimer(delay, times, updateFunction, callback);
}

function debounce(func, wait = 20, immediate = true){
  let timeout;

  return function(){
    const context   = this;
    const args      = arguments;
    const later     = () => {
      timeout = null;
      
      if (!immediate)
        func.apply(context, args);
    }
    
    const callnow   = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callnow)
      func.apply(context, args);
  }
}

function chartButtonClick(e) {
  const current = parseInt(this.dataset.change) + chartPagination.current;
  
  if (current < chartPagination.MIN || current > chartPagination.MAX)
    return ;
    
  drawChartByDay(current);
  chartPagination.current = current;
}

function initCharts() {
  google.charts.load('current', {packages: ['corechart', 'line']});
}

function togglePanelBody(e) {
  let current = (routePanelLogic.displayed + 1) % 2;
  
  routePanelLogic.displayed = current;
  routePanelLogic.displayLogic[current]();
}

function toggleRowsPanelBody(e) {
  let current = (routePanelLogic.displayedRows + 1) % 2;
  
  routePanelLogic.displayedRows = current;
  routePanelLogic.displayRowsLogic[current]();
}

function prepareRouteSubmission() {
  let points = routePanelLogic.getRoute();
  
  if (points.length <= 1)
    return {error: true};
  
  const start = points.splice(0, 1)[0];
  const end = points.splice(points.length - 1, 1)[0];
  const waypoints = points.map(item => { return {location: item, stopover: false} }) || [];
  const days = routePanelLogic.getDays();
  const dates = {
    start: `${routePanelLogic.dateInputs[0].value} 00:00:00`,
    end: `${routePanelLogic.dateInputs[1].value} 23:59:59`
  };
  
  return {start, end, waypoints, days, dates}
}

function getDataBetweenDatesClick(e) {
  const params = prepareRouteSubmission();
  
  if (params.error)
    return;

  routePanelLogic.dataDiv.innerHTML = routePanelLogic.squareAnimationHTML;
  getRoute(params.start, params.end, params.dates, params.waypoints, true);
  mapEvents.lastFunction = 'getDataBetweenDatesClick';
}

function submitRoute(e) {
  const params = prepareRouteSubmission();
  
  if (params.error)
    return;

  routePanelLogic.dataDiv.innerHTML = routePanelLogic.squareAnimationHTML;
  getRoute(params.start, params.end, params.days, params.waypoints);
  mapEvents.lastFunction = 'submitRoute';
}

function addWaypointClick(e) {
  const nextElement = document.createElement('DIV');
  
  nextElement.className = 'form-group col-lg-4 col-xl-3 col-sm-6';
  nextElement.innerHTML = routePanelLogic.formHTML;
  
  routePanelLogic.parent.insertBefore(nextElement, this.parentNode.nextSibling);
  
  routePanelLogic.updateProperties();
  this.parentNode.nextSibling.querySelector('.add-waypoint').addEventListener('click', addWaypointClick);
  this.parentNode.nextSibling.querySelector('.delete-waypoint').addEventListener('click', deleteWaypointClick);
}

function deleteWaypointClick(e) {
  if (routePanelLogic.parent.childElementCount > 1)
    routePanelLogic.parent.removeChild(this.parentNode);
}

function getJSON(url, callback) {
  const ajax = new XMLHttpRequest();
  
  ajax.onreadystatechange = () => {
    if (ajax.readyState === 4 && ajax.status === 200) {
      callback(null, JSON.parse(ajax.responseText));
      return ;
    }
  }
  
  ajax.open('GET', url, true);
  ajax.send(null);
}

function initMap() {
  map = new google.maps.Map(mapDiv, mapEvents.mapSettings);
  
  mapEvents.init = true;
  map.setOptions({ styles: mapStyles.retro});
  addMapEvents(map);
  mapEvents.directionsService = new google.maps.DirectionsService();
  mapEvents.directionsDisplay =  new google.maps.DirectionsRenderer({
    draggable: true
  });
  mapEvents.directionsDisplay.setMap(map);
  mapEvents.directionsDisplay.addListener('directions_changed', () => {

    const changed = mapEvents.directionsDisplay.getDirections();
    const MAX  = { lat: changed.routes[0].bounds.f.f, lng: changed.routes[0].bounds.b.f};
    const MIN  = { lat: changed.routes[0].bounds.f.b, lng: changed.routes[0].bounds.b.b};
    const coords = `${MAX.lat} ${MIN.lng}, ${MAX.lat} ${MAX.lng}, ${MIN.lat} ${MAX.lng}, ${MIN.lat} ${MIN.lng}, ${MAX.lat} ${MIN.lng}`;
    const data = prepareRouteSubmission();
    
    if (mapEvents.trustedFunction === true) {
      mapEvents.trustedFunction = false;
      return ;
    }

    routePanelLogic.dataDiv.innerHTML = routePanelLogic.squareAnimationHTML;
    if (mapEvents.lastFunction === 'submitRoute')
      mapEvents.getRouteData({routePoints: changed.routes[0].overview_path, steps: changed.routes[0].legs[0].steps}, coords, data.days, printRouteData);
    else
      mapEvents.getRouteDataBetweenDates({routePoints: changed.routes[0].overview_path, steps: changed.routes[0].legs[0].steps}, coords, data.dates, drawCharts);
    
    console.log(changed);
    console.log(prepareRouteSubmission());
  });
  
  restoreMapToDefault();
}

function addMarker(coords) {
  const marker = new google.maps.Marker({
    position: coords,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 2,
      strokeColor: '#ff6f00',
      fillColor: '#e65100',
      fillOpacity: 1
    },
    map: map
  });
  markers.push(marker);
}

function setMarkers(markers, map) {
  markers.forEach(marker => {
    marker.setMap(map);
  });
}

function showMarkers() {
  setMarkers(markers, map);
}

function clearMarkers(markers) {
  setMarkers(markers, null);
  markers = [];
}

function populateTable(data) {
  while(tableContent.childElementCount > 1)
    tableContent.removeChild(tableContent.lastChild);
  data.forEach((row, index) => {
    tableContent.innerHTML += `
    <tr>
      <td><span class="responsive-table-label">Id: </span>${row.id + 1}</td>
      <td><span class="responsive-table-label">Car qnr: </span>${row.car_qnr}</td>
      <td><span class="responsive-table-label">Trip id: </span>${row.trip_id}</td>
      <td><span class="responsive-table-label">Speed: </span>${row.speed}</td>
      <td><span class="responsive-table-label">Rate: </span>${row.rate}</td>
      <td><span class="responsive-table-label">Latitude: </span>${row.lat}</td>
      <td><span class="responsive-table-label">Longitude: </span>${row.lon}</td>
      <td><span class="responsive-table-label">Timestamp: </span>${row.timestamp}</td>
    </tr>`;
  });
}

function initList(trip_id = null) {
  const url = trip_id === null ? `/api/entries/` : `/api/entries/trip/${trip_id}/`;
  
  if (trip_id) {
    clearMarkers(markers);
    getJSON(url, (error, data) => {
      if (error)
        return ;
        
      data.forEach((row, index) => {
        if (row.lon && row.lat)
          addMarker({lat: row.lat, lng: row.lon});
      });
      showMarkers(map);
    });
  }
  
  getJSON(url + 'size', (error, data) => {
    if (error)
      return ;
    
    pagination.currentPage = pagination.minPage;
    pagination.trip_id = trip_id;
    pagination.size = data.size;
    pagination.maxPage  = Math.ceil(data.size / pagination.PAGE_SIZE);
    pageCounters[1].innerHTML = pagination.maxPage;
    pageCounters[0].innerHTML = pagination.minPage;
    getPage(pagination.currentPage, trip_id);
  });
}

function getPage(page, trip_id = null) {
  const url = trip_id === null ? `/api/entries/page` : `/api/entries/trip/${trip_id}`;
  let usedData = null;
  
  if (page < pagination.minPage || page > pagination.maxPage)
    return ;
  
  if (trip_id) {
    if (pagination.trip_data.hasOwnProperty(trip_id)) {
      if (pagination.trip_data[trip_id][page])
        usedData = pagination.trip_data[trip_id][page];
    }
    else
      pagination.trip_data[trip_id] = {};
  }
  else {
    if (pagination.normal_data[page])
      usedData = pagination.normal_data[page];
  }
  
  if (usedData) {
    populateTable(usedData);
    pageCounters[0].innerHTML = pagination.currentPage = page;
    return ;
  }
  
  getJSON(url + `?limit=${pagination.PAGE_SIZE}&offset=${(page - 1) * pagination.PAGE_SIZE}`, (error, data) => {
    if (data !== undefined) {
      if (trip_id)
        pagination.trip_data[trip_id][page] = data;
      else
        pagination.normal_data[page] = data;
        
      populateTable(data);
      pageCounters[0].innerHTML = pagination.currentPage = page;
    }
  });
}

function pageButtonClick(e) {
  console.log(pagination.currentPage + parseInt(this.dataset.increment));
  getPage(pagination.currentPage + parseInt(this.dataset.increment), pagination.trip_id)
}

function mapDivMouseDown(e) {
  const clickLocationOnMap = {
    x: e.clientX - this.getBoundingClientRect().left,
    y: e.clientY - this.getBoundingClientRect().top
  }
  
  //if (e.which === 3)
    //console.log("Location:", clickLocationOnMap);
}

function markerMouseOver(e) {
  this.setIcon({
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6,
    strokeColor: '#00ff00',
    fillColor: '#ffffff',
    fillOpacity: 1
  });
}

function markerMouseOut(e) {
  this.setIcon({
    path: google.maps.SymbolPath.CIRCLE,
    scale: 4,
    strokeColor: '#00ff00',
    fillColor: '#ffffff',
    fillOpacity: 1
  });
}

function markerMouseDoubleClick(e) {
  clearMarkers(mapEvents.polygonArray[mapEvents.index]);
  clearMarkers(mapEvents.linesArray[mapEvents.index]);
  
  mapEvents.polygonArray[mapEvents.index] = [];
  mapEvents.polygonPointsArray[mapEvents.index] = [];
  mapEvents.linesArray[mapEvents.index] = [];
  mapEvents.latLng[mapEvents.index] = [];
  google.maps.event.clearInstanceListeners(this);
  this.setMap(null);
}

function markerMouseRightClick(e) {
  if (mapEvents.polygonPointsArray[mapEvents.index].length > 2) {
    const Ax = parseFloat(mapEvents.polygonPointsArray[mapEvents.index][mapEvents.polygonPointsArray[mapEvents.index].length - 1].split(' ')[0]);
    const Ay = parseFloat(mapEvents.polygonPointsArray[mapEvents.index][mapEvents.polygonPointsArray[mapEvents.index].length - 1].split(' ')[1]);
    const pointA = new google.maps.LatLng(Ax, Ay);
    const pointB = new google.maps.LatLng(this.position.lat(), this.position.lng());
    
    mapEvents.latLng[mapEvents.index].push(this.position);
    mapEvents.polygonPointsArray[mapEvents.index].push(`${this.position.lat()} ${this.position.lng()}`);
    drawLine([pointA, pointB], map);
  }
}

function polygonMoueOver(e) {
  this.setOptions({fillOpacity: 0.65});
  e.stop();
}

function polygonMoueOut(e) {
  this.setOptions({fillOpacity: 0.35});
  e.stop();
}

function polygonRightClick(e) {
  this.setMap(null);
  delete mapEvents.polygons[mapEvents.polygons.indexOf(this)];
  mapEvents.tooltip.clearToolTip();
  
  if (e)
    e.stop();
}

function polygonClick(e) {
  console.log(e)
  
  const position = {
    x: e.va.x + window.scrollX,
    y: e.va.y + window.scrollY - ((document.querySelector('.navbar-default').offsetHeight) || 0)
  };
  const wait = this.data ? mapEvents.tooltip.timeoutTime : 1000;
  
  if (e.va.x + followerLimits.width > mapLimits.right)
    position.x  = mapLimits.right - followerLimits.width;
  if (e.va.y + followerLimits.height > mapLimits.bottom)
    position.y = mapLimits.bottom - followerLimits.height;
  
  clearTimeout(mapEvents.tooltip.timeout);
  follower.querySelector('.progress').style.animation = '';
  follower.classList.remove('visible');
  follower.style.transform = `translate(${position.x}px, ${position.y}px)`;
  follower.classList.add('visible');
  
  follower.querySelector('.data').innerHTML = 
    (!this.data)
    ?  `<p class="text-center">'waiting for data'</p>` 
    : (this.data.length === 0)
      ? `<p class="text-center">No data found in this area</p>`
      :  `<p>Records:       <span>${this['data'][this['data'].length - 1].records}</span></p>` + 
        `<p>Cars number:   <span>${this['data'].length - 1}</span></p>` + 
        `<p>Trips number:  <span>${this['data'][this['data'].length - 1].trip_count}</span></p>` + 
        `<p>Highest speed: <span>${this['data'][this['data'].length - 1].speed_max}</span></p>` + 
        `<p>Average speed: <span>${this['data'][this['data'].length - 1].speed_avg}</span></p>` + 
        `<p>Average rate:  <span>${this['data'][this['data'].length - 1].rate_avg}</span></p>`;

  mapEvents.tooltip.timeout = setTimeout(() => {
    follower.classList.remove('visible');
  }, wait);
}

function createPolygon() {
  const coords = mapEvents.polygonPointsArray[mapEvents.index].join(', ');
  
  clearMarkers(mapEvents.polygonArray[mapEvents.index]);
  clearMarkers(mapEvents.linesArray[mapEvents.index]);
  
  mapEvents.polygonArray.push([]);
  mapEvents.polygonPointsArray.push([]);
  mapEvents.linesArray.push([]);
  mapEvents.latLng.push([]);
  
  const polygon = new google.maps.Polygon({
    paths: mapEvents.latLng[mapEvents.index],
    strokeColor: mapEvents.colors[mapEvents.index % mapEvents.colors.length],
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#e0e0e0',
    fillOpacity: 0.35
  });
  
  polygon.setMap(map);
  google.maps.event.addListener(polygon, 'mouseover', polygonMoueOver);
  google.maps.event.addListener(polygon, 'mouseout', polygonMoueOut);
  google.maps.event.addListener(polygon, 'rightclick', polygonRightClick);
  google.maps.event.addListener(polygon, 'click', polygonClick);
  mapEvents.polygons.push(polygon);
  mapEvents.index++;
  
  mapEvents.getPointsInPolygon(coords, (error, data) => {
    if (error) 
      return ;
    
    polygon['data'] = data;
  });
}

function clearAllPolygons() {
  mapEvents.polygons.forEach(polygon => polygonRightClick.bind(polygon)());
}

function drawLine(path, map) {
  const polyline = new google.maps.Polyline({
    path: path,
    strokeColor: "#00695c",
    strokeOpacity: 1.0,
    strokeWeight: 2.5,
    map: map
  });
  mapEvents.linesArray[mapEvents.index].push(polyline);

  if (mapEvents.polygonPointsArray[mapEvents.index].length > 2) {
    if (mapEvents.polygonPointsArray[mapEvents.index][0] === mapEvents.polygonPointsArray[mapEvents.index][mapEvents.polygonPointsArray[mapEvents.index].length - 1]) {
      createPolygon();
    }
  }
}

function restoreMapToDefault(e) {
  map.setCenter(mapEvents.mapSettings.center);
  map.setZoom(mapEvents.mapSettings.zoom);
}

function addMapEvents(map) {
  let timeout = null;
  
  mapDiv.addEventListener('mousedown', mapDivMouseDown);
  
  map.addListener('rightclick', (e) => {
    const marker = new google.maps.Marker({
      position: e.latLng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        strokeColor: '#00ff00',
        fillColor: '#ffffff',
        fillOpacity: 1
      },
      map: map
    });
    mapEvents.polygonArray[mapEvents.index].push(marker);
    
    if (mapEvents.polygonArray[mapEvents.index].length > 1) {
      const index = mapEvents.polygonArray.indexOf(marker) - 1;
      
      const Ax = parseFloat(mapEvents.polygonPointsArray[mapEvents.index][mapEvents.polygonPointsArray[mapEvents.index].length - 1].split(' ')[0]);
      const Ay = parseFloat(mapEvents.polygonPointsArray[mapEvents.index][mapEvents.polygonPointsArray[mapEvents.index].length - 1].split(' ')[1]);
      const pointA = new google.maps.LatLng(Ax, Ay);
      const pointB = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
      
      drawLine([pointA, pointB], map);
    }
    
    mapEvents.latLng[mapEvents.index].push(e.latLng);
    mapEvents.polygonPointsArray[mapEvents.index].push(`${e.latLng.lat()} ${e.latLng.lng()}`);
    
    google.maps.event.addListener(marker, 'mouseover', markerMouseOver);
    google.maps.event.addListener(marker, 'mouseout', markerMouseOut);
    google.maps.event.addListener(marker, 'dblclick', markerMouseDoubleClick);
    google.maps.event.addListener(marker, 'rightclick', markerMouseRightClick);
  });
  map.addListener('mousemove', (e) => {});
  map.addListener('drag', mapEvents.tooltip.clearToolTip);
  map.addListener('bounds_changed', mapEvents.tooltip.clearToolTip);
  map.addListener('center_changed', mapEvents.tooltip.clearToolTip);
  map.addListener('zoom_changed', mapEvents.tooltip.clearToolTip);
  map.addListener('click', mapEvents.tooltip.clearToolTip);
  map.addListener('center_changed', (e)  => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const center = map.getCenter();
      
      getJSON(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${center.lat()},${center.lng()}&sensor=true`, (error, data) =>{
        if (!error) {
          let address = data.results[0].formatted_address;
          
          if (address.split(' ')[0] === 'Unnamed')
            address = data.results[2].formatted_address;
            
          centerSpan.innerHTML = address;
          return ;
        }
      });

    }, 100);
    
  });
}

function printRouteData(error, result) {
  if (error || result.error) {
    routePanelLogic.dataDiv.innerHTML = routePanelLogic.errorHTML;
    return ;
  };
  
  document.querySelector('#p').classList.add('hidden');
  routePanelLogic.charts.classList.remove('display-charts');
  routePanelLogic.dataDiv.innerHTML = `
    <div class="col-lg-4 col-xl-3 col-sm-6 route-data">
      <p>Distance: <span>${result.distance}</span> km &nbsp <i class="fa fa-road" aria-hidden="true"></i></p>
    </div>
    <div class="col-lg-4 col-xl-3 col-sm-6 route-data">
      <p title="Number of cars from which data was colected">Cars: <span>${result.cars}</span>&nbsp<i class="fa fa-car" aria-hidden="true"></i></p>
    </div>

    <div class="col-lg-4 col-xl-3 col-sm-6 route-data">
      <p>Estimated time: <span>${result.time}</span> minutes&nbsp<i class="fa fa-clock-o" aria-hidden="true"></i></p>
    </div>
    <div class="col-lg-4 col-xl-3 col-sm-6 route-data">
      <p>Average speed: <span>${result.speed}</span> km/h  <i class="fa fa-bar-chart" aria-hidden="true"></i></p>`;
}      

function getRoute(start, end, days, waypoints, betweendates = false) {
  const request = {
    origin: start,
    waypoints: waypoints,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  };
  
  mapEvents.lastRouteRequest = request;
  mapEvents.directionsService.route(request, (response, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      const MAX = { lat: response.routes[0].bounds.f.f, lng: response.routes[0].bounds.b.f};
      const MIN = { lat: response.routes[0].bounds.f.b, lng: response.routes[0].bounds.b.b};
      let coords = '';
      
      mapEvents.trustedFunction = true;
      coords = `${MAX.lat} ${MIN.lng}, ${MAX.lat} ${MAX.lng}, ${MIN.lat} ${MAX.lng}, ${MIN.lat} ${MIN.lng}, ${MAX.lat} ${MIN.lng}`;
      mapEvents.directionsDisplay.setDirections(response);
      if (betweendates) {
        mapEvents.getRouteDataBetweenDates({routePoints: response.routes[0].overview_path, steps: response.routes[0].legs[0].steps}, coords, days, drawCharts);
      }
      else
        mapEvents.getRouteData({routePoints: response.routes[0].overview_path, steps: response.routes[0].legs[0].steps}, coords, days, printRouteData);
    }
    else
      routePanelLogic.dataDiv.innerHTML = routePanelLogic.errorHTML;
  });
}

function drawCharts(error, result, start, end) {
  console.log(JSON.stringify(result, null, 2));
  
  let data = new google.visualization.DataTable();
  let keys = Object.keys(result);
  let options = {
    hAxis: {
      title: 'Date',
    },
    vAxis: {
      title: 'Time',
      viewWindow: {
        min: 0
      }
    },
    backgroundColor: '#fff'
  };
  
  if (error || result.error !== null) {
    routePanelLogic.dataDiv.innerHTML = routePanelLogic.errorHTML;
    return ;
  }
  
  data.addColumn('string', 'date');
  data.addColumn('number', 'minutes '); // short for Time
  data['size'] = keys.length - 2;

  keys.splice(2, keys.length - 2).forEach(date => {
    data.addRow([date.substr(0, 5), result[date].overall.time]);
  });;
  
  if (data['size'] > 0) {
    chartPagination.MAX = data['size'];
    chartPagination.dates = Object.keys(result).splice(2, Object.keys(result).length - 2).sort();
  }
  
  document.querySelector('#p').classList.add('hidden');
  routePanelLogic.charts.classList.add('display-charts');
  routePanelLogic.charts.querySelector('span#km').innerHTML = `${result.distance}km`;
  mapEvents.chartData = result;
  routePanelLogic.dataDiv.innerHTML = '';
  
  drawChart(document.querySelector('#overall-chart'), data, options);
  drawChartByDay(1);
 // fetchWeatherApi(start, end, result, processDataForLearning);
}

function drawChartByDay(day) {
  const chart = new google.visualization.LineChart(document.querySelector('#day-by-day-chart'));
  const data = new google.visualization.DataTable();

  let options = {
    hAxis: {
      title: 'Day time'
    },
    vAxis: {
      title: 'Time',
      viewWindow: {
        min: 0
      }
    },
    backgroundColor: '#fff'
  };
  
  day--;
  data.addColumn('string', 'Day time');
  data.addColumn('number', 'minutes ');
  data.addRows([
    ['Morning', mapEvents.chartData[chartPagination.dates[day]].morning.time],
    ['Noon', mapEvents.chartData[chartPagination.dates[day]].noon.time],
    ['Evening', mapEvents.chartData[chartPagination.dates[day]].evening.time],
    ['Night', mapEvents.chartData[chartPagination.dates[day]].night.time]
  ]);
  routePanelLogic.charts.querySelector('span#time').innerHTML = `${chartPagination.dates[day]}`;
  chart.draw(data, options);
}

function drawChart(element, data, options) {
  const chart = new google.visualization.LineChart(element);
  chart.draw(data, options);
}

function resizeWindow(e = null) {
  const goldenNugget = (1 + Math.sqrt(5)) / 2;
  const rect = mapDiv.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  
  mapDiv.style.height = `${width / goldenNugget}px`
  mapLimits = mapDiv.getBoundingClientRect();;
}

function radiotButtonChange(e) {
  mapEvents['api'] = this.dataset.choice;
}

function fetchPredictionApi(url, data) {
  return new Promise((resolve, reject) => {
    const XHR = new XMLHttpRequest();
    const DATA = JSON.stringify(data);
    const KEY = '1ZaaNEQjoj8/CHcU/EdnHzYI7i8Uxzo5jJrfDntQHhvvKuEfAwEv+pTSJYkWhcXsQm3o3IIMSnDa0lUj/Im4Gw==';
    
    
    if (!url) return reject(new Error('Empty url.'));
    
    XHR.open('POST', url, true);
    
    XHR.setRequestHeader('Authorization', `Bearer ${KEY}`);
    XHR.setRequestHeader('Content-type', 'application/json');
    XHR.setRequestHeader('Accept', 'application/json');
    
    XHR.onreadystatechange = () => {
      if (XHR.readyState === 4 && XHR.status === 200) {
        const response = JSON.parse(XHR.responseText);
        
        return resolve(response);
      }
    };
    XHR.send();
  });
}

function limits(low, high) {
  this.low = low;
  this.high = high;
  
  this.checkLimit = (value) => {
    const _value = parseFloat(value);
    
    return (value >= this.low && value <= this.high);
  }
}

function preddictButton(e) {
  if (!mapEvents.api) {
    alert('Please select a traffic location to be analised');
    return ;  
  }

  routePanelLogic.dataDiv.innerHTML = routePanelLogic.squareAnimationHTML;
  routePanelLogic.charts.classList.remove('display-charts');
  
  fetch(`${window.location.origin}/api/entries/learn/${mapEvents.api}`)
    .then(response => {
      return response.json();
    })
    .then(response => {
      const data = new google.visualization.DataTable();
      const options = {
        hAxis: {
          title: 'Hour',
        },
        vAxis: {
          title: 'Speed',
          viewWindow: {
            min: 0
          }
        },
        backgroundColor: '#fff'
      };
      
      data.addColumn('number', 'Hour');
      data.addColumn('number', 'Speed ');
      data['size'] =  response.Results.output1.value.Values.length;
      
      response.Results.output1.value.Values.forEach((item, index) => {
        data.addRow([index, parseInt(item[item.length - 2].substr(0, 4))]);
      });;
      
      routePanelLogic.dataDiv.innerHTML = '';
      
      document.querySelector('#p').classList.remove('hidden');
      drawChart(document.querySelector('#prediction-chart'), data, options);
    })
    .catch(error => {
      console.error(error);
      routePanelLogic.dataDiv.innerHTML = routePanelLogic.errorHTML
    });
}



/*
function processDataForLearning(error, weather, traffic, callback) {
  if (error) {
    console.log(error);
    return ;
  }
  
  const objectKeys = Object.keys(traffic);
  const units = new Units();
  const KEY = 'e6c45ad7e2a1491f9be95818170904';
  const NO_DAYS = 7;
  
  const url = `http://api.worldweatheronline.com/premium/v1/weather.ashx?` + 
              `key=${KEY}&q=Cluj-Napoca&format=json&num_of_days=${NO_DAYS}&tp=6`;
  
  const input = [[], [], [], []];
  const output = [[], [], [], []];
  
  let index = 0;
  let day = 0;
  
  objectKeys.splice(0, 2);
  
  console.log(objectKeys, weather);
  
  objectKeys.forEach(key => {
    index = 0;
    
    ['morning', 'noon', 'evening', 'night'].forEach(dayPart => {
      if (traffic[key][dayPart].valid) {
        const current = weather.data.weather[day].hourly[index];
        
        output[index].push(Math.round(traffic[key][dayPart].speed));
        
        const arr = [
          units.temperature.checkLimit(current[units.aliases.temperature]),
          units.windspeed.checkLimit(current[units.aliases.windspeed]),
          units.pp.checkLimit(current[units.aliases.pp]),
          
          units.visibility.checkLimit(current[units.aliases.visibility]),
          units.pressure.checkLimit(current[units.aliases.pressure]),
          units.clouds.checkLimit(current[units.aliases.clouds]),
          
          units.snow.checkLimit(weather.data.weather[day][units.aliases.snow]),
          
          0, 0, 0, 0
        ];
        
        arr[11 - 4 + index] = 1;
        console.log(arr);
        input[index].push(arr);
      }
      else {
        output[index].push(null);
        input[index].push(null);
      }
      
      index++;
    });
    
    day++;
  });
  
  getJSON(url, (error, data) => {
    if (!error) {
      const tests = [[], [], [], []];
      
      for (index = 0; index < NO_DAYS; index++) {
        
        for (let j = 0; j < 4; j++) {
          const current = data.data.weather[day].hourly[j];
          
          const arr = [
            units.temperature.checkLimit(current[units.aliases.temperature]),
            units.windspeed.checkLimit(current[units.aliases.windspeed]),
            units.pp.checkLimit(current[units.aliases.pp]),
            
            units.visibility.checkLimit(current[units.aliases.visibility]),
            units.pressure.checkLimit(current[units.aliases.pressure]),
            units.clouds.checkLimit(current[units.aliases.clouds]),
            
            units.snow.checkLimit(data.data.weather[day][units.aliases.snow]),
            
            0, 0, 0, 0
          ];
          
          arr[11 - 4 + j] = 1;
          tests[j].push(arr);
          
        }
      }
      console.log(tests);
      callback(null, input, output, tests, printLearningData);
      return ;
    }
    
    callback(error);
  });
}

function printLearningData(error, data) {
  console.log(data);
}

function orderLearningData(error, input, output, tests, callback) {
  if (error)
    return ;
  
  const trainingSet = [];
  
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] !== null)
        trainingSet.push({
          input: input[i][j],
          output: output[i][j]
        });
    }
  }
  
  console.log(JSON.stringify(trainingSet));
  const XHR = new XMLHttpRequest();
    
  XHR.open('POST', '/api/entries/learn', true);
  XHR.setRequestHeader('Content-type', 'application/json');
  XHR.onreadystatechange = () => {
    if (XHR.readyState === 4 && XHR.status === 200) {
      const response = JSON.parse(XHR.responseText);
      
      callback(null, response);
      return ;
    }
  };
  
  XHR.send(JSON.stringify({trainingSet, tests}));
}

function Units() {
  this.temperature = new limits(5, 25); // °C
  this.windspeed = new limits(0, 5); // km / h
  this.pp = new limits(0, 5); // mm
  this.visibility = new limits(0.25, 10);
  this.pressure = new limits(1010, 1020); // milibars 1014 mb ~ 760 mmcolHg
  this.clouds = new limits(0, 50); // cloud coverage percentage
  this.snow = new limits(0, 0.1); // cm
  
  this.aliases= {
    temperature: 'tempC',
    visibility : 'visibikity',
    pp         : 'precipMM',
    pressure   : 'pressure',
    clouds     : 'cloudcover',
    windspeed  : 'windspeedKmph',
    snow       : 'totalSnow_cm'
  };
}

function fetchWeatherApi(start = '2016-11-05', end = '2016-11-08', result, callback) {
  const KEY    = 'e6c45ad7e2a1491f9be95818170904';
  const TP     = 6;
  const CITY   = 'Cluj-Napoca';
  const FORMAT = 'json';
  
  const url = `http://api.worldweatheronline.com/premium/v1/past-weather.ashx?` + 
              `key=${KEY}&q=${CITY}&format=${FORMAT}&date=${start}&enddate=${end}&tp=${TP}`;

  getJSON(url, (error, data) => {
    if (!error) {
      callback(null, data, result, orderLearningData);
      return ;
    }
    
    callback(new Error('error while getting past weather data'));
  });
  
}
*/

(function _init() {
  filterButton.addEventListener('click', (e) => {
    if (parseInt(filterTextBox.value) !== pagination.trip_id && parseInt(filterTextBox.value))
      initList(parseInt(filterTextBox.value));
    
    e.preventDefault();
  });
  
  undoFilterButton.addEventListener('click', (e) => {
  if (pagination.trip_id !== null) {
    clearMarkers(markers);
    initList();
  }
  });
  
  pageButtons.forEach(button => button.addEventListener('click', pageButtonClick));
  
  searchByIdButton.addEventListener('click', (e) => {
    const page = parseInt(searchByIdTextBox.value);
    
    if (page)
      getPage(page, pagination.trip_id);
  });
  
  restoreButton.addEventListener('click', restoreMapToDefault);
  
  clearButton.addEventListener('click',clearAllPolygons);
  
  resizeWindow();
  
  window.addEventListener('resize', debounce(resizeWindow, 10, true));
  
  radioButtonsForApiChoice.forEach(i => i.addEventListener('change', radiotButtonChange));
  predictionSubmitButton.addEventListener('click', preddictButton);

  initList();
  initCharts();
})();


/*

getJSON('http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=e6c45ad7e2a1491f9be95818170904&q=Cluj-Napoca&format=json&date=2016-11-05&enddate=2016-11-30&tp=1', (error ,response) => {
    const hourly = [];
    
    console.log(response.data.weather.length)
    response.data.weather.forEach(day => {
      console.log('*', day.hourly.length);
      day.hourly.forEach(part => {
        console.log('h')
        let dayObject = {};
        
        if (part.time.length === 3)
          part.time = `0${part.time}`;
        else if (part.time.length === 1)
          part.time = `000${part.time}`;
        
        
        dayObject = {
          date: `${day.date} ${part.time.substr(0, 2)}:${part.time.substr(2, 2)}`,
          maxtempC: day.maxtempC,
          mintempC: day.mintempC,
          totalSnow_cm: day.totalSnow_cm,
          sunHour: day.sunHour,
          time: part.time,
          tempC: part.tempC,
          windspeedKmph: part.windspeedKmph,
          weatherCode: part.weatherCode,
          precipMM: part.precipMM,
          humidity: part.humidity,
          visibility: part.visibility,
          pressure: part.pressure,
          cloudcover: part.cloudcover,
          HeatIndexC: part.HeatIndexC
        };
        hourly.push(dayObject);
      });
    });
    
    console.log(hourly);
});
*/