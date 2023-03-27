import * as Joi from 'joi';
import { baseDslSchema, baseViewSchema } from './base';
import { batchCreate, getNextId } from '../utils';

function getDslSchema() {
  const 节点 = Joi.object({
    id: Joi.string()
      .meta({ hidden: true })
      .default(getNextId)
      .failover((value) => {
        if (!value.id) {
          value.id = getNextId();
        }
        return value.id;
      }),
    name: Joi.string().allow(''),
    强调效果: Joi.string().valid('无', '文本着色').meta({ type: 'select' }).default('无'),
    边框样式: Joi.string().valid('无', '实线边框', '虚线边框', '实线边框-强调', '虚线边框-强调').meta({ type: 'select' }).default('无'),
  });

  return Joi.object({
    树: 节点
      .concat(
        Joi.object({
          children: Joi.array().items(Joi.link('#node')).label(' '),
        })
      )
      .id('node')
      .required()
      .meta({ expandable: true }),
    有层级标签: Joi.boolean().default((context) => {
      return context.层级标签集 && context.层级标签集.filter((标签) => 标签.name).length > 0;
    }),
    层级标签集: Joi.array().items(节点).meta({ expandable: true }),
    有底部标签: Joi.boolean().default((context) => {
      return context.底部标签集 && context.底部标签集.filter((标签) => 标签.name).length > 0;
    }),
    底部标签集: Joi.array().items(节点).meta({ expandable: true }),
    树延展方向: Joi.string().valid('向上', '向下', '向右').meta({ type: 'select' }).default('向下'),
  })
    .unknown()
    .concat(baseDslSchema);
}

export const dslSchema = getDslSchema();

export const viewSchema = getDslSchema()
  .concat(
    Joi.object({
      层级间距: Joi.number().default((context) => {
        if (context.树延展方向 === '向上' || context.树延展方向 === '向下') {
          return 58;
        } else {
          return 80;
        }
      }),
      邻接节点间距: Joi.number().default((context) => {
        if (context.树延展方向 === '向上' || context.树延展方向 === '向下') {
          return 31;
        } else {
          return 22;
        }
      }),
      子树间距: Joi.number().default((context) => {
        if (context.树延展方向 === '向上' || context.树延展方向 === '向下') {
          return 15;
        } else {
          return 8;
        }
      }),
    })
  )
  .concat(baseViewSchema);
