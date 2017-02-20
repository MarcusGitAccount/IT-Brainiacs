
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

  map.setOptions({ styles: mapStyles.browns})
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

function setMarkers(map) {
  markers.forEach(marker => {
    marker.setMap(map);
  });
}

function showMarkers() {
  setMarkers(map);
}

function clearMarkers() {
  setMarkers(null);
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
    clearMarkers();
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


filterButton.addEventListener('click', (e) => {
  if (parseInt(filterTextBox.value) !== pagination.trip_id && parseInt(filterTextBox.value))
    initList(parseInt(filterTextBox.value));
  
  e.preventDefault()
});

undoFilterButton.addEventListener('click', (e) => {
  if (pagination.trip_id !== null) {
    clearMarkers();
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