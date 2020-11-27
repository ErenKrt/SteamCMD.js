const NodePty= require('node-pty');
const Helpers= require('./Utils/Helpers');

const ReturnTypes= Object.freeze(
    {
        Success:0,
        Error:1,
        Info:2,
        Warning:3
    }
);

const LoginTypes= Object.freeze(
    {
        LoggedIn:0,
        InvalidPass:1,
        TwoFactor:2,
        RateLimit:3
    }
)
const AppUpdateTypes= Object.freeze(
    {
        Success:0,
        FailInstall:1,
        FailAppInfo:2
    }
)
const WorkShopTypes= Object.freeze(
    {
        Downloaded:0,
        LoggedOn:1,
        AccessDenied:2,
        NotFound:4
    }
)


class SteamCMD{

    constructor(Settings={Bindir:"",Debug:false}){
        this._Settings=Settings;
        this._Created=false;
        this._Pty=null;
        if(this._Settings.Bindir==""){
            throw new Error("Bindir cannot be empty");
        }
    }

    async ExecuteComamnd(Command,Regexs,Cb){
        if(this._Created==false){
            return new Error("SteamCMD not created yet!")
        }

        var Listen= (data)=>{
        var ClearedData= Helpers.ClearText(data);
            if(this._Settings.Debug) console.log(ClearedData);
            Regexs.forEach(CRegex=>{
                if(CRegex[1].test(ClearedData)){
                    var Exec= CRegex[1].exec(ClearedData);
                    if(CRegex[0]==false){
                        if(Cb!=null && typeof Cb =="function"){
                            Cb(Exec);
                        }
                    }else{
                        Response= Exec;
                    }
                }
            });
        };
        var Response="";
        if(Regexs!=null){
            this._Pty.on("data",Listen);
        }
        
        this._Pty.write(Command+"\r");

        var Vm=this;
        return new Promise(function (resolve,reject) {
            var Int= setInterval(() => {
                if(Response!=""){
                    Vm._Pty.removeListener('data',Listen);
                    clearInterval(Int);
                    resolve(Response);
                }
            }, 500);
        })
    }


    async Create(CallBack=null){
        var IsUpdating=false;

        var UpdateRegex= Helpers.CreateRegex(/\[(.*)%\] Downloading update \((.*) of (.*) KB\).../);
        var UpdateDone= Helpers.CreateRegex(/[100%] Download Complete./);
        var LodingSteamAPI= Helpers.CreateRegex(/Loading Steam API.../);
        var OKRegex= Helpers.CreateRegex(/OK./);

        var IsLoding=false;
        this._Pty= NodePty.spawn(this._Settings.Bindir);
        var Vm= this;
        return new Promise(function(resolve,reject){

            var Dinle= (data)=>{
                var CleanedText= Helpers.ClearText(data);
                if(UpdateRegex.test(CleanedText)){
                    IsUpdating=true;
                    var Esle= UpdateRegex.exec(CleanedText);
                    if(CallBack!=null && typeof CallBack=="function") CallBack({type:"UpdateDownloading",data:{percent:Number(Esle[1]),current:Number(Esle[2].replace(',','')),max:Number(Esle[3].replace(',',''))}});
                }else if(IsUpdating && UpdateDone.test(CleanedText)){
                    if(CallBack!=null && typeof CallBack=="function") CallBack({type:"UpdateDownloaded",data:{percent:100,message:"Download Complete."}});
                }else if(LodingSteamAPI.test(CleanedText)){
                    IsLoding=true;
                }else if(IsLoding && OKRegex.test(CleanedText)){
                    Vm._Created=true;
                    Vm._Pty.removeListener('data',Dinle);
                    resolve({type:ReturnTypes.Success});
                }
            }
            
            Vm._Pty.on('data',Dinle);
        })

    }

    async Login({Username,Password,Guard=""}){
        var LoginCommand= "login "+Username+" "+Password;
        if(Guard!=""){
            LoginCommand+=" "+Guard;
        }
        var Regexs= [];
        Regexs.push(Helpers.CreateCondition(true,/(FAILED) login with result code (.*)/));
        Regexs.push(Helpers.CreateCondition(false,/(Logged in OK)/));
        Regexs.push(Helpers.CreateCondition(false,/(Waiting) for user info.../));
        Regexs.push(Helpers.CreateCondition(false,/Logging in user '(.*)' to Steam Public .../));
        Regexs.push(Helpers.CreateCondition(true,/(?!^Logged in$)(^OK$)/));

        var Response= await this.ExecuteComamnd(LoginCommand,Regexs,null);
        if(Response[1]=="OK"){
            return {type:ReturnTypes.Success,message:Response[1]}
        }else if (Response[1]=="FAILED"){
            var Dondur={type:ReturnTypes.Error,data:{message:Response[2]}};
            
            if(Response[2]=="Two-factor code mismatch"){
               Dondur.data.type=LoginTypes.TwoFactor;
            }else if(Response[2]=="Invalid Password"){
                Dondur.data.type=LoginTypes.InvalidPass;
            }else if(Response[2]=="Rate Limit Exceeded"){
                Dondur.data.type=LoginTypes.RateLimit;
            }
            
            return Dondur; 
        }
    }

    async AppUpdate({InstPath,AppID,BetaName="",BetaPass="",Validate=false,Cb=null}){
        var UpdateCommand="app_update "+AppID+" ";
        if(BetaName!=undefined && BetaName!="" && BetaPass!=undefined && BetaPass!=""){
            UpdateCommand+="-beta "+BetaName+" -betapassword "+BetaPass+" ";
        }else if (BetaName!=undefined && BetaName!=""){
            UpdateCommand+="-beta "+BetaName+" ";
        }
        if(Validate){
            UpdateCommand+="validate";
        }

        if(!Helpers.IsExits(InstPath)){
            Helpers.CreateDir(InstPath);
        }

        this.ExecuteComamnd("force_install_dir "+Helpers.GetFullPath(InstPath),null,null);

        var Regexs=[];

        Regexs.push(Helpers.CreateCondition(false,/Update state \((.*)\) (.*), progress: (.*) \((.*) \/ (.*)\)/));
        Regexs.push(Helpers.CreateCondition(true,/()(Success!) App '(.*)' fully installed./));
        Regexs.push(Helpers.CreateCondition(true,/()(Failed) to (install) app/));
        Regexs.push(Helpers.CreateCondition(true,/()(Failed) to (request) AppInfo update/));
        
        var Response= await this.ExecuteComamnd(UpdateCommand,Regexs,function(data){
            if(Cb!=null && typeof Cb=="function") Cb({type:ReturnTypes.Info,data:{state:data[1],type:data[2],percent:data[3],current:data[4],max:data[5]}});
        })
        
        if(Response[2]=="Success!"){
            return {type:ReturnTypes.Success,message:Response[0]}
        }else if(Response[2]=="Failed"){

            var Dondur={type:ReturnTypes.Error,data:{message:Response.input}};

            if(Response[3]=="install"){
                Dondur.data.type=AppUpdateTypes.FailInstall;
            }else if(Response[3]=="request"){
                Dondur.data.type=AppUpdateTypes.FailAppInfo;
            }

            return Dondur;
        }
    }

    async WorkshopDownload({AppID,WorkshopID,Cb=null}){
        if(AppID=="" || WorkshopID=="") return {type:"error",message:"Please write your AppID and WorkshopID"}

        var DownloadCommand="workshop_download_item "+AppID+" "+WorkshopID;

        var Regexs=[];
        Regexs.push(Helpers.CreateCondition(false,/Downloading item (.*) .../));
        Regexs.push(Helpers.CreateCondition(true,/(ERROR!) Not (logged on)./))
        Regexs.push(Helpers.CreateCondition(true,/(ERROR!) Download item .* failed \(Access Denied\)./));
        Regexs.push(Helpers.CreateCondition(true,/(Success.) Downloaded item .* to "(.*)" \((.*)bytes\)/));
           
        var Response=await this.ExecuteComamnd(DownloadCommand,Regexs,function(data){
            if(Cb!=null && typeof Cb=="function") Cb({type:ReturnTypes.Info,data:{id:data[1]}})
        });

        if(Response[1]=="Success."){
            return {type:ReturnTypes.Success,message:{path:Response[2],byte:Number(Response[3])}}
        }else if(Response[1]=="ERROR!"){
            var Dondur={type:ReturnTypes.Error,data:{message:Response[0]}};

            if(Response[2]=="logged on"){
                Dondur.data.type=WorkShopTypes.LoggedOn
            }else if(Response[3]=="Access Denied"){
                Dondur.data.type=WorkShopTypes.AccessDenied;
            }
    
            return Dondur;

        }

    }

    Exit(){
        this._Pty.kill();
        this._Pty=null;
        delete this._Pty;
    }
}


module.exports=SteamCMD;