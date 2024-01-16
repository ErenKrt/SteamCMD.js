import { IPty } from 'node-pty';
import { waitForPatternInOutput } from '../helper';
import { CommandResponse, ILoginCommand } from '../interfaces';

export default async function execute(client: IPty, params: ILoginCommand): Promise<CommandResponse> {
    const username = params.username;
    const password = params.password ?? '';
    const code = params.code ?? '';

    client.write(`login ${username} ${password} ${code}\r`);

    const successRegex = /Waiting for user info...OK/;
    const failureRegex = /FAILED \((.+)\)/;

    return waitForPatternInOutput(client, successRegex, failureRegex);
}