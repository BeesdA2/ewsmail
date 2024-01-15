const EWS = require('node-ews');
 


const NTLMAuth = require('httpntlm').ntlm;
const passwordPlainText = 'Winter#0944';
 
// store the ntHashedPassword and lmHashedPassword to reuse later for reconnecting
const ntHashedPassword = NTLMAuth.create_NT_hashed_password(passwordPlainText);
const lmHashedPassword = NTLMAuth.create_LM_hashed_password(passwordPlainText);
 
// exchange server connection info
const ewsConfig = {
    username: 'beesdpfa',
    nt_password: ntHashedPassword,
    lm_password: lmHashedPassword,
    host: 'https://webmail.bluekens.com'
};
 
 const options = {
 strictSSL: false
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ews = new EWS(ewsConfig, options);
 
// exchange server connection info

const btoa = require('btoa');
var basicAuth = 'bluekens\beesdpfa:Winter#0944';

 
 
// initialize node-ews
//const ews = new EWS(ewsConfig);
 
// define ews api function
const ewsFunction = 'CreateItem';
 
// define ews api function args
const ewsArgs = {
  "attributes" : {
    "MessageDisposition" : "SendAndSaveCopy"
  },
  "SavedItemFolderId": {
    "DistinguishedFolderId": {
      "attributes": {
        "Id": "sentitems"
      }
    }
  },
  "Items" : {
    "Message" : {
      "ItemClass": "IPM.Note",
      "Subject" : "Test EWS Email",
      "Body" : {
        "attributes": {
          "BodyType" : "HTML"
        },
        "$value": "This is a test email"
      },
      "ToRecipients" : {
        "Mailbox" : {
          "EmailAddress" : "m.van.meel@beesda2.nl"
        }
      },
      "IsRead": "false"
    }
  }
};
 
// query ews, print resulting JSON to console


 const ewsHeaders = { 't:RequestServerVersion': { attributes: { Version: 'Exchange2013_SP1' } },  };
ews.run(ewsFunction, ewsArgs, ewsHeaders)
  .then(result => {
    console.log(JSON.stringify(result));
  })
  .catch(err => {
    console.log(err.stack);
  });