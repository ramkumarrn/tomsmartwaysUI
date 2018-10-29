import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { IncidentModalPage } from '../incident-modal/incident-modal';
import { MapServiceProvider } from '../../providers/map-service/map-service';

/**
 * Generated class for the RoutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {

  map: any;
  _marker: any;
  currentLoc: any = {};

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, 
    private mapService: MapServiceProvider, private toastCtrl: ToastController) {

  }
  ngOnInit() {
    tomtom.routingKey('925XUD4MhjVJnTe9Zza1FWfjfhkIKxDI');
    tomtom.searchKey('925XUD4MhjVJnTe9Zza1FWfjfhkIKxDI');


     
  }

  showMap(){
    if(this.map){
      this.map.off();
      this.map.remove();
    }
    this.map = tomtom.L.map('route', {
      key: '925XUD4MhjVJnTe9Zza1FWfjfhkIKxDI',
      source: ['vector', 'raster'],
      basePath: 'https://api.tomtom.com/maps-sdk-js/4.37.1/examples/sdk',
      geopolView: 'IN',
      vector: {
        fallback: 'raster' //in case WebGL is not supported in browser
      }
    });
    this.map.zoomControl.setPosition('topright');

    
     this.map.locate({ setView: true, maxZoom: 11 });
    this.map.on('locationfound', this.getCurrentLoc, this);
    this.map.on('locationerror', this.getCurrentLocError, this);

    var routeInputs = tomtom.routeInputs().addTo(this.map);
        // Adding the route widget
        var routeOnMapView = tomtom.routeOnMap().addTo(this.map);

        // Connecting the routeInputs widget with the routeOnMap widget
        routeInputs.on(routeInputs.Events.LocationsFound, function(eventObject) {
            routeOnMapView.draw(eventObject.points);
        });
        routeInputs.on(routeInputs.Events.LocationsCleared, function(eventObject) {
            routeOnMapView.draw(eventObject.points);
        });

        // Show error in widget when location cannot be autodetected
        routeInputs.on(routeInputs.Events.LocationError, function() {
            routeInputs.showLocationNotFoundMessageBox();
        });
  }

  getCurrentLoc(evt) {
    this.currentLoc = evt.latlng;
    this.displayCurrentLocMarker();
  }
  getCurrentLocError() {
    this.toastCtrl.create({
      message: "We Couldn\'t find your location",
      duration: 5000,
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
  ionViewDidEnter(){
    /*this.map.locate();
    this.map.on('locationfound', this.displayMarker, this);*/
    this.showMap();
    this.getIncidents();
    
  }

  displayIncidentMarkers(value){
    

    let _this = this;
    //this.map.removeMarkers();
    //tomtom.L.removeMarkers();
    value.forEach(function (incident) {
      let icon = '';
      switch(incident.incidentType.toLowerCase()) { 
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
        case 'Breakdown': { 
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
            iconUrl: 'assets/imgs/'+icon,
            iconSize: [30, 34],
            iconAnchor: [15, 34]
        })
    };
        var marker ;
        if(icon !== ''){
          marker = tomtom.L.marker(incident.location, markerOptions).addTo(_this.map);
        }else {
          marker = tomtom.L.marker(incident.location).addTo(_this.map);
        }
       
        var incidentDetails = '<div style=" width: 300px !important;"><div><h6> Incident Type: ' + incident.incidentType + '</h6></div><div><h6> Severity: ' + incident.severity + '</h6></div><div>';

        var imgs = '';
        incident.images.forEach(function (image) {
          imgs = imgs + '<img src="' + image + '" style="widows: 60px !important; height: 60px !important; margin:10px !important;"/>'
        });
        /*+'<img src="'+incident.images[0]+'" style="widows: 60px !important; height: 60px !important; margin:10px !important;"/>'
        +'<img src="assets/imgs/gas1.png" style="widows: 60px !important; height: 60px !important; margin:10px !important;"/>'
         +'<img src="assets/imgs/gas1.png" style="widows: 60px !important; height: 60px !important; margin:10px !important;"/></div></div>';*/
        incidentDetails = incidentDetails + imgs + '</div></div>';
        marker.bindPopup(incidentDetails);
    });
      
    }
  


  showIncident() {
    this.map.locate();
    let myModal = this.modalCtrl.create(IncidentModalPage);
    myModal.present();

  }
  sos() {
    this.toastCtrl.create({
      message: "Request Sent to your emergency contacts",
      duration: 5000,
      position: 'middle',
      cssClass: "toast-msg"
    }).present();
    
  }

  locateMe(){
    this.map.locate({ setView: true, maxZoom: 11 });
  }

  getIncidents() {
    this.mapService.getIncidents().subscribe(value => {
      //console.log(value);
      this.displayIncidentMarkers(value);
   });

  }

}
