import * as Joi from 'joi';
import { baseDslSchema, baseViewSchema } from './base';
import { getNextId } from '../utils';

function getDslSchema() {
  const 概括 = Joi.object({
    id: Joi.string()
      .meta({ hidden: true })
      .default(getNextId)
      .failover((value) => {
        if (!value.id) {
          value.id = getNextId();
        }
        return value.id;
      }),
    位置: Joi.string().valid('上', '下', '左', '右').default('上'),
    偏移: Joi.number().default(0),
    // 宽度以单元格基准尺寸为单位
    宽度: Joi.number().default(1),
    内容: Joi.string().meta({ type: 'mathexpression' }),
    内容富文本: Joi.array().items(Joi.string()),
    前缀: Joi.string().description('与前一个分数表格相接的符号，一般为加号或等号（+=）'),
    前缀富文本: Joi.array().items(Joi.string()),
    formula: Joi.number().default(1).valid(1, 2, 3).description('属于算式里的第几个参数'),
  });
  return Joi.object({
    分数表格: Joi.array()
      .items(
        Joi.object({
          名称: Joi.string().required(),
          行数: Joi.number().required().min(1).max(6),
          列数: Joi.number().required().min(1).max(10),
          单元格尺寸: Joi.object({
            宽: Joi.number().default(30),
            高: Joi.number().default(30),
          }),
          弱强调区域: Joi.array().items(
            Joi.object({
              开始位置: Joi.string().default('0,0'),
              结束位置: Joi.string().default('0,0'),
            })
          ),
          高强调区域: Joi.array().items(
            Joi.object({
              开始位置: Joi.string().default('0,0'),
              结束位置: Joi.string().default('0,0'),
            })
          ),
          概括集: Joi.array().items(概括),
        })
      )
      .min(1)
      .max(5),
    全局概括: Joi.array().items(
      Joi.object({
        位置: Joi.string().valid('上', '下').default('下'),
        内容: Joi.string().meta({ type: 'mathexpression' }),
        内容富文本: Joi.array().items(Joi.string()),
      })
    ),
    动画: Joi.object({
      动画: Joi.boolean().default(false),
      type: Joi.number().valid(1, 2, 3).default(1).description('对应加减乘这三种动画类型'),
      算式: Joi.string().default(''),
    }),
  })
    .unknown()
    .concat(baseDslSchema);
}
export const dslSchema = getDslSchema();

export const viewSchema = getDslSchema().concat(baseViewSchema);
