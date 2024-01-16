import { expect, test } from 'vitest'
import client from '../src'



test('Update 105600', async() => {
    const sClient= new client({
        bin: "D:\\Tools\\steam\\steamcmd.exe"
    });
    await sClient.create();

    await sClient.login({
        username: "anonymous"
    });

    var res= await sClient.appUpdate({
        id: "105600",
        cb: (data)=>{
            console.log(data);
        }
    });

    console.log(res);

    expect(res.success).toBe(true);
}, {
    timeout: 0
})
