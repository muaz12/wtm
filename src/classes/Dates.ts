
//CLASS
class Dates {

  //VARIABLES
  date: any;


  /** 
   * Method Name   : getDates()
   * Purpose       : to get current date
   * Trigger when  : invoked by 
   **/
  public getDates() {
    var d = new Date();
    this.date = d.getTime();
    return this.date;
  }


  /** 
   * Method Name   : getDate()
   * Purpose       : to get variable date
   * Trigger when  : invoked by DatabaseHandler insertData(ntu)
   **/
  public getDate() {
    return this.date;
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