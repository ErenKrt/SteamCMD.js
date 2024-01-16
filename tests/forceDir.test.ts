import { expect, test } from 'vitest'
import client from '../src'

test('Force dir and download workshop', async() => {
    const sClient= new client({
        bin: "D:\\Tools\\steam\\steamcmd.exe"
    });
    await sClient.create();

    await sClient.forceDir({
        path: "E:\\Test"
    });

    await sClient.login({
        username: "anonymous"
    });

    var res= await sClient.workshopDownload({
        id: "2005463692",
        appId: "602960"
    });

    expect(res.success).toBe(true);
}, {
    timeout: 0
})
