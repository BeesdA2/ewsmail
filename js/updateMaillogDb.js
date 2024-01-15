const {dbconn, dbstmt} = require('idb-connector');

function updateMaillogResponse (mailnr, response) {
	 
  return new Promise(function(resolve)
  {
	
 
	 
    const sSql = 'UPDATE dasfp@v.maillog set RESPONSEHTTPCODE  = \'200\' , RESPONSEHTTPMESSAGE = \'SUCCESSFULL\' , RESPONSEERRORMESSAGE = \'RESPONSE\' where mailnr= ' + mailnr + ' with NONE';
				  
				  
				  
	//console.log("Log weblog response:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
  	const statement = new dbstmt(connection); 
   
   statement.execSync(sSql, (x) => {

    statement.close();
      connection.disconn();
      connection.close();
    //console.log(x);
	resolve('update geslaagd');    
	});
	});
}

function updateMaillogResponseWithResponseData (mailnr, response) {
	 
  return new Promise(function(resolve)
  {
	
 
	 
    const sSql = 'UPDATE dasfp@v.maillog set RESPONSEHTTPCODE  = \'200\' , RESPONSEHTTPMESSAGE = \'SUCCESSFULL\' , RESPONSEERRORMESSAGE = \'RESPONSEDATA\', RESPONSEDATA = \'' + JSON.stringify(response) + '\' where mailnr= ' + mailnr + ' with NONE';
				  
				  
				  
	//console.log("Log weblog response:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
  	const statement = new dbstmt(connection); 
   
   statement.execSync(sSql, (x) => {

    statement.close();
      connection.disconn();
      connection.close();
    //console.log(x);
	resolve('update geslaagd');    
	});
	});
}

function updateMaillogErrorResponse (mailnr, err) {
	 
  return new Promise(function(resolve)
  {
	
 
	 
    const sSql = 'UPDATE dasfp@v.maillog set RESPONSEHTTPCODE  = \'400\' , RESPONSEHTTPMESSAGE = \'NOT SUCCESSFULL\' , RESPONSEDATA = \' \' ,RESPONSEERRORMESSAGE  = \'' + JSON.stringify(err.message) + '\'  where mailnr= ' + mailnr + ' with NONE';
				  
				  
				  
	//console.log("Log weblog response:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
  	const statement = new dbstmt(connection); 
   
   statement.execSync(sSql, (x) => {

    statement.close();
      connection.disconn();
      connection.close();
    //console.log(x);
	resolve('update geslaagd');    
	});
	});
}
 
 
 module.exports = {
  
 updateMaillogResponse : updateMaillogResponse,
 updateMaillogResponseWithResponseData : updateMaillogResponseWithResponseData,
 updateMaillogErrorResponse : updateMaillogErrorResponse
 };