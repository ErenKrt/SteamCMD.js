import index from './index'
import { expect, test } from 'vitest';

test('index test',()=>{
    expect(index.sum(4, 7)).toBe(11);
})