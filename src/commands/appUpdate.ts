import { IPty } from "node-pty";
import { CommandResponse, IAppUpdateCommand } from "../interfaces";
import { waitForPatternInOutput } from "../helper";

export default async function execute(client: IPty, params: IAppUpdateCommand): Promise<CommandResponse> {
    const appID= params.id;

    client.write(`app_update ${appID}\r`);

    const successRegex = /Success! App '.*'/;
    const failureRegex = /ERROR! Failed to install app '.*' \((.*?)\)/;
    const infoRegex= /Update state \((.*?)\) (.*?), (.*?): (.*?) \((.*?) \/ (.*?)\)/;


    return waitForPatternInOutput(client, successRegex, failureRegex, infoRegex, (regexAry)=>{
        if (typeof params.cb === 'function') {
            params.cb({
                progress: regexAry[4],
                status: regexAry[3],
                downloaded: regexAry[5],
                total: regexAry[6],
            });
        }
    });
}