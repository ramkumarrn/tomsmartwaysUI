import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MapServiceProvider } from '../../providers/map-service/map-service';

/**
 * Generated class for the IncidentModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-incident-modal',
  templateUrl: 'incident-modal.html',
})
export class IncidentModalPage {
  modalTitle: string = 'Select a Incident';
  showIncident: boolean = true;
  incidentSelected: string = '';
  severitySelected: string = '';
  cameraPic: any[] = [];
  loading: any;
  getCurrentMarkers: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public viewCtrl: ViewController, private camera: Camera, private toast: ToastController,
    private mapService: MapServiceProvider, public loadingCtrl: LoadingController) {
      this.loading = this.loadingCtrl.create({spinner: 'dots'});
      this.getCurrentMarkers =  this.navParams.get("currentMarkers");
  }

  close(){
    this.viewCtrl.dismiss();
  }
  selectIncident(incident){
    this.showIncident= false;
    this.modalTitle = 'Submit the Incident';
    this.incidentSelected = incident;
    this.getCurrentMarkers(this.incidentSelected);
  }
  selectSeverity(val){
    this.severitySelected = val;
  }
  done(){
    if(this.severitySelected !== ''){
      var data = {
        incidentType: '',
        severity: '',
        images: [],
        location: {}
      }
  
      data.incidentType = this.incidentSelected;
      data.severity = this.severitySelected;
      data.images = this.cameraPic;
      this.loading.present();
      this.mapService.saveIncident(data).subscribe(value => {
        console.log(value);
        this.loading.dismiss();
        this.viewCtrl.dismiss();
     }, (err) => {
      console.log(err);
      this.loading.dismiss();
      this.toast.create({
        message: "Something went wrong",
        duration: 2000,
        position: 'middle',
        cssClass: "toast-msg"
      }).present();
     });
    }else{
      this.toast.create({
        message: 'Please Select the severity...',
        duration: 2000,
        position: 'middle',
        cssClass: "toast-msg"
      }).present();
    }
   
    
  }
  deleteImg(index){
    this.cameraPic.splice(index, 1);
  }
  

  takePhoto(){
    
    if(this.cameraPic.length < 3){
      const options: CameraOptions = {
        quality: 5,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 80,
      targetHeight: 80,
      }
      
      this.camera.getPicture(options).then((imageData) => {
        
       // imageData is either a base64 encoded string or a file URI
       // If it's base64 (DATA_URL):
       let base64Image = 'data:image/png;base64,' + imageData;
       //alert(base64Image);
       //console.log(base64Image);
       this.cameraPic.push(base64Image);
       this.cameraPic.reverse();
       //console.log(this.cameraPic);
      }, (err) => { 
       // Handle error
       console.log('Error',err);
      });
    }
    else{
      this.toast.create({
        message: 'You can post only 3 images.. Still want add image please delete one from the images',
        duration: 3000,
        position: 'middle',
        cssClass: "toast-msg"
      }).present();
     
    }
    
  }


}
