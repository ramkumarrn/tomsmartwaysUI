import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the LocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationServiceProvider {

  currentLocation: any={}
  currentLocNearMarkers: any= []
  constructor() {
    console.log('Hello LocationServiceProvider Provider');
  }

  setCurrentLoc(currentLoc){
    this.currentLocation = currentLoc;
  }
  getCurrentLoc(){
    return this.currentLocation;
  }

  setCurrentLocNearMarkers(markers){
    this.currentLocNearMarkers = markers;
  }

  getCurrentLocNearMarkers(){
    return this.currentLocNearMarkers;
  }

}
