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
    if(login.type=="success"){ // Logged in
        
        var Download= await Cmd.AppUpdate(
            {
            InstPath:"example/gamefolder/",
            AppID:610360,
            Validate:true,
                Cb:function (data) {
                    console.log("["+data.percent+"%] ("+data.state+") | "+data.current+" / "+data.max);
                }
            }
        );

        if(Download.type=="success"){
            console.log("Downloaded !");
        }else{
            console.log(Download);
        }
        

    }else{
        console.log(login);
    }
})();