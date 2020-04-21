$(function () {
    function getOZInfo(place) {
        map.flyTo(place, 18);
        var query_OZ = L.esri.query({
            url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PAOpportunityZones/FeatureServer/0'
        });
        query_OZ.intersects(place);
        query_OZ.run(function (error, featureCollection, response){
            if (featureCollection.features.length == 0){
                document.getElementById("OZAnswer").innerHTML = "Not in an Opportunity Zone :("
            }
            else {
                document.getElementById("OZAnswer").innerHTML = "Opportunity Zone!!! :)";
            }
        })
        
        }
    
    function chooseAddr(lat1, lng1) {
        if (typeof (new_event_marker) === 'undefined') {
            new_event_marker = new L.marker([lat1, lng1], { draggable: true });
            new_event_marker.addTo(map);
        }
        else {
            new_event_marker.setLatLng([lat1, lng1]);
        }
        map.setView([lat1, lng1], 18);
        var coordinates = new L.LatLng(lat1, lng1);
        getOZInfo(coordinates)
    }
    
    function myFunction(arr) {
        var out = "<br />";
        var i;
        if (arr.length > 0) {
            for (i = 0; i < arr.length; i++) {
                out += "<div class='address' title='Show Location and Coordinates' onclick='chooseAddr(" + arr[i].lat + ", " + arr[i].lon + ");return false;'>" + arr[i].display_name + "</div>";
                var coordinates = new L.LatLng(arr[i].lat, arr[i].lon);
                ///getZoningInfo(coordinates)
                chooseAddr(arr[i].lat, arr[i].lon);
            }
            document.getElementById('results').innerHTML = "";
        }
        else {
            document.getElementById('results').innerHTML = "Sorry, no results...";
        }
    }
    
    function addr_search() {
        $(".HideUnhide").show();
        $("#PrintBtn").show();
        const gatekeeperKey = "ad1c7f7c6895cd11c1bec0b53f1e1bab";
        const addressInput = document.getElementById("addr");
        const requestUrl = `https://api.phila.gov/ais/v1/search/${addressInput.value}?gatekeeperKey=${gatekeeperKey}`;
        $.get(requestUrl, function (result) {
            if (result.features.length > 0) {
                const coordinates = new L.LatLng(result.features[0].geometry.coordinates[1], result.features[0].geometry.coordinates[0]);
                if (typeof (new_event_marker) === 'undefined') {
                    new_event_marker = new L.marker(coordinates, { draggable: true });
                    new_event_marker.addTo(map);
                }
                else {
                    new_event_marker.setLatLng(coordinates);
                }
                getOZInfo(coordinates);
            }
        });
    }
    var map = L.map('map', {zoomControl: false}).setView([40.0, -75.125], 11);
    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);
    L.esri.tiledMapLayer({
        url: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer',
    }).addTo(map);
    
    L.esri.tiledMapLayer({
        url: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer',
    }).addTo(map);
    map.invalidateSize();

    L.esri.featureLayer({
        url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PAOpportunityZones/FeatureServer/0',
        weight: 1,
        fillOpacity: 0.4,
        //minZoom: 15
    }).addTo(map);



    map.on('click', function (e) {
        $(".HideUnhide").show();
        $("#PrintBtn").show();
        document.getElementById("addr").value = "";
        if (typeof (new_event_marker) === 'undefined') {
            new_event_marker = new L.marker(e.latlng, { draggable: true });
            new_event_marker.addTo(map);
        }
        else {
            new_event_marker.setLatLng(e.latlng);
        }
        lats = e.latlng.lat;
        lons = e.latlng.lng;
        coordinates = L.latLng(lats, lons);
        getOZInfo(coordinates);      
    });
    
    map.on('moveend', function () {
        map.invalidateSize();
    });
    
    document.getElementById("btnSearch").addEventListener("click", addr_search);
});
