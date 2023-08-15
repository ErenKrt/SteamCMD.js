import { test } from 'vitest'
import steamCMD from './index'

var client= new steamCMD({ bin: "D:\\Tools\\steam\\steamcmd.exe" });

test("a",async ()=>{
    await client.create();
});

console.log(client);