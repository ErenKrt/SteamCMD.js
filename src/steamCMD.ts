import path from 'path';
import { ISteamOptions } from './interfaces'
import fs from 'fs';
import pty, { IPty } from 'node-pty';

class steamCMD{
  private options: ISteamOptions;
  private client: IPty;
  constructor(options: ISteamOptions){
    if(!fs.existsSync(options.bin)){
      throw new Error(`${options.bin} cant find !`);
    }

    if(!fs.existsSync(path.join(path.dirname(options.bin), "/bin"))){
      throw new Error(`Please run SteamCMD for once !`);
    }
    this.options= options;
  }

  private listenOutput(callback: (e: string) => void){
    return new Promise((resolve, reject)=>{
      this.client.onData(callback);
    })
  }

  async create(){
    this.client= pty.spawn(this.options.bin, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env
    });

    await this.listenOutput((data)=>{ console.log(data); });
  }

  private listenClient(data){
    console.log(data);
  }
}
export default steamCMD;