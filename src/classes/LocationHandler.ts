
//REQUIRED DEPENDENCIES AND LIBRARIES
import { Geolocation } from '@ionic-native/geolocation';

//CLASS
export class LocationHandler {

  //CONSTRUCTOR
  constructor(private geolocation: Geolocation) { }
  
  /** 
   * Method Name   : getLatitude()
   * Purpose       : to get the latitude of device's position 
   * Trigger when  : invoked by DatabaseHandler insertData(ntu)
   **/
  public getLatitude() {
    return 123.432;
  }

 
  /** 
   * Method Name   : getLongitude()
   * Purpose       : to get the longitude of device's position
   * Trigger when  : invoked by DatabaseHandler insertData(ntu)
   **/
  public getLongitude() {
    return 321.33;
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