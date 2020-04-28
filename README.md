A bus ticket booking api server build on express.js with MongoDB as the backend.

**API docs:**
  
**POST '/api/issue'**
* Create a ticket in tickets collection and corresponding user in user collection with seat_number. 
* All of the attributes are required. 
* payload:  
{
    "seat_number":10,
    "passenger":{
        "name":"name",
        "sex":"M",
        "age":"22",
        "phone":"999999"
    }
}   

**GET '/api/tickets/closed'**
* Get list of all researved seats. 
  
**GET '/api/tickets/:number'**
* Get status of the ticket. 
* All of the attributes are required. 
  
**GET '/api/tickets/close/:number'**
* Close the status of ticket 
* All of the attributes are required. 

**PUT '/api/tickets/update/:number'**
* Update the user details of the ticket. 
* All of the attributes are required. 
* payload:  
{
    "seat_number":10,
    "passenger":{
        "name":"name",
        "sex":"M",
        "age":"22",
        "phone":"88888"
    }
} 
  
**GET '/api/tickets/status/open'**
* Get the list of available seats.
* All of the attributes are required.  
  
**POST '/api/reset'**
* Reset the server. open up all tickets 
* All of the attributes are required. 
* payload:  
{
    "username":"username"
}   
