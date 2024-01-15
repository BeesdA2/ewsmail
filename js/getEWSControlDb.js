const {dbconn, dbstmt} = require('idb-connector');

 function getEWSControl () {
	 
  return new Promise(function(resolve)
  { 
     
       
    const sSql = 'select * from dasfp@v.ewscontrol with NONE';
	console.log(sSql);
	  const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);     
	
    statement.exec(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
	  //console.log(JSON.stringify(x));
 	resolve(x);    
	});
  });
 }
  module.exports = {
  getEWSControl: getEWSControl
  };
