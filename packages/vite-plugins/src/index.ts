import MagicString from 'magic-string'; // 用于修改代码和sourcemap
import { Plugin } from 'vite';
import path from 'path';

export const moduleComment: Plugin = {
  name: 'module-comment',
  transform(code, id) {
    if (!id.includes('node_modules')) {
      return null;
    }

    const magicCode = new MagicString(code);
    const relativePath = path.relative(process.cwd(), id);
    const moduleComment = `// Module: ${relativePath}\n`;

    magicCode.prepend(moduleComment);

    return {
      code: magicCode.toString(),
      map: magicCode.generateMap({ hires: true }),
    };
  },
};
