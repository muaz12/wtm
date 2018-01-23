
//CLASS
export class Dates {

  //VARIABLES
  static dateObject: Dates;
  date: any;
  log = '';
  

  /** 
   * Method Name   : getInstance()
   * Purpose       : to get the instance of Dates class
   * Trigger when  : invoked by ProcessPage 
   **/
  public static getInstance() {
    if(!this.dateObject){
      this.dateObject = new Dates();
    }
    return this.dateObject;
  }


  /** 
   * Method Name   : getDates()
   * Purpose       : to get current date
   * Trigger when  : invoked by ProcessPage createFileName()
   **/
  public getDates() {
    var d = new Date();
    this.date = d.getTime();
    this.log = this.log + 'passed getDates';
    return this.date;
  }

  public getLog() {
    return this.log;
  }

  /** 
   * Method Name   : computeDatesDifference()
   * Purpose       : to get the time interval between current date with the stored date in database
   * Trigger when  : invoked by 
   **/
  public computeDatesDifference() {
    return 0;
  }
}