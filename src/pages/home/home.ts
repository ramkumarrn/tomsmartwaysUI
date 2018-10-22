import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { IncidentModalPage } from '../incident-modal/incident-modal';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
 map: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }
  ngOnInit() {
     this.map = tomtom.L.map('map', {
      key: '925XUD4MhjVJnTe9Zza1FWfjfhkIKxDI',
      source: ['vector', 'raster'],
      basePath: 'https://api.tomtom.com/maps-sdk-js/4.37.1/examples/sdk',
      vector: {
        fallback: 'raster' //in case WebGL is not supported in browser
      }
    });
    
    this.map.locate({setView: true, maxZoom: 15});

  }

  displayMarker(evt) {

    console.log(evt.latlng);

  }

  showIncident() {
    this.map.locate();
    this.map.on('locationfound', this.displayMarker, this);
    let myModal = this.modalCtrl.create(IncidentModalPage);
    myModal.present();

  }

}
