const {dbconn, dbstmt} = require('idb-connector');

 function getMaillog (mailnr) {
	 
  return new Promise(function(resolve)
  { 
     
       
    const sSql = 'SELECT * 	from dasfp@v.maillog where mailnr= ' + mailnr + ' with NONE';
	  const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);     
	
    statement.exec(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
 	resolve(x);    
	});
  });
 }
  module.exports = {
  getMaillog: getMaillog
  };
