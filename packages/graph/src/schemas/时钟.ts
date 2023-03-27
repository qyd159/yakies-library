import * as Joi from 'joi';
import { baseDslSchema, baseViewSchema } from './base';

const 角集 = Joi.object({
  from: Joi.number().max(360).min(0).default(0),
  to: Joi.number().max(360).min(0).required(),
  longR: Joi.boolean().default(false),
  angleName: Joi.string().default('锐角'),
  辅助线: Joi.array().items(Joi.number().max(360).min(0)),
  直角: Joi.boolean().default(false),
}).unknown();

function getDslSchema() {
  return Joi.object({
    时: Joi.number().required().max(360).min(0).default(0),
    分: Joi.number().required().max(360).min(0).default(0),
    秒: Joi.number().max(360).min(0).default(0),
    显示秒针: Joi.boolean().default(false),
    显示指针名: Joi.boolean().default(false),
    大刻度: Joi.boolean().default(false),
    小刻度: Joi.boolean().default(false),
    显示角: Joi.array().items(角集),
    move: Joi.object({
      时: Joi.number().required().max(360).min(0).default(0),
      分: Joi.number().required().max(360).min(0).default(0),
      outside: Joi.boolean().default(false),
      inside: Joi.boolean().default(false),
    }),
  })
    .unknown()
    .concat(baseDslSchema);
}
export const dslSchema = getDslSchema();

export const viewSchema = getDslSchema().concat(baseViewSchema);
