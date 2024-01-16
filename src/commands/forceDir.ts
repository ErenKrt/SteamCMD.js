import { IPty } from "node-pty";
import { CommandResponse, IForceDirCommand } from "../interfaces";
import { waitForPatternInOutput } from "../helper";

export default async function execute(client: IPty, params: IForceDirCommand) {
    const path= params.path;

    client.write(`force_install_dir ${path}\r`);
}