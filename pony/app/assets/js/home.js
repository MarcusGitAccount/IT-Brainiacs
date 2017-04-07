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
}
const pageButtons = document.querySelectorAll('ul.pager>li>a');
const pageCounters = document.querySelectorAll('.list-span');
const filterButton = document.querySelector('#filter');
const undoFilterButton = document.querySelector('#undo-filter');
const filterTextBox = document.querySelector('#trip-id')
const searchByIdTextBox = document.querySelector('#search-page-textbox');
const searchByIdButton = document.querySelector('#search-page');
const tableContent = document.querySelector('.table-content > table');
const mapDiv = document.querySelector('#map');
const follower = document.querySelector('#follower');
const mapLimits = document.querySelector('#map').getBoundingClientRect();
const followerLimits = follower.getBoundingClientRect();

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
        <p class="ubuntu">Error while dislaying data. Or maybe no data registered.</p>
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
    
    this.dateInputs[0].value = '2016-11-05';
    this.dateInputs[1].value = '2016-11-08';
    //this.dateInputs.forEach(input => input.value = date);
  }
}

let routePanelLogic = new PanelLogic();

let pagination = {
  PAGE_SIZE: 25,
  currentPage: 1,
  minPage: 1,
  maxPage: null,
  size: null,
  trip_id: null
}

let markers = [];
let map;

let mapEvents = {
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
    clearToolTip: () => {
      follower.classList.remove('visible');
    }
  },
  colors: ['#4a148c', '#2196f3', '#00bfa5', '#3e2723', '#212121', '#880e4f', '#1a237e', '#006064'],
  index: 0,
  polygonArray: [[]],
  linesArray: [[]],
  polygonPointsArray: [[]],
  latLng: [[]],
  polygons: [],
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
        
        callback(null, response);
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

function chartButtonClick(e) {
  const current = parseInt(this.dataset.change) + chartPagination.current;
  
  if (current < chartPagination.MIN || current > chartPagination.MAX)
    return ;
    
  drawChartByDay(current);
  chartPagination.current = current;
}

function initCharts() {
  google.charts.load('current', {packages: ['corechart', 'line']});
  //google.charts.setOnLoadCallback(drawBackgroundColor);
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
    callback(new Error('Error while trying to get data from url'));
  }

  ajax.open('GET', url, true);
  ajax.send(null);
}

function initMap() {
  map = new google.maps.Map(document.querySelector('#map'), {
    center: {lat: 46.770439, lng: 23.591423},
    zoom: 12,
    scrollwheel: false
  });

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
    tableContent.innerHTML += `<tr><td>${row.id + 1}</td><td>${row.car_qnr}</td><td>${row.trip_id}</td><td>${row.speed}</td><td>${row.rate}</td><td>${row.lat}</td><td>${row.lon}</td><td>${row.timestamp}</td></tr>`;
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
  
  if (page < pagination.minPage || page > pagination.maxPage) {
    return ;
  }
    
  getJSON(url + `?limit=${pagination.PAGE_SIZE}&offset=${(page - 1) * pagination.PAGE_SIZE}`, (error, data) => {
    if (data !== undefined) {
      //document.querySelector('pre').innerHTML = JSON.stringify(data, null, 2);
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
  e.stop();
}

function polygonClick(e) {
  const position = {
    x: e.ya.x + window.scrollX,
    y: e.ya.y + window.scrollY
  }
  const wait = this.data ? mapEvents.tooltip.timeoutTime : 1000;
  
  if (e.ya.x + followerLimits.width > mapLimits.right)
    position.x  = mapLimits.right - followerLimits.width;
  if (e.ya.y + followerLimits.height > mapLimits.bottom)
    position.y = mapLimits.bottom - followerLimits.height;
  
  clearTimeout(mapEvents.tooltip.timeout);
  follower.querySelector('.progress').style.animation = '';
  follower.classList.remove('visible');
  follower.style.transform = `translate(${position.x}px, ${position.y}px)`;
  follower.classList.add('visible');
  follower.querySelector('.data').innerHTML = this['data'] === undefined ? 
    `<p>'waiting for data'</p>` : 
    `<p>Records:       <span>${this['data'][this['data'].length - 1].records}</span></p>` + 
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

function addMapEvents(map) {
  
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
  map.addListener('mousemove', (e) => {

  });
  map.addListener('drag', mapEvents.tooltip.clearToolTip);
  map.addListener('bounds_changed', mapEvents.tooltip.clearToolTip);
  map.addListener('center_changed', mapEvents.tooltip.clearToolTip);
  map.addListener('zoom_changed', mapEvents.tooltip.clearToolTip);
  map.addListener('click', mapEvents.tooltip.clearToolTip);
}

function printRouteData(error, result) {
  if (error || result.error) {
    routePanelLogic.dataDiv.innerHTML = routePanelLogic.errorHTML;
    return ;
  };
  
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

function drawCharts(error, result) {
  console.log(JSON.stringify(result, null, 2));
  
  let data = new google.visualization.DataTable();
  let keys = Object.keys(result);
  let options = {
    hAxis: {
      title: 'Date'
    },
    vAxis: {
      title: 'Time'
    },
    backgroundColor: '#fff'
  };
  
  if (error || result.error !== null) {
    routePanelLogic.dataDiv.innerHTML = routePanelLogic.errorHTML;
    return ;
  }
  
  data.addColumn('string', 'Date');
  data.addColumn('number', 'Time');
  data['size'] = keys.length - 2;

  keys.splice(2, keys.length - 2).forEach(date => {
    data.addRow([date.substr(0, 5), result[date].overall.time]);
  });;
  
  if (data['size'] > 0) {
    chartPagination.MAX = data['size'];
    chartPagination.dates = Object.keys(result).splice(2, Object.keys(result).length - 2).sort();
  }
  
  routePanelLogic.charts.classList.add('display-charts');
  routePanelLogic.charts.querySelector('span#km').innerHTML = `${result.distance}km`;
  mapEvents.chartData = result;
  routePanelLogic.dataDiv.innerHTML = '';
  
  drawChart(document.querySelector('#overall-chart'), data, options);
  drawChartByDay(1);
}

function drawChartByDay(day) {
  const chart = new google.visualization.LineChart(document.querySelector('#day-by-day-chart'));
  let data = new google.visualization.DataTable();

  let options = {
    hAxis: {
      title: 'Day time'
    },
    vAxis: {
      title: 'Time'
    },
    backgroundColor: '#fff'
  };
  
  day--;
  data.addColumn('string', 'Day time');
  data.addColumn('number', 'Time');
  data.addRows([
    ['morning', mapEvents.chartData[chartPagination.dates[day]].morning.time],
    ['noon', mapEvents.chartData[chartPagination.dates[day]].noon.time],
    ['evening', mapEvents.chartData[chartPagination.dates[day]].evening.time],
    ['night', mapEvents.chartData[chartPagination.dates[day]].night.time]
  ]);
  routePanelLogic.charts.querySelector('span#time').innerHTML = `${chartPagination.dates[day]}`;

  chart.draw(data, options);
}

function drawChart(element, data, options) {
  const chart = new google.visualization.LineChart(element);
  chart.draw(data, options);
}

filterButton.addEventListener('click', (e) => {
  if (parseInt(filterTextBox.value) !== pagination.trip_id && parseInt(filterTextBox.value))
    initList(parseInt(filterTextBox.value));
  
  e.preventDefault()
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

initList();
initCharts();