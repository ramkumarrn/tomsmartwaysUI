import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationServiceProvider } from '../location-service/location-service';

/*
  Generated class for the MapServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapServiceProvider {

  constructor(public http: HttpClient, private locService: LocationServiceProvider) {
    console.log('Hello MapServiceProvider Provider');
  }

  getIncidents(){
    var url = 'https://node2-220718.appspot.com/aqi/getsmartdata';
    return this.http.get(url);

  };

  saveIncident(data){
    data.location = this.locService.getCurrentLoc();
    var url = 'https://prime-bridge-220106.appspot.com/aqi/pushtoqueue';

    return this.http.post(url, data);

  };

  getNearByLocs(query, latlong){
    var params = {
      key: '925XUD4MhjVJnTe9Zza1FWfjfhkIKxDI',
      lat: '',
      lon: '',
      radius: '',
      countrySet: 'IN',
      view: 'IN'
    }
    params.lat = latlong.lat;
    params.lon = latlong.lng;
    var url = 'https://api.tomtom.com/search/2/categorySearch/'+query+'.json';

    return this.http.get(url, {params: params});
    
  }
}
