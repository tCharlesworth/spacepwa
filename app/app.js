(function() {
  'use strict';

  var app = {
    isLoading: true,
    container: document.querySelector('.container'),
    rocketTemplate: document.querySelector('.rocketTemplate'),
    launchpadTemplate: document.querySelector('.launchpadTemplate')
  };


  /// Event Listeners

  document.getElementById('btnMenu').addEventListener('click', function(e) {
    e.preventDefault();
    $('#modal1').modal('open');
  });
  document.getElementById('btnRockets').addEventListener('click', function(e) {
    e.preventDefault();
    app.search("rockets");
  });
  document.getElementById('btnLaunchpads').addEventListener('click', function(e) {
    e.preventDefault();
    app.search("launchpads");
  });

  /// UI Methods

  app.addRocket = function(data) {
    var name = data.name;
    var cost = `Cost Per Launch: $${data.cost_per_launch}`;
    var firstflight = `First Flight: ${data.first_flight}`;
    var weight = `Weight: ${data.mass.lb} lbs`
    var success = `Success Rate: ${data.success_rate_pct}%`

    var card = app.rocketTemplate.cloneNode(true);
    card.querySelector('.rocket-name').textContent = name;
    card.querySelector('.rocket-image').src = `./images/rocket/${name}.jpg`
    card.querySelector('.rocket-cost').textContent = cost;
    card.querySelector('.rocket-firstflight').textContent = firstflight;
    card.querySelector('.rocket-success').textContent = success;
    card.querySelector('.rocket-weight').textContent = weight;

    app.container.appendChild(card);
  }

  app.addLaunchpad = function(data) {
    var title = data.id;
    var name = data.full_name;
    var status = `Status: ${data.status}`;
    var location = `Location: ${data.location.name}, ${data.location.region}`;
    var details = data.details;

    var card = app.launchpadTemplate.cloneNode(true);

    card.querySelector('.card-title').textContent = title;
    card.querySelector('.launchpad-image').src = `./images/launchpad/${title}.jpg`
    card.querySelector('.launchpad-name').textContent = name;
    card.querySelector('.launchpad-status').textContent = status;
    card.querySelector('.launchpad-location').textContent = location;
    card.querySelector('.launchpad-details').textContent = details;

    app.container.appendChild(card);
  }

  app.removeCards = function() {
    while(app.container.firstChild) {
      app.container.removeChild(app.container.firstChild);
    }
  }

  /// Application Methods
  app.search = function (searchTerm) {
    console.log(`searching::${searchTerm}`);
    var url = `https://api.spacexdata.com/v2/${searchTerm}`;
    // cache logic

    // feth logic
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);

          app.removeCards();

          switch(searchTerm) {
            case "rockets":
              app.loadRockets(response);
              break;
            case "launchpads":
              app.loadLaunchpads(response);
              break;
            default:
            console.log(`Invalid term::${searchTerm}`)
              break
          }
        }
      }
    }

    request.open('GET', url);
    request.send();
  }

  app.loadRockets = function(data) {
    console.log('loading rockets');
    var idx = 0;
    var a = data[idx];
    while(a) {
      app.addRocket(a);
      idx++;
      a = data[idx];
    }
  };

  app.loadLaunchpads = function(data) {
    console.log('loading launchpads', data);
    var idx = 0;
    var a = data[idx];
    while(a) {
      app.addLaunchpad(a);
      idx++;
      a = data[idx];
    }
  };
})()

$(document).ready(function(){
  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});


/// Service Workers
if('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./app/service-worker.js')
    .then(function() {console.log(`Service Worker Registered`)});
}