
//REQUIRED DEPENDENCIES AND LIBRARIES
import { Geolocation } from '@ionic-native/geolocation';

//CLASS
export class LocationHandler {

  //VARIABLES
  static locationObject: LocationHandler;
  latitude;
  longitude;
  log = '';


  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of LocationHandler class
   * Trigger when  : invoked by DatabaseHandler insertData() 
   **/
  public static getInstance() {
    if(!this.locationObject){
      this.locationObject = new LocationHandler();
    }
    return this.locationObject;
  }


  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of Geolocation class
   * Trigger when  : invoked by getLatitude(), getLongitude()
   **/
  public getGeolocation() {
    return new Geolocation();
  }


  /** 
   * Method Name   : getLatitude()
   * Purpose       : to get the latitude of device's position 
   * Trigger when  : invoked by DatabaseHandler insertData(ntu)
   **/
  public getLatitude() {
    this.log = this.log + 'passed get Lat';
    this.latitude = 123.432;
    return this.latitude;
  }

  public getLog() {
    return this.log;
  }
 
  /** 
   * Method Name   : getLongitude()
   * Purpose       : to get the longitude of device's position
   * Trigger when  : invoked by DatabaseHandler insertData(ntu)
   **/
  public getLongitude() {
    this.log = this.log + 'passed get long';
    this.longitude = 321.33;
    return this.longitude;
  }


  /** 
   * Method Name   : getCoordinate()
   * Purpose       : to return the coordinate of the device
   * Trigger when  : invoked by 
   **/
  public getCoordinate() {
      return '(' + this.getLatitude + ',' + this.getLongitude + ')';
  }


  /** 
   * Method Name   : computeDistance()
   * Purpose       : to calculate the distance between current location with the stored location in database
   * Trigger when  : invoked by 
   **/
  public computeDistance() {

  }
}