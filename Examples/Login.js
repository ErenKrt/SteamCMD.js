var {SteamCMD} = require('../Src/Wrapper');
var path= require('path');

(async function(){
    var Cmd= new SteamCMD({BinDir:"steamcmd.exe"});
    
    await Cmd.Create(function(data){
        console.log(data);
    })
    
    var login= await Cmd.Login({
        Username:"<YOUR NAME>",
        Password:"<YOUR PASS>",
        Guard:"<YOUR GUARD CODE>",
    });

    /*
    var LoginAnon= await Cmd.Login({
        Username:"anonymous"
    });
    */
    if(login.type=="success"){ // Logged in
        // Write your code here
    }else{
        console.log(login);
    }
})();