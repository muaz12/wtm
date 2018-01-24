
//REQUIRED DEPENDENCIES AND LIBRARIES
import { Dates } from './Dates'
declare var cordova: any;

//CLASS
export class Path {

  //VARIABLES
  static pathObject: Path;
  datesObject = Dates.getInstance();
  path;
  

  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of Path class
   * Trigger when  : invoked by DatabaseHandler, ProcessPage
   **/
  public static getInstance() {
    if(!this.pathObject){
      this.pathObject = new Path();
    }
    return this.pathObject;
  }


  /** 
   * Method Name   : pathForImage()
   * Purpose       : to show image in Application
   * Trigger when  : invoked by ProcessPage copyFileToLocalDir(), DatabaseHandler insertData()
  **/
  public pathForImage() {
    this.path = cordova.file.externalRootDirectory + 'Water Turbidity Meter/Images/' + this.datesObject.date + '.jpg';
    return this.path;
  }
}