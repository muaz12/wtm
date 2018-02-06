
//REQUIRED DEPENDENCIES AND LIBRARIES
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseDatabase } from '../../classes/FirebaseDatabase';
import { SQLiteHandler } from '../../classes/SQLiteHandler';
import { LocationHandler } from '../../classes/LocationHandler';

declare var google: any;


//COMPONENT
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html'
})
 
//CLASS
export class MapsPage {

  //GETTING MAP ELEMENT
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  //VARIABLE
  firebaseDatabaseObject = FirebaseDatabase.getInstance();
  sqliteObject = SQLiteHandler.getInstance();
  locationObject = LocationHandler.getInstance();
  lat;
  long;


  //CONSTRUCTOR
  constructor(public navCtrl: NavController) {}


  //WAITING FOR maps.html TO FULLY LOADED
  ionViewDidLoad(){
    this.loadMap();
  }

 
  /** 
   * Method Name   : loadMap()
   * Purpose       : to display maps
   * Trigger when  : invoked when the view completely loaded
  **/
  public loadMap(){
    this.locationObject.getGeolocation().getCurrentPosition().then((position) => {
      
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      let latLng = new google.maps.LatLng(this.lat, this.long);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();
      this.addMarkerFromSQliteData();
    }, (err) => {
      console.log(err);
    });
  }


  /** 
   * Method Name   : addMarker()
   * Purpose       : to display pointer that showing the current location of user
   * Trigger when  : invoked by loadMap()
  **/
  public addMarker(){ 
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });  
    let content = "<h4>Your current location</h4>";         
    this.addInfoWindow(marker, content);
  }


  /** 
   * Method Name   : addMarkerFromSQliteData()
   * Purpose       : to display pointer that showing the location stored in sqlite db
   * Trigger when  : invoked by loadMap()
  **/
  public addMarkerFromSQliteData(){ 
    let data = this.sqliteObject.readDataResult();
    for (var i = 0; i < data.length; i++) {
      let latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });  
      let content = '<h4>NTU: ' + data[i].ntu + '</h4>';         
      this.addInfoWindow(marker, content);
    }
  }


  /** 
   * Method Name   : addInfoWindow(marker, content)
   * Purpose       : to display the popup message box when the pointer is clicked
   * Trigger when  : invoked by addMarker(), addMarkerFromSQliteData()
  **/
  public addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  public happyAquatic() {
    return {
      path: '',
      fillColor: 'yellow',
      fillOpacity: 0.8,
      scale: 0.1,
    };
  }

  public dizzyAquatic() {
    return {
      path: '',
      fillColor: 'yellow',
      fillOpacity: 0.8,
      scale: 0.1,
    };
  }

  public deadAquatic(){
    return {
      path: 'M1757 1760 c-344 -72 -626 -245 -872 -536 -238 -282 -338 -395 -358 -407 -15 -8 -68 ' + 
      '-12 -157 -13 -158 0 -206 -13 -302 -77 -73 -49 -84 -78 -44 -116 34 -32 139 -68 240 -83 l86 ' +
      '-12 0 -71 c0 -85 21 -178 47 -214 33 -43 65 -39 124 16 77 72 104 136 117 281 l7 77 65 22 c36 ' +
      '12 182 46 326 77 623 131 836 256 930 543 27 82 29 98 29 250 0 89 -3 164 -6 168 -4 3 -22 -3 -41 ' +
      '-15 -43 -25 -118 -40 -160 -31 l-32 7 25 20 c37 30 57 56 74 97 18 43 24 42 -98 17z m-38 -359 ' +
      'c10 -7 12 -20 7 -50 -6 -40 -5 -42 24 -53 41 -14 55 -41 34 -63 -9 -9 -23 -14 -31 -11 -50 19 -59 ' +
      '17 -73 -16 -11 -25 -21 -33 -40 -33 -23 0 -25 3 -23 46 2 43 0 47 -30 60 -20 9 -33 22 -35 37 -4 29 ' +
      '20 38 63 24 33 -10 35 -9 45 23 10 29 21 42 40 44 3 0 11 -3 19 -8z M677 1390 c-29 -34 -53 -127 -67 ' +
      '-262 -15 -148 0 -146 135 19 148 180 156 213 66 252 -70 30 -104 28 -134 -9z M1600 793 c-58 -24 -163 ' +
      '-61 -234 -82 -71 -20 -131 -42 -133 -48 -10 -28 140 -71 277 -80 129 -8 147 2 196 103 20 41 38 93 41 ' +
      '115 5 36 4 39 -18 38 -13 0 -71 -21 -129 -46z',
      fillColor: 'yellow',
      fillOpacity: 1,
      scale: 0.1,
    };
  }


  

}
