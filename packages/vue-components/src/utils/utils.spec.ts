import { beforeEach, it, expect } from 'vitest';
import { splitText } from './'

it('通过多个标点符号分割文本', () => {
  const result = splitText('发生、、阿斯顿发生、、发生的', '，、； '.split(''))
  expect(result).toEqual(['发生', '阿斯顿发生', '发生的'])
})
