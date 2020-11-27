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

        var WorkShopDownload= await Cmd.WorkshopDownload({
            AppID:730,
            WorkshopID:308490450,
            Cb:function(data){
                console.log(data);
            }
        });

        console.log(WorkShopDownload);

    }else{
        console.log(Login);
    }

})()
