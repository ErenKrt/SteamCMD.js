const {SteamCMD} = require("../Src/Wrapper");

var Cmd= new SteamCMD({Bindir:"./test/steamcmd.exe"});

(async function (){
	await Cmd.Create();
	
    var Login= await Cmd.Login({
        Username:"<YOUR USERNAME>",
        Password:"<YOUR PASSWORD>",
        Guard:"<YOUR GUARD CODE>",
    });

    if(Login.type==0){ // Logged In | Response Codes at SteamCMD.js
        console.log(Login);

        var AppDownload= await Cmd.AppUpdate({
            InstPath:"./GameFolder/",
            AppID:730,
            Validate:true,
            Cb:function(data){
                console.log(data)
            }
        })

        console.log(AppDownload);

    }else{
        console.log(Login);
    }

})()
