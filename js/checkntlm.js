var httpntlm = require('httpntlm');
 
 
 var AADusername  = process.argv[2];
 var AADpassword  = process.argv[3];
 
 console.log('AADusername: '+ AADusername);
 console.log('AADpassword: '+ AADpassword);
 
 
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

 
httpntlm.get({
    url: "https://someurl.com",
    username: 'm$',
    password: 'stinks',
    workstation: 'choose.something',
    domain: ''
}, function (err, res){
    if(err) return err;
 
    console.log(res.headers);
    console.log(res.body);
});