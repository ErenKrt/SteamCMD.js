import { IPty } from "node-pty";
import { CommandResponse, IWorkshopDownloadCommand } from "../interfaces";
import { waitForPatternInOutput } from "../helper";

export default async function execute(client: IPty, params: IWorkshopDownloadCommand): Promise<CommandResponse> {
    const appID= params.appId;
    const workshopID = params.id;

    client.write(`workshop_download_item ${appID} ${workshopID}\r`);

    const successRegex = /Success. Downloaded item .*/;
    const failureRegex = /ERROR! Download item .* failed \((.*?)\)./;

    return waitForPatternInOutput(client, successRegex, failureRegex);
}