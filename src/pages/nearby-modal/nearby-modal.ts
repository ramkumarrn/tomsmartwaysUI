import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the NearbyModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-nearby-modal',
  templateUrl: 'nearby-modal.html',
})
export class NearbyModalPage {
  modalTitle: string= 'Near By';
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearbyModalPage');
  }
  close(){
    this.viewCtrl.dismiss();
  }

  showNearBy(val){
    console.log(val);
    this.viewCtrl.dismiss(val);
  }

}

