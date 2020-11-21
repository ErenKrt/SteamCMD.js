var {Downloader} = require('../Src/Wrapper');


(async function(){
    var GetMaxSizeOfSteamCmdArchive= await Downloader.GetMaxSize();
    var GetInfoSteamCMDArchive= Downloader.GetDownloadInfo();

    var Down= await Downloader.Download("./test/",function(data){
        console.log(data);
    });

    console.log("Downloaded !");
})();