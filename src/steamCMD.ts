import fs from 'fs';
import path from 'path';
import { waitForPatternInOutput } from './helper'
import * as pty from 'node-pty';
import { IAppUpdateCommand, IForceDirCommand, ILoginCommand, ISteamOptions, IWorkshopDownloadCommand } from './interfaces';

import loginCommand from './commands/login'
import appUpdateCommand from './commands/appUpdate'
import workshopDownloadCommand from './commands/workshopDownload'
import forceDirCommand from './commands/forceDir'


class SteamCMD {
  private options: ISteamOptions;
  private client: pty.IPty;

  constructor(options: ISteamOptions) {
    this.validateOptions(options);
    this.options = options;
    this.client = this.initializeClient();
  }

  private validateOptions(options: ISteamOptions): void {
    if (!fs.existsSync(options.bin)) {
      throw new Error(`${options.bin} cannot be found!`);
    }

    const binDirectory = path.dirname(options.bin);
    if (!fs.existsSync(path.join(binDirectory, "/bin"))) {
      throw new Error(`Please run SteamCMD at least once!`);
    }
  }

  private initializeClient(): pty.IPty {
    return pty.spawn(this.options.bin, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env,
    });
  }

  public async create(): Promise<void> {
    await this.client.resume();
    const readyRegex = /OK/;
    await waitForPatternInOutput(this.client, readyRegex);
    await this.client.pause();
  }

  private async executeCommand<T>(command: (client: pty.IPty, params: T) => Promise<any>, params: T): Promise<any> {
    await this.client.resume();
    const result = await command(this.client, params);
    await this.client.pause();
    return result;
  }

  public async login(params: ILoginCommand): Promise<any> {
    return this.executeCommand(loginCommand, params);
  }

  public async appUpdate(params: IAppUpdateCommand): Promise<any> {
    return this.executeCommand(appUpdateCommand, params);
  }

  public async workshopDownload(params: IWorkshopDownloadCommand): Promise<any> {
    return this.executeCommand(workshopDownloadCommand, params);
  }

  public async forceDir(params: IForceDirCommand): Promise<any> {
    return this.executeCommand(forceDirCommand, params);
  }

  public close(): void {
    this.client.kill();
  }
}

export default SteamCMD;