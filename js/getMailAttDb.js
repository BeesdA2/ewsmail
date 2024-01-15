const {dbconn, dbstmt} = require('idb-connector');

 function getMailAtt (mailnr) {
	 
  return new Promise(function(resolve)
  { 
     
       
    const sSql = 'SELECT * 	from dasfp@v.mailatt where mailnr= ' + mailnr + ' with NONE';
	//console.log('getMailAtt sSql '+ sSql);
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
  getMailAtt: getMailAtt,
  };
