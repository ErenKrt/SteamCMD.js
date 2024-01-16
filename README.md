SteamCMD-Wrapper allows to you use [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) on [NodeJS](https://nodejs.org). You can use many features of SteamCMD and get command responses.
<div align="center">
    <a href="https://www.npmjs.com/package/SteamCMD.js">
        <img alt="Npm Page" src="https://img.shields.io/badge/SteamCMD.js-red?style=for-the-badge&logo=npm">
    </a>
    <br>
    <a href="https://github.com/ErenKrt/SteamCMD.js/issues">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues/ErenKrt/SteamCMD.js?style=for-the-badge">
    </a>
    <a href="https://github.com/ErenKrt/steamcmd.js/stargazers">
        <img alt="GitHub stars" src="https://img.shields.io/github/stars/ErenKrt/SteamCMD.js?style=for-the-badge">
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
> npm i steamcmd.js
```
Import
```js
import steamCMD from 'steamcmd.js';
```

## Features
<table>

<tr>
    <td><b>Commands</b></td>
    <td><b>SteamCMD.js</b></td>
    <td></td>
</tr>

<tr>
    <td>login</td>
    <td>✔️</td>
    <td>login</td>
</tr>
<tr>
    <td>force_install_dir</td>
    <td>✔️</td>
    <td>forceDir</td>
</tr>
<tr>
    <td>app_update</td>
    <td>✔️</td>
    <td>appUpdate</td>
</tr>
<tr>
    <td>workshop_download_item</td>
    <td>✔️</td>
    <td>workshopDownload</td>
</tr>

</table>



<br>

## Examples
- Windows
    ```js
    var sClient= new steamCMD({bin:"steamcmd.exe"})
    ```
- Linux

    ```js
    var sClient= new steamCMD({bin:"./steamcmd.sh"})
    ```

### Login
```js
await sClient.create();
var res= await sClient.login({
    username: "anonymous",
    //password: "",
    //code: ""
});
```

### Download App
```js
await sClient.create();

await sClient.forceDir({
    path: "E:\\Test"
});

var loginRes= await sClient.login({
    username: "anonymous",
});

var res= await sClient.appUpdate({
    id: "105600",
    cb: (data)=>{
        console.log(data);
    }
});
```

### Download Workshop
```js
await sClient.create();

await sClient.forceDir({
    path: "E:\\Test"
});

var loginRes= await sClient.login({
    username: "anonymous",
});

var res= await sClient.workshopDownload({
    id: "2005463692", // workshop item id
    appId: "602960"
});
```
<hr>

Developer: &copy; [ErenKrt](https://www.instagram.com/ep.eren/)