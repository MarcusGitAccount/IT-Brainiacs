
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
  tooltip: {
    timeout: null,
    timeoutTime: 5000,
      clearToolTip: () => {
      follower.classList.remove('visible');
    }
  },
  colors: ['#4a148c ', '#2196f3', '#00bfa5 ', '#3e2723', '#212121', '#880e4f', '#1a237e', '#006064'],
  index: 0,
  polygonArray: [[]],
  linesArray: [[]],
  polygonPointsArray: [[]],
  latLng: [[]],
  polygons: [],
  getPointsInPolygon:(coords, callback) => {
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
  }
};

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
  mapEvents.polygonArray[mapEvents.index].splice(mapEvents.polygonArray[mapEvents.index].indexOf(this), 1);
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
    x: e.ya.x,
    y: e.ya.y
  }
  
  if (e.ya.x + followerLimits.width > mapLimits.right)
    position.x  = mapLimits.right - followerLimits.width;
  if (e.ya.y + followerLimits.height > mapLimits.bottom)
    position.y = mapLimits.bottom - followerLimits.height;
  
  clearTimeout(mapEvents.tooltip.timeout);
  follower.style.transform = `translate(${position.x}px, ${position.y}px)`;
  follower.classList.add('visible');
  follower.innerHTML =  this['data'] === undefined ? `<p>'waiting for data'</p>` : `<p>${this['data'].records} records</p>`;
  mapEvents.tooltip.timeout = setTimeout(() => {
    follower.classList.remove('visible');
  }, mapEvents.tooltip.timeoutTime);
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
      
      polygon['data'] = {
        records: data.length || 0
      }
    });
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