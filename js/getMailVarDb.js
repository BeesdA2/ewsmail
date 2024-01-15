const {dbconn, dbstmt} = require('idb-connector');

 function getMailVar (mailnr) {
	 
  return new Promise(function(resolve)
  { 
     
       
    const sSql = 'SELECT VAR_NAME, VAR_CONTENT from dasfp@v.mailvar where mailnr= ' + mailnr + ' with NONE';
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
  getMailVar: getMailVar,
  };
