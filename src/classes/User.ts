
//CLASS
export class User {
  
    //VARIABLE
    static userObject: User;
    user;
    

    /** 
     * Method Name   : getInstance()
     * Purpose       : to get the instance of User class
     * Trigger when  : invoked by SQLiteHandler, FirebaseDatabase
     **/
    public static getInstance() {
      if(!this.userObject){
        this.userObject = new User();
      }
      return this.userObject;
    }


    /** 
     * Method Name   : getUserName()
     * Purpose       : to get the name of current's user
     * Trigger when  : invoked by DatabaseHandler insertData() 
     **/
    public getUserName() {
      this.user = 'Syazani'
      return this.user;
    }
}