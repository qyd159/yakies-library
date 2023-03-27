import 树状图 from './图形/树状图';
import 韦恩图 from './图形/韦恩图';
import 数位顺序表 from './图形/数位顺序表';
import 分数展示器 from './图形/分数展示器';
import 计数器 from './图形/计数器';
import 时钟 from './图形/时钟';
import 基本图形 from './common/图形';

export * from './utils';

export * from './consts/enums';

const 图形集 = {
  树状图,
  韦恩图,
  数位顺序表,
  分数展示器,
  计数器,
  时钟,
};

export { 图形集, 基本图形 };

export * from './杂项';
