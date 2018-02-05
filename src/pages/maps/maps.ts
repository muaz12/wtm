
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
   * Method Name   : addInfoWindow(marker, content)
   * Purpose       : to display the popup message box when the pointer is clicked
   * Trigger when  : invoked by addMarker()
  **/
  public addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }


  public 

}
