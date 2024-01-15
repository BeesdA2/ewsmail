const { getMaillog } = require("./getMaillogDb.js");
const { getMailAtt } = require("./getMailAttDb.js");
const { getMailVar } = require("./getMailVarDb.js");



const { getEWSControl } = require("./getEWSControlDb.js");
const { updateMaillogResponse } = require("./updateMaillogDb.js");
const { updateMaillogResponseWithResponseData } = require("./updateMaillogDb.js");
const { updateMaillogErrorResponse } = require("./updateMaillogDb.js"); 


 const EWS = require('node-ews');
 const qs = require('qs');
 const atob = require('atob');
 const btoa = require('btoa');
 const handlebars = require("handlebars");
 

var mailnr = process.argv[2];

 
// Wegschrijven naar log 	
//console.log('mailnr: '  + mailnr ); 
 
 
async function sendRequestEws (mailnr) {
   try{
  // Ophalen gegevens Endpoint
  const respMaillog   	= await getMaillog(mailnr);
  const respMailAtt   	= await getMailAtt(mailnr);
  const respMailVar   	= await getMailVar(mailnr);
  
   
  
 // wacht op antwoord functies
 let resultMaillog = await respMaillog;
 let resultMailAtt = await respMailAtt;
 let resultMailVar = await respMailVar;
 
let mailfrom = resultMaillog[0].MAILFROM.trim();  


console.log('Aantal Attachments: '+ resultMailAtt.length);

let basicb64decoded = atob(resultMaillog[0].REQUESTTOKEN);
//console.log('basicb64decoded ' +basicb64decoded);
const [domainusername, AADpassword] = basicb64decoded.split(':');
//console.log(AADpassword);
const [domain,AADusername] = domainusername.split('\\');
//console.log(AADusername); 

const respEWSControl   	= await getEWSControl();
let resultEWSControl       = await respEWSControl;

let exchangeHost = 'https://' + resultEWSControl[0].EWSURL;
let mailpgm  = resultMaillog[0].MAILPGM;
//let mailfrom = resultMaillog[0].MAILFROM.trim();  
let mailto   = resultMaillog[0].MAILTO.trim(); 
let mailcc   = resultMaillog[0].MAILCC.trim(); 
let mailbcc = resultMaillog[0].MAILBCC.trim(); 
let mail_subject = resultMaillog[0].MAIL_SUBJECT;
let mail_isdraft = resultMaillog[0].MAIL_ISDRAFT; 
let mail_savetosentitems = resultMaillog[0].MAIL_SAVETOSENTITEMS;  

let requestMethod = resultMaillog[0].REQUESTMETHOD;
let requestURL =  resultMaillog[0].REQUESTURL;
let requestPARAMETERS =  resultMaillog[0].REQUESTPARAMETERS;
let requestToken   = resultMaillog[0].REQUESTTOKEN;

let requestBodyContent =  resultMaillog[0].REQUESTBODYCONTENT;
//console.log('ExchangeHost : ' + exchangeHost);

let verwerkt =  resultMaillog[0].VERWERKT;

 
let signatureImage = atob(resultMaillog[0].MAIL_IMAGE);
let requestTemplateBefore =  atob(resultMaillog[0].MAIL_TEMPLATE);
if (signatureImage !== "")
{
requestTemplateBefore = requestTemplateBefore + '<img  src=\"cid:signatureImage\">';
}


//console.log(JSON.stringify(requestTemplateBefore));
let template = handlebars.compile(requestTemplateBefore);

		
//console.log(JSON.stringify(resultMailVar));	
let dataBinding = {};
for(i=0; i<resultMailVar.length; i++){
    var var_name =  resultMailVar[i].VAR_NAME;
    var var_content = resultMailVar[i].VAR_CONTENT;	
	dataBinding[var_name] = var_content ;
}
//console.log(JSON.stringify(dataBinding));	
let finalHtml = template(dataBinding);



//console.log(requestBody);
// URL-parameters toevoegen aan de URL Whatsapp   


let ewsBody ='';
console.log("mail_isdraft : " + mail_isdraft);
if (mail_isdraft == "false")
{
  ewsBody = {
  'attributes' : {
    'MessageDisposition' : "SendAndSaveCopy"
  },
  'SavedItemFolderId': {
    'DistinguishedFolderId': {
      'attributes': {
        'Id': 'sentitems'
      }
    }
  },
  'Items' : {
    'Message' : {
      'ItemClass': "IPM.Note",
      'Subject' : '' + mail_subject.trim()
      ,'Body' : {
        'attributes': {
          'BodyType' : "HTML"
        },
        '$value': '' + finalHtml.trim()
      },
      'ToRecipients' : {
        'Mailbox' : {
          'EmailAddress' : '' + mailto.trim()
        }
      },
	   'CcRecipients' : {}, 
	   'BccRecipients' : {}, 
      'IsRead': 'false',
	  'Attachments': {
				'FileAttachment': [ ]
	  }			
    }
  }
};

//console.log('Aantal attachment objecten ' + resultMailAtt.length);

// signature_image toevoegen
   if (signatureImage!== "")
   {
	//console.log('Wat is signatureImage ' + JSON.stringify(signatureImage));
	let arrobj = {};
    arrobj['Content'] = btoa(signatureImage);
 	arrobj['ContentId'] = 'signatureImage';
	arrobj['IsInline'] = 'true';
	arrobj['IsContactPhoto'] = 'false';
    arrobj['ContentType'] = 'image/png';
    arrobj['Name'] = 'signature.png'; 
    ewsBody.Items.Message.Attachments.FileAttachment.push(arrobj); 
   }
    
	if (mailcc !== "")
	{	
     let arrobj = {  'Mailbox' : { 'EmailAddress' : '' +mailcc.trim() }};
	 console.log(arrobj);
	 ewsBody.Items.Message['CcRecipients']= arrobj;
	 
    } 
	if (mailbcc !== "")
	{	
     let arrobj = {  'Mailbox' : { 'EmailAddress' : '' +mailbcc.trim() }};
	 console.log(arrobj);
	 ewsBody.Items.Message['BccRecipients']= arrobj;
	 
    } 

for(i=0; i<resultMailAtt.length; i++){
    let arrobj = {};
    arrobj['Content'] = btoa(resultMailAtt[i].ATT_FILE);;
	//body.Message.Attachments['contentId'] = 'cid:plaatje';
    arrobj['Name'] = resultMailAtt[i].ATT_NAME;
	arrobj['IsInline'] = 'false';
	arrobj['IsContactPhoto'] = 'false';
	ewsBody.Items.Message.Attachments.FileAttachment.push(arrobj); 

}
}

//console.log(body);

   
if (mail_isdraft != "false")
{
	 
					ewsBody = {
  'attributes' : {
    'MessageDisposition' : "SaveOnly"
  
  },
  'Items' : {
    'Message' : {
      'ItemClass': "IPM.Note",
      'Subject' : '' +mail_subject.trim() 
      ,'Body' : {
        'attributes': {
          'BodyType' : "HTML"
        },
        '$value': '' + finalHtml.trim()
      },
      'ToRecipients' : {
        'Mailbox' : {
          'EmailAddress' : '' + mailto.trim()
        }
      },
	  'CcRecipients' : { },
        	   	  
	  'BccRecipients' : { },
       	  
      'IsRead': 'false',
	  'Attachments': {
				'FileAttachment': [ ]
	  }		
    }
  }
};
	
//console.log('Aantal attachment objecten ' + resultMailAtt.length);	
	// signature_image toevoegen
   if (signatureImage!== "")
   {
	//console.log('Wat is signatureImage ' + JSON.stringify(signatureImage));
	let arrobj = {};
    arrobj['Content'] = btoa(signatureImage);
 	arrobj['ContentId'] = 'signatureImage';
	arrobj['is_Inline'] = 'true';
    arrobj['ContentType'] = 'image/png';
    arrobj['Name'] = 'signature.png'; 
    ewsBody.Items.Message.Attachments.FileAttachment.push(arrobj); 
   }
    
	if (mailcc !== "")
	{	
     let arrobj = {  'Mailbox' : { 'EmailAddress' : '' +mailcc.trim() }};
	 console.log(arrobj);
	 ewsBody.Items.Message['CcRecipients']= arrobj;
	 
    } 
	
	if (mailbcc !== "")
	{	
     let arrobj = {  'Mailbox' : { 'EmailAddress' : '' +mailbcc.trim() }};
	 console.log(arrobj);
	 ewsBody.Items.Message['BccRecipients']= arrobj;
	 
    } 
	console.log('Aantal bijlage ' + resultMailAtt.length);
for(i=0; i<resultMailAtt.length; i++){
    let arrobj = {};
    arrobj['Content'] = btoa(resultMailAtt[i].ATT_FILE);
	//body.Message.Attachments['contentId'] = 'cid:plaatje';
    arrobj['Name'] = resultMailAtt[i].ATT_NAME;
	arrobj['IsInline'] = 'false';
	arrobj['IsContactPhoto'] = 'false';
	ewsBody.Items.Message.Attachments.FileAttachment.push(arrobj); 

}	
}	
		
 try {
 const NTLMAuth = require('httpntlm').ntlm;
 
const passwordPlainText = AADpassword;
//passwordPlainText= "Fout";
 
// store the ntHashedPassword and lmHashedPassword to reuse later for reconnecting
const ntHashedPassword = NTLMAuth.create_NT_hashed_password(passwordPlainText);
const lmHashedPassword = NTLMAuth.create_LM_hashed_password(passwordPlainText);
//console.log('AADpassword '+ AADpassword + ' AADusername ' + AADusername );
 
// exchange server connection info
const ewsConfig = {
    username: AADusername,
    nt_password: ntHashedPassword,
    lm_password: lmHashedPassword,
    host: exchangeHost.trim()
};
 
// const ewsConfig = {};
 const options = {
 strictSSL: false
};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


//console.log(JSON.stringify(ewsConfig));
const ews = new EWS(ewsConfig, options);
 
// initialize node-ews
//const ews = new EWS(ewsConfig);
 
// define ews api function
const ewsFunction = 'CreateItem';
 
// define ews api function args

  
		//	body = requestBody.trim();
//body = requestBody;		
//console.log(JSON.stringify(ewsBody)); 
 
	// query ews, print resulting JSON to console
	 
//var basicAuth = 'bluekens\beesdpfa:Winter#0944';
// , 't:Authorization': { attributes: { Basic : btoa(basicAuth)}},
 const ewsHeaders = { 't:RequestServerVersion': { attributes: { Version: 'Exchange2013_SP1' } } };
//	const ewsHeaders = { 't:RequestServerVersion': { attributes: { Version: 'Exchange2013_SP1' } }, };
  
  const result = await ews.run(ewsFunction, ewsBody, ewsHeaders);
  
  //.then(result => {
  //  console.log(JSON.stringify(result));
  //	await updateMaillogResponse(mailnr, result);
//	await updateMaillogResponseWithResponseData(mailnr, result);
 // })
  //.catch(err => {
   // //console.log(err.stack);
  //	console.log(err.message);
	//updateMaillogErrorResponse(mailnr, err);
	
  //});
  console.log(JSON.stringify(result));
  await updateMaillogResponse(mailnr, result);
  await updateMaillogResponseWithResponseData(mailnr, result);	
//console.log(ews);	
   } catch (err) {
	  console.log("error: " +  JSON.stringify(err.response.data));
		 await updateMaillogErrorResponse(mailnr, err);
 		console.log("error: " +  JSON.stringify(err.response.data));	
     	}
		
   } catch (e) {
        console.error('e :' +e);
    } finally {
        console.log('EWS cleanup here');
		return ({ message: 'EWS succesvol uitgevoerd'});
    }	
  };
   

sendRequestEws (mailnr);

async function handleEWS (mailnr)
{
    try{	
	var resolve = await sendRequestEws (mailnr);
	return (resolve);
    }
	catch(err) {}
	
}


module.exports = {
  handleEWS: handleEWS
  };

