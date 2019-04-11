var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function chooseColor(mag) {
    switch (true) {
    case (mag < 1):
      return "#35ef02";
    case (1 <= mag && mag < 2):
      return "#cdf44e";
    case (2 <= mag && mag < 3):
      return "#fcd664";
    case (3 <= mag && mag < 4):
      return "#f49733";
    case (4 <= mag && mag < 5):
      return "#ff862a";
    default:
      return "#c6310f";
    }
  }
  

d3.json(queryUrl,function(data){
    createFeatures(data)
})

function createFeatures(earthquakeData) {
console.log(earthquakeData.features[1].properties)
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p> Magnitude: " + feature.properties.mag + "<br>" + 
        new Date(feature.properties.time) + "</p>");
    }
    function pointToLayer(feature, latlng){
    var geojsonMarkerOptions = {
        radius: feature.properties.mag*2,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    return L.circleMarker(latlng, geojsonMarkerOptions);
}

    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer,
      style: function(feature) {
        return {
          color: chooseColor(feature.properties.mag),
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity: 1,
          weight: 1.5
        };
        
    }});
  
    createMap(earthquakes);
  }

function createMap(equakes){
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
      });

    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
  });
  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
});
  var tech_plates_json = "PB2002_boundaries.json"
   d3.json(tech_plates_json,function(data){
    var tech_plates = L.geoJSON(data, {
      // onEachFeature: onEachFeature
      style: {color: "orange", weight:.9}
   
  })

  
    var baseMaps = {
        "Satellite": satellitemap,
        "Outdoors": streetmap,
        "Grayscale": grayscalemap
      };


    var overlayMaps = {
      Plates: tech_plates,
      Earthquakes: equakes
        
      };

    var myMap = L.map("map", {
        center: [
          37.09, -95.71
        ],
        zoom: 2,
        layers: [satellitemap, tech_plates, equakes]
      });
  
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);



// var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     var legendInfo = "<h1>Earthquake Magnitude</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"fillColor: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   legend.addTo(myMap);
})
}

