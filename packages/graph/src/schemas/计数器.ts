import * as Joi from 'joi';
import { baseDslSchema, baseViewSchema } from './base';

const 单元格 = Joi.object({
  content: Joi.string().allow(''),
  是否强调: Joi.boolean(),
})
  .id('node')
  .unknown();

function getDslSchema() {
  return Joi.object({
    表格集: Joi.array().items(
      Joi.object({
        表体: Joi.array().items(Joi.array().items(单元格)),
      })
    ),
    是否隐藏数字: Joi.boolean(),
    显示读写: Joi.boolean(),
    中间符号: Joi.string().allow(''),
  })
    .unknown()
    .concat(baseDslSchema);
}
export const dslSchema = getDslSchema();

export const viewSchema = getDslSchema().concat(baseViewSchema);
