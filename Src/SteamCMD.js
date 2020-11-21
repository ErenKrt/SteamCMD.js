const NodePty = require('node-pty');
const path= require('path');
const fs= require('fs');

const ClearText= (text)=>{
    return text.replace(/\s{2,}/g, '').replace('\n').replace('\r').trim();
}

class SteamCMD{
    constructor({BinDir}){
        this._BinDir= BinDir;
        this._Pty=null;
    }

    async Create(Cb){
        var IsUpdating=false;

        var UpdateRegex= new RegExp(/\[(.*)%\] Downloading update \((.*) of (.*) KB\).../);
        var UpdateDone= new RegExp(/[100%] Download Complete./);
        var LodingSteamAPI= new RegExp(/Loading Steam API.../);
        var OKRegex= new RegExp(/OK./);
        var IsLoding=false;

        this._Pty= NodePty.spawn(this._BinDir);
        var Vm= this;
        return new Promise(function(resolve,reject){

            var Dinle= (data)=>{
                var CleanedText= ClearText(data);
                if(UpdateRegex.test(CleanedText)){
                    IsUpdating=true;
                    var Esle= UpdateRegex.exec(CleanedText);
                    Cb({type:"UpdateDownloading",data:{percent:Number(Esle[1]),current:Number(Esle[2].replace(',','')),max:Number(Esle[3].replace(',',''))}});
                }else if(IsUpdating && UpdateDone.test(CleanedText)){
                    Cb({type:"UpdateDownloaded",data:{percent:100,message:"Download Complete."}});
                }else if(LodingSteamAPI.test(CleanedText)){
                    IsLoding=true;
                }else if(IsLoding && OKRegex.test(CleanedText)){
                    Vm._Pty.removeListener('data',Dinle);
                    resolve();
                    Cb({type:"Launched"});
                }
            }
            
            Vm._Pty.on('data',Dinle);
        })
    }

    async ExecuteComamnd(Command,ResponseRegexs,CallBack){

        var Dinle= (data)=>{
            var ClearedData= ClearText(data);
            //console.log(ClearedData);
            if(ResponseRegexs!=null && CallBack!=null){
                ResponseRegexs.forEach(CurrentResponseRegex => {
                    if(CurrentResponseRegex.test(ClearedData)){
                        CallBack(CurrentResponseRegex.exec(ClearedData),Dinle);
                    }
                });
            }
        };

        this._Pty.on("data",Dinle);
        this._Pty.write(Command+"\r");
    }

    async Login({Username,Password,Guard}){
        var LoginCommand= "login "+Username+" "+Password+" "+Guard;
        var Regexs= [];
        Regexs.push(new RegExp(/FAILED login with result code (.*)/));
        Regexs.push(new RegExp(/(Logged in OK)/));
        Regexs.push(new RegExp(/(Waiting) for user info.../));
        Regexs.push(new RegExp(/Logging in user '(.*)' to Steam Public .../));
        Regexs.push(new RegExp(/(?!^Logged in$)(^OK$)/));

        var Response="";
        var Vm=this;
        var Listener= null;
        this.ExecuteComamnd(LoginCommand,Regexs,function(data,listener){
            Listener=listener;
            if(data[1]=="OK"){
                Response= {type:"success",message:data[0]};
            }else if(data[1]=="Two-factor code mismatch"){
                Response= {type:"error",message:data[0]};
            }else if(data[1]=="Invalid Password"){
                Response= {type:"error",message:data[0]};
            }else if(data[1]=="Rate Limit Exceeded"){
                Response= {type:"error",message:data[0]};
            }
        });

        return new Promise(function (resolve,reject) {
            var Int= setInterval(() => {
                if(Response!=""){
                    Vm._Pty.removeListener('data',Listener);
                    clearInterval(Int);
                    resolve(Response);
                }
            }, 500);
        })
    }
    async AppUpdate({InstPath,AppID,BetaName,BetaPass,Validate=false,Cb}){
        var UpdateCommand="app_update "+AppID+" ";
        if(BetaName!=undefined && BetaName!="" && BetaPass!=undefined && BetaPass!=""){
            UpdateCommand+="-beta "+BetaName+" -betapassword "+BetaPass+" ";
        }else if (BetaName!=undefined && BetaName!=""){
            UpdateCommand+="-beta "+BetaName+" ";
        }
        if(Validate){
            UpdateCommand+="validate";
        }

        if(!fs.existsSync(InstPath)){
            fs.mkdirSync(InstPath);
        }

        this.ExecuteComamnd("force_install_dir "+path.resolve(InstPath),null,null);

        var Regexs=[];

        Regexs.push(new RegExp(/Update state \((.*)\) (.*), progress: (.*) \((.*) \/ (.*)\)/));
        Regexs.push(new RegExp(/()(Success!) App '(.*)' fully installed./));
        Regexs.push(new RegExp(/()(Failed) to install app/));
        Regexs.push(new RegExp(/()(Failed) to request AppInfo update/));
        var Response= "";
        var Listener;
        this.ExecuteComamnd(UpdateCommand,Regexs,function (data,listener) {
            Listener=listener;
            
            if(data[2]=="Success!"){
                Response= {type:"success",message:data[0]};
            }else if(data[2]=="Failed"){
                Response= {type:"error",message:data.input};
            }else{
                Cb({state:data[1],type:data[2],percent:data[3],current:data[4],max:data[5]});
            }

        });
        var Vm=this;
        return new Promise(function (resolve,reject) {
            var Int= setInterval(() => {
                if(Response!=""){
                    Vm._Pty.removeListener('data',Listener);
                    clearInterval(Int);
                    resolve(Response);
                }
            }, 500);
        })

    }
    Exit(){
        this._Pty.kill();
        this._Pty=null;
        delete this._Pty;
    }
}

module.exports= SteamCMD;