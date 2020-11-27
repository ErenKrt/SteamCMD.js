const {Downloader} = require("../Src/Wrapper");

(async function (){

    var Download= await Downloader.Download("./test31/",function(data){
        console.log(data);
    });

    console.log(Download);
})()
