var mapApi = function(){
	var google_key = "AIzaSyBnUmi3a6rWgsRGyAfM4estxUjOduKBJMc";	
	var map;
	var markers = [];
	var service;
	var currentCoords = {};

	var displayLocation = function(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		currentCoords.latitude = latitude;
		currentCoords.longitude = longitude;
		var element = document.getElementById("container");
		if(element){
			element.innerHTML = "<b>Latitude: </b>" + latitude + ', <b>Longitude: </b>' + longitude;
		}

		showMaps(position.coords);
	};

	var handleError = function(error){
		console.log(error);
	}

	var showMaps = function(coords){
		var googleLatLang = new google.maps.LatLng(coords.latitude,coords.longitude);

		var mapOptions = {
			zoom : 11,
			center: googleLatLang
			//,mapTypeId: google.maps.MapTypeId.HYBRID
		};

		var mapDiv = document.getElementById("map");

		map = new google.maps.Map(mapDiv,mapOptions);

		service = new google.maps.places.PlacesService(map);

		google.maps.event.addListener(map,"click",function(event){
			var latitude = event.latLng.lat();
			var longitude = event.latLng.lng();
			currentCoords.latitude = latitude,
			currentCoords.longitude = longitude;
			var element = document.getElementById("container");
			if(element){
				element.innerHTML = "<b>Latitude: </b>" + latitude + ', <b>Longitude: </b>' + longitude;
			}
			map.panTo(event.latLng);

			createMarker(event.latLng);
		});
	};

	var createMarker = function(place){
		var markerOptions = {
			position: place.geometry.location,
			map: map,
			clickable: true
		};

		var marker = new google.maps.Marker(markerOptions);
		markers.push(marker);
	}

	var clearMarkers = function(){
		markers.forEach(function(marker){
			marker.setMap(null);
		});

		markers = [];
	}

	var search = function(){
		$('#btnSearch').click(function(e){
			e.preventDefault();
			clearMarkers();
			makePlacesRequest(currentCoords.latitude,currentCoords.longitude);
			console.log('search queried');
		})
	}

	var makePlacesRequest = function(lat,lng){
		var query = $('#query').val();
		if(query){
			var placesRequest = {
				location: new google.maps.LatLng(lat,lng),
				radius: 10000,
				keyword: query
			};

			service.nearbySearch(placesRequest,function(results,status){
				if(status == google.maps.places.PlacesServiceStatus.OK){
					results.forEach(function(place){
						//console.log(place);
						createMarker(place);
					});
				}
			});

		}else{
			console.log("No query entered for places search");
		}
	}

	var init = function(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(displayLocation,handleError);
		}else{
			console.log("Sorry, this browser doesn't support geolocation");
		}
		search();

	};

	return {
		init : init
	}
}();










