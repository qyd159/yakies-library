import * as Joi from 'joi';
import { baseDslSchema, baseViewSchema } from './base';

const 单元格 = Joi.object({
  content: Joi.string().allow(''),
  是否强调: Joi.boolean().default(false),
  children: Joi.array().items(Joi.link('#node')),
})
  .id('node')
  .unknown();

function getDslSchema() {
  return Joi.object({
    表格: Joi.object({
      表头: Joi.array().items(单元格),
      表体: Joi.array().items(Joi.array().items(单元格)),
    }),
  })
    .unknown()
    .concat(baseDslSchema);
}
export const dslSchema = getDslSchema();

export const viewSchema = getDslSchema().concat(baseViewSchema);
