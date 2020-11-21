const { default: Axios } = require("axios");
const path = require('path');
const fs= require('fs');
const ArchiveUtils =require('./Utils/Archive');

class Downloader{
    static GetDownloadInfo(){
        const DownInfo={
            Url:"",
            Os:"",
            FileName:"",
            BinName:""
        };

        switch(process.platform){
            case 'win32':
                DownInfo.Url="https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip";
                DownInfo.Os="win32";
                DownInfo.FileName="steamcmd.zip";
                DownInfo.BinName="steamcmd.exe";
            break;
            case 'linux':
                DownInfo.Url="https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz";
                DownInfo.Os="linux";
                DownInfo.FileName="steamcmd_linux.tar.gz";
                DownInfo.BinName="steamcmd.sh";
            break;
            case 'darwin':
                DownInfo.Url="https://steamcdn-a.akamaihd.net/client/installer/steamcmd_osx.tar.gz";
                DownInfo.Os="darwin";
                DownInfo.FileName="steamcmd_osx.tar.gz";
                DownInfo.BinName="steamcmd.sh";
            break;
            default:
                throw new Error("Your platform "+process.platform+" not supported yet !");
        }

        return DownInfo;
    }
    static async GetMaxSize(){
        var {Url} = this.GetDownloadInfo();

        var CancelToken = Axios.CancelToken.source();

        try {
            var {data,headers} = await Axios({
                url:Url,
                method:'get',
                responseType:'stream',
                cancelToken:CancelToken
            });

            var Size= headers['content-length'];

            CancelToken.cancel();

            return Size;
        } catch (error) {
            throw new Error(error);
        }
    }
    static async Download(DownPath,Cb=null){
        const {FileName,Url,BinName} = this.GetDownloadInfo();
        const DownloadedArchive= path.resolve(path.join(DownPath,FileName));

        if(fs.existsSync(DownPath)==false){
            fs.mkdirSync(DownPath);
        }

        try {
            var {data,headers} = await Axios({
                url:Url,
                method:'GET',
                responseType:'stream'
            });
        } catch (error) {
            throw new Error(error);
        }

        var TS= Number(headers["content-length"]);

        const Writer= fs.createWriteStream(DownloadedArchive)
        let DownloadedSize=0;

        if(Cb!= null && typeof Cb =="function"){
            var UpdateSize= function(chunk){
                DownloadedSize+=chunk.length;
                Cb({Current:DownloadedSize,Max:TS});
            };

            data.on('data',UpdateSize);
        }
        data.pipe(Writer);

        var IsOk=false;

        var Ender= async function(){
            IsOk=true;

            data.removeListener('end',Ender);
            if(Cb!= null && typeof Cb =="function"){
                data.removeListener('data',UpdateSize);
            }
            
            await ArchiveUtils.UnArchiveAndDelete(DownloadedArchive,path.resolve(DownPath));
            
        }

        data.on('end',Ender);

        return new Promise(async function(resolve, reject) {
            var Int=setInterval(() => {
                if(IsOk){
                    resolve(path.resolve(path.join(DownPath,BinName)));
                    clearInterval(Int);
                }    
            }, 500);

        });
    }
}

module.exports=Downloader;