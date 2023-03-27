import 基本图形 from '../common/图形';
import { 时钟 } from '../common/图元';
import { dslSchema, viewSchema } from '../schemas/时钟';

export default class 时钟图形 extends 基本图形 {
  static 类名 = '时钟图形';
  static dslSchema = dslSchema;
  static viewSchema = viewSchema;
  data: 时间;
  时钟: 时钟;
  constructor(data) {
    super(data);
    this.时钟 = new 时钟(data, this);
  }

  async 布局(limitedWidth) {
    return {
      dimensions: [320, 320],
    };
  }

  get 布局图元集() {
    return [this.时钟];
  }
  start() {
    this.时钟.start();
  }
  布局后处理() {
    if (this.move.inside || this.move.outside) this.start();
    super.布局后处理();
  }
}
