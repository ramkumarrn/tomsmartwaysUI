import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }
  ngOnInit() {
     this.map = tomtom.L.map('nearby', {
      key: '925XUD4MhjVJnTe9Zza1FWfjfhkIKxDI',
      source: ['vector', 'raster'],
      basePath: 'https://api.tomtom.com/maps-sdk-js/4.37.1/examples/sdk',
      vector: {
        fallback: 'raster' //in case WebGL is not supported in browser
      }
    });
    
    this.map.locate({setView: true, maxZoom: 12});

  }
}
