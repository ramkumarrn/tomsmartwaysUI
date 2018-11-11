import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { IncidentModalPage } from '../incident-modal/incident-modal';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { MapServiceProvider } from '../../providers/map-service/map-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  map: any;
  _marker: any;
  currentLoc: any = {};

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    private locService: LocationServiceProvider, private mapService: MapServiceProvider,
    private toastCtrl: ToastController) {

  }
  ngOnInit() {

  }
  ionViewDidEnter() {
    this.showMap();
    this.getIncidents();
  }

  showMap() {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
    this.map = tomtom.L.map('map', {
      key: '925XUD4MhjVJnTe9Zza1FWfjfhkIKxDI',
      source: ['vector', 'raster'],
      basePath: 'https://api.tomtom.com/maps-sdk-js/4.37.1/examples/sdk',
      geopolView: 'IN',
      vector: {
        fallback: 'raster' //in case WebGL is not supported in browser
      }
    });
    this.map.zoomControl.setPosition('topright');

    this.map.locate({ setView: true, maxZoom: 12 });
    this.map.on('locationfound', this.getCurrentLoc, this);
    this.map.on('locationerror', this.getCurrentLocError, this);
  //  this.getIncidents();
  }

  getCurrentLoc(evt) {
    this.currentLoc = evt.latlng;
    this.locService.setCurrentLoc(this.currentLoc);
    this.displayCurrentLocMarker();
   // console.log('location',this.currentLoc);
    
  }
  getCurrentLocError() {
    this.toastCtrl.create({
      message: "We Couldn\'t find your location",
      duration: 3000,
      position: 'middle',
      cssClass: "toast-msg"
    }).present();
   
  }

  displayCurrentLocMarker() {
    if (this._marker) {
      this._marker.setLatLng(this.currentLoc).addTo(this.map);
      return;
    }
    this._marker = L.marker(this.currentLoc, {
      title: 'Your current location',
      icon: L.svgIcon({
        background: {
          icon: 'icon-locate_me_btn',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        },
        icon: null,
        opacity: 1
      })
    }).addTo(this.map);

    
   
  }

  displayIncidentMarkers(value) {


    let _this = this;
    //this.map.removeMarkers();
    //tomtom.L.removeMarkers();
    value.forEach(function (incident) {
      let icon = '';
      switch (incident.incidentType.toLowerCase()) {
        case 'accident': {
          icon = 'crash1.png'
          break;
        }
        case 'road block': {
          icon = 'barrier1.png'
          break;
        }
        case 'protest': {
          icon = 'protest1.png'
          break;

        }
        case 'road work': {
          icon = 'road-work1.png'
          break;
        }
        case 'breakdown': {
          icon = 'tow-truck1.png'
          break;
        }

        default: {
          icon = ''
          break;
        }
      }

      var markerOptions = {
        icon: tomtom.L.icon({
          iconUrl: 'assets/imgs/' + icon,
          iconSize: [30, 34],
          iconAnchor: [15, 34]
        })
      };
      var marker;
      if (icon !== '') {
        marker = tomtom.L.marker(incident.location, markerOptions).addTo(_this.map);
      } else {
        marker = tomtom.L.marker(incident.location).addTo(_this.map);
      }

      var statusCircleStyle = 'border-radius: 50%; height:60% !important; width:33% !important; margin:auto !important; margin-top: 10% !important; '
      incident.userVerified && incident.trafficVerified ? statusCircleStyle=statusCircleStyle+'border: solid 4px #0faa09;' : statusCircleStyle=statusCircleStyle+'border: solid 4px #6a6b6a;'

      var userTickStyle = 'margin: auto !important; font-size: 28px;margin-left: 1px !important; font-weight: bold !important;'
      incident.userVerified ? userTickStyle = userTickStyle+'color:#0faa09;' : userTickStyle = userTickStyle+'color:#6a6b6a;'

      var trafficTickStyle = 'margin: auto !important; font-size: 28px; margin-left: -10px !important; font-weight: bold !important;'
      incident.trafficVerified ? trafficTickStyle = trafficTickStyle+'color:#0faa09;' : trafficTickStyle = trafficTickStyle+'color:#6a6b6a;'
      
      //var incidentDetails = '<div style=" width: 300px !important;"><div><h6> Incident Type: ' + incident.incidentType + '</h6></div><div><h6> Severity: ' + incident.severity + '</h6></div><div>';

      var incidentDetails = '<div style=" width: 300px !important;"><div class="row"><div class="col"><div><h6> Incident Type: ' + incident.incidentType + ' </h6></div><div><h6> Severity: ' + incident.severity + '</h6></div></div><div class="col" ><div style="'+statusCircleStyle+'"><span style="'+userTickStyle+'">&#10003;</span><span style="'+trafficTickStyle+'">&#10003;</span></div></div></div><div class="row">';
      var imgs = '';
      incident.images.forEach(function (image) {
        imgs = imgs + '<img src="' + image + '" style="widows: 60px !important; height: 60px !important; margin:10px !important;"/>'
      });
      
      incidentDetails = incidentDetails + imgs + '</div></div>';
      marker.bindPopup(incidentDetails);
      marker.incidentData = incident;
      //markers.addLayer(marker);
    });

  }

  showIncident() {
    this.map.locate();
    let myModal = this.modalCtrl.create(IncidentModalPage, {currentMarkers:this.getCurrentNearMarkers.bind(this)});
    myModal.present();

  }

  getCurrentNearMarkers(type){
    console.log(type);
    let currentMarkers = [];
    var circle;
    circle = new L.circle(this.currentLoc, 50).addTo(this.map);

    this.map.eachLayer( function(layer) {
      if(layer instanceof L.Marker) {
        if(circle.getBounds().contains(layer.getLatLng()) && layer.incidentData && layer.incidentData.incidentType === type) {

          currentMarkers.push(layer.incidentData);
        }
      }
    });

    this.locService.setCurrentLocNearMarkers(currentMarkers);

    if (circle != undefined) {
      this.map.removeLayer(circle);
    }
  
  }

  getIncidents() {
    this.mapService.getIncidents().subscribe(value => {
      //console.log(value);
      this.displayIncidentMarkers(value);
    });

  }
  sos() {

    this.toastCtrl.create({
      message: 'Request Sent to your emergency contacts',
      duration: 3000,
      position: 'middle',
      cssClass: "toast-msg"
    }).present();
  
  }
  locateMe() {
    this.map.locate({ setView: true, maxZoom: 12 });
  }

}
