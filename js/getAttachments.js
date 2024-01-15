const { getMailAtt } = require("./getMailAttDb.js");

async function getAttachmentObjects (mailnr) {
	 
  return new Promise(function(resolve)
  { 
     
       // Ophalen gegevens Endpoint
  const respMailAtt   	= await getMailAtt(mailnr);
   
  
 // wacht op antwoord functies
 let resultMailAtt = await respMailAtt;

console.log('Aantal objecten ' + resultMailAtt.length);
  
    
	let Attachment =
            {
                'odatatype': '#Microsoft.OutlookServices.FileAttachment',
                'contentBytes': 'bWFjIGFuZCBjaGVlc2UgdG9kYXk=',
                'contentType': 'text',
                'contentId':  'thumbsUp',
                'name':  'menu.txt'
            }
			console.log('Attachment '+ Attachment);
			
			
			var jsonObj = {
    members: 
           {
            host: "hostName",
            viewers: 
            {
                user1: "value1",
                user2: "value2",
                user3: "value3"
            }
        }
}

var i;

for(i=4; i<=8; i++){
    var newUser = "user" + i;
    var newValue = "value" + i;
    jsonObj.members.viewers[newUser] = newValue ;

}

console.log(jsonObj);
resolve(jsonObj);
  });
 }
  module.exports = {
  getAttachmentObjects: getAttachmentObjects
  };
