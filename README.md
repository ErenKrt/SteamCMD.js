# Node SteamCMD Wrapper
If your NodeJS supports sub library(s) you can use this library for access the [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) from NodeJS.

### Information
> Builded with v12.18.4 of NodeJS.

### Basic setup
```sh
npm install node-steamcmd
```
### Import library & ready to work
```js
var {SteamCMD} = require('node-steamcmd');

(async function(){
    var Cmd= new SteamCMD({BinDir:"steamcmd.exe"}); // Windows 
    //var Cmd= new SteamCMD({BinDir:"./steamcmd.sh"}); | Linux | Mac

    await Cmd.Create(function(data){
        // if statements of data.type ("UpdateDownloading","UpdateDownloaded","Launched")
        //data: {type:"UpdateDownloading",data:{percent:5,current:100,max:1000}}
        //data: {type:"UpdateDownloaded",data:{percent:100,message:"Download Complete."}}
        //data: {type:"Launched"} | Ready to GO
        console.log(data);
    })
})
```
> [More example](https://github.com/ErenKrt/Node-SteamCMD/Examples)
---
Developer: &copy; [ErenKrt](https://www.instagram.com/ep.eren/)
