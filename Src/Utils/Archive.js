const path= require('path');
const fs= require('fs');

const tar =require('tar');
const extractZip  = require('extract-zip');

module.exports= {
    GetFiles: function(SpecPath){
        return fs.readdirSync(SpecPath,"utf-8");
    },
    UnZip: async function(File,OutputPath){
        return new Promise(async function(resolve, reject) {
            extractZip(File,{dir:path.resolve(OutputPath)})
            .then(resolve);
        });
    },
    UnTar: async function(File,OutputPath){
        return new Promise(async function(resolve, reject) {
            tar.extract({
                cwd:path.resolve(OutputPath),
                strict:true,
                file:File
            }).then(resolve);
        });
    },
    UnArchive:async function(File,OutputPath){
        var FileFormat= (path.extname(File)).replace('.','');

        if(FileFormat=="zip"){
            await this.UnZip(File,OutputPath);
        }else if(FileFormat=="gz"){
            await this.UnTar(File,OutputPath);
        }

        return this.GetFiles(OutputPath);
    },
    UnArchiveAndDelete: async function(File,OutputPath){
        var Files= await this.UnArchive(File,OutputPath);
        fs.unlinkSync(File);
        Files.splice(Files.indexOf(path.basename(File)),1);
        
        return Files; 
    }
}