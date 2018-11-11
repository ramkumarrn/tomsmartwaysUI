import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NearbyModalPage } from '../nearby-modal/nearby-modal';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { LocationServiceProvider } from '../../providers/location-service/location-service';

/**
 * Generated class for the NearbyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html',
})
export class NearbyPage {

  map: any;
  _marker: any;
  currentLoc: any = {};
  loading:any;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, 
    private mapService: MapServiceProvider, private locService: LocationServiceProvider,
    public loadingCtrl: LoadingController, private toastCtrl:  ToastController) {
    this.loading = this.loadingCtrl.create({spinner: 'dots'});
  }
  ngOnInit() {
     
    //this.showMap();
  }

  showMap(){
    if(this.map){
      this.map.off();
      this.map.remove();
    }
    this.map = tomtom.L.map('nearby', {
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
  }


  getCurrentLoc(evt) {
    this.currentLoc = evt.latlng;
    this.locService.setCurrentLoc(this.currentLoc);
   // console.log(this.currentLoc);
    this.displayCurrentLocMarker();
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


  ionViewDidEnter(){
    /*this.map.locate();
    this.map.on('locationfound', this.displayMarker, this);*/
    this.showMap();
    this.showNearByModal();
  }
  showNearByModal(){
    let myModal = this.modalCtrl.create(NearbyModalPage);
    myModal.present();

    myModal.onDidDismiss(data => {
      // Do things with data coming from modal, for instance :
      if(data){
        this.getNearByLocs(data);      
      }
      
  });
  }

  getNearByLocs(query){

    //let _this = this;
    this.loading.present();
    this.mapService.getNearByLocs(query, this.currentLoc).subscribe(value => {
      //console.log(value);
      this.loading.dismiss();
      this.displayNearByLocMarkers(value,query);
   }, (err) => {
    console.log(err);
    this.loading.dismiss();
    this.toastCtrl.create({
      message: "Something went wrong",
      duration: 2000,
      position: 'middle',
      cssClass: "toast-msg"
    }).present();
   });

  }
  displayNearByLocMarkers(data, query){
    let icon = '';
    switch(query.toLowerCase()) { 
      case 'gas station': { 
         icon = 'gas1.png'
         break; 
      } 
      case 'atm': { 
        icon = 'atm1.png'
        break; 
      }
      case 'hospitals': { 
        icon = 'hospital1.png'
        break; 
      
      } 
      case 'restaurants': { 
        icon = 'food1.png'
        break; 
      } 
      case 'malls': { 
        icon = 'mall1.png'
        break; 
      } 
      case 'theatres': { 
        icon = 'theatre1.png'
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

  let _this = this;
  //this.map.removeMarkers();
  //tomtom.L.removeMarkers();
  data.results.forEach(function (point) {
    var title = point.poi.name;
      var marker ;
      if(icon !== ''){
        marker = tomtom.L.marker(point.position, markerOptions).addTo(_this.map);
      }else {
        marker = tomtom.L.marker(point.position).addTo(_this.map);
      }
     
    marker.bindPopup(title);
    //markers.addLayer(marker);
  });
  /*
    var markers = tomtom.L.markerClusterGroup();
    data.results.forEach(function (point) {
      var title = point.poi.name,
        marker = tomtom.L.marker(new tomtom.L.LatLng(point.position.lat, point.position.lon), { title: title });
        console.log(title)
      marker.bindPopup(title);
      markers.addLayer(marker);
    });

    this.map.addLayer(markers);*/
  }

}
