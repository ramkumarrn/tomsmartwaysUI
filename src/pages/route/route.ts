import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { IncidentModalPage } from '../incident-modal/incident-modal';

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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }
  ngOnInit() {
     this.map = tomtom.L.map('route', {
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
