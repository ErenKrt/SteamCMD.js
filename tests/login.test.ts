import { expect, test } from 'vitest'
import client from '../src'



test('Login as anonymous', async() => {
    const sClient= new client({
        bin: "D:\\Tools\\steam\\steamcmd.exe"
    });
    await sClient.create();
    var res= await sClient.login({
        username: "anonymous"
    });

    expect(res.success).toBe(true);
}, {
    timeout: 0
})

test('Login as wrong creds', async() => {
    const sClient= new client({
        bin: "D:\\Tools\\steam\\steamcmd.exe"
    });
    await sClient.create();
    var res= await sClient.login({
        username: "testUser",
        password: "none"
    });

    expect(res.success).toBe(false);
}, {
    timeout: 0
})