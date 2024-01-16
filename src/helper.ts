import { IPty } from 'node-pty';
import { CommandResponse } from './interfaces';


export async function waitForPatternInOutput(
  client: IPty,
  successPattern: RegExp,
  failurePattern?: RegExp,
  callbackPattern?: RegExp,
  callback?: (matches: RegExpExecArray) => void
): Promise<CommandResponse> {
  return new Promise<CommandResponse>((resolve, reject) => {
      const listener = client.onData((data: string) => {

          if (callbackPattern && callback&& callbackPattern.test(data)) {
              callback(callbackPattern.exec(data) as RegExpExecArray);
          }

          if (successPattern.test(data)) {
              listener.dispose();
              resolve({ success: true, message: "Successful", data: null });
          } else if (failurePattern && failurePattern.test(data)) {
              const match = failurePattern.exec(data);
              const failureMessage = match ? match[1] : "Failed with unknown error";
              listener.dispose();
              resolve({ success: false, message: failureMessage, data: null });
          }
      });
  });
}