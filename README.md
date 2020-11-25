SteamCMD-Wrapper allows to you use [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) on [NodeJS](https://nodejs.org). You can use many features of SteamCMD and get command responses.
<div align="center">
    <a href="https://www.npmjs.com/package/steamcmd-wrapper">
        <img alt="Npm Page" src="https://img.shields.io/badge/steamcmd--wrapper-red?style=for-the-badge&logo=npm">
    </a>
    <br>
    <a href="https://github.com/ErenKrt/Node-SteamCMD/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/ErenKrt/Node-SteamCMD?style=for-the-badge">
    </a>
    <a href="https://github.com/ErenKrt/Node-SteamCMD/stargazers">
        <img alt="GitHub stars" src="https://img.shields.io/github/stars/ErenKrt/Node-SteamCMD?style=for-the-badge">
    </a>
</div>
<div align="center">
  <sub>Built with ❤︎ by
  <a href="https://instagram.com/ep.eren/">EpEren</a>
</div>
<hr>
<div align="center">
  <h4>
  |
    <a href="#usage">
      Usage
    </a>
    •
     <a href="#examples">
      Examples
    </a>
    •
    <a href="#usage-examples">
      Usage examples
    </a>
    •
    <a href="#features">
      Features
    </a>
    |
  </h4>
</div>

## Usage
With [npm](https://npmjs.org/) installed, run
<br>
```sh
> npm install steamcmd-wrapper
```
Import
```js
const {SteamCMD,Downloader} = require('steamcmd-wrapper');
```

## Features
<table>

<tr>
    <td><b>SteamCmd Commands</b></td>
    <td><b>Avaible at Wrapper</b></td>
    <td></td>
</tr>

<tr>
    <td>login</td>
    <td>✔️</td>
    <td>Login</td>
</tr>
<tr>
    <td>app_update</td>
    <td>✔️</td>
    <td>AppUpdate</td>
</tr>
<tr>
    <td>workshop_download_item</td>
    <td>✔️</td>
    <td>WorkshopDownload</td>
</tr>
<tr>
    <td>exit</td>
    <td>✔️</td>
    <td>Exit</td>
</tr>

</table>



<br>

## Examples
Ready to work !
- Windows

    ```js
    var Wrapper= new SteamCMD({BinDir:"steamcmd.exe"})
    ```
- Linux

    ```js
    var Wrapper= new SteamCMD({BinDir:"./steamcmd.sh"})
    ```

```js
(async function(){
    await Wrapper.Create(function(data){
        console.log(data)
    })
})()
```
## Usage Examples
### Login
- (1)

    ```js
    var Login= await Wrapper.Login({
        Username:"<YOUR NAME>",
        Password:"<YOUR PASS>",
        Guard:"<YOUR GUARD CODE>",
    });
    if(Login.type==0){
        // Work area
    }else{
        console.log(Login.message);
    }
    ```

- [ShowCode](https://github.com/ErenKrt/Node-SteamCMD-examples/blob/master/Login.js) (2)
    <img src="https://raw.githubusercontent.com/ErenKrt/Node-SteamCMD-examples/master/gifs/login.gif">

### Download App
- (1)

    ```js

    function CallBackForDownload(data){
        console.log(data)
    }

    var DownloadAPP= await Wrapper.AppUpdate(
        {
            InstPath:"example/gamefolder/",
            AppID:610360,
            Validate:true,
            cb:CallBackForDownload
        }
    )
    ```
- [Show Code](https://github.com/ErenKrt/Node-SteamCMD-examples/blob/master/DownloadGame.js) (2)
    <img src="https://raw.githubusercontent.com/ErenKrt/Node-SteamCMD-examples/master/gifs/downloadgame.gif">

### Download SteamCMD
- (1)
    ```js

    var Down= await Downloader.Download("./test/",function(data){
        console.log(data);
    });

    console.log("Downloaded !");
    ```
- [Show Code](https://github.com/ErenKrt/Node-SteamCMD-examples/blob/master/DownloadSteamCMD.js) (2)
    <img src="https://raw.githubusercontent.com/ErenKrt/Node-SteamCMD-examples/master/gifs/downladsteamcmd.gif">

<br>
<hr>

Developer: &copy; [ErenKrt](https://www.instagram.com/ep.eren/)