import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface Location{
  latitude:string;
  longitude:string;
}

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http: HttpClient) { }

  getLocation(){
    return this.http.get<Location>('http://api.ipapi.com/196.75.16.8?access_key=9713755faad09dac72f806fd9033c9e4')
  }
}
