import * as Joi from 'joi';
import { baseDslSchema, baseViewSchema } from './base';
import { getNextId, normalizeEnum } from '../utils';
import { getIntersectedEllipsesAreas } from '../布局/韦恩图';
import { Position } from '../consts/enums';

const positions = Object.keys(normalizeEnum(Position));
const 填充颜色 = {
  不填充: 'none',
  blue1: 'rgba(81, 160, 255, 0.15)',
  blue2: 'rgba(81, 160, 255, 0.35)',
  blue3: 'rgba(81, 160, 255, 0.65)',
};

function getDslSchema() {
  const 名称 = Joi.object({ name: Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F', 'G').meta({ type: 'select' }).required() });
  const 内容 = Joi.object({
    内容: Joi.string().description('表示集合的椭圆内部的文案').allow(''),
    强调内容: Joi.boolean().default(false),
  });
  const 标签 = Joi.object({
    标签: Joi.string().description('标记说明表示集合的椭圆，一般在椭圆上方或下方').allow(''),
  });
  const 箭头文本 = Joi.object({
    箭头文本: Joi.string().description('箭头指向的文本').optional().allow(''),
  });
  const 集合 = Joi.object({
    id: Joi.string()
      .meta({ hidden: true })
      .default(getNextId)
      .failover((value) => {
        if (!value.id) {
          value.id = getNextId();
        }
        return value.id;
      }),
    填充颜色: getFillColorSchema(),
  })
    .unknown()
    .concat(内容);

  const 相交集 = Joi.object({
    原始集合: Joi.array().items(名称.concat(集合).concat(标签).concat(箭头文本)).meta({ expandable: true }).min(2).max(3),
    衍生集合: Joi.array()
      .items(
        Joi.object({
          name: Joi.string()
            .required()
            .meta({
              type: 'select',
              options: ['相交集.原始集合', 'name', getIntersectedEllipsesAreas],
            }),
        })
          .concat(集合)
          .concat(箭头文本)
      )
      .meta({ expandable: true })
      .default([]),
  });
  const 包含集模板 = Joi.object({
    原始集合: Joi.array().items(名称.concat(集合)).meta({ expandable: true }).min(2).max(4),
    类型: Joi.string()
      .valid('一层包含', '二层包含', '三层包含')
      .meta({ type: 'selectfieldset' })
      .default((context) => {
        return (context.一层包含 && '一层包含') || (context.二层包含 && '二层包含') || (context.三层包含 && '三层包含');
      }),
    一层包含: Joi.object({
      类型: Joi.string().valid('单子集', '双子集').meta({ type: 'selectfieldset' }).default('单子集'),
      单子集: Joi.string().meta({ hidden: true }).allow(''),
      双子集: Joi.object({
        类型: Joi.string().valid('子集分离', '子集相交').meta({ type: 'select' }).default('子集分离'),
      }).meta({ expandable: true }),
    }).meta({ expandable: true }),
    二层包含: Joi.string().meta({ hidden: true }).allow(''),
    三层包含: Joi.string().meta({ hidden: true }).allow(''),
    布局方向: Joi.string().valid('横向', '纵向').meta({ type: 'select' }).default('横向'),
    衍生集合: Joi.array()
      .items(
        Joi.object({
          name: Joi.string()
            .required()
            .meta({
              type: 'select',
              options: ['包含集[].原始集合', 'name', getIntersectedEllipsesAreas],
            }),
        }).concat(集合)
      )
      .meta({ expandable: true })
      .default([]),
  });
  return Joi.object({
    韦恩图类型: Joi.string()
      .valid('相交集', '包含集', '离散集')
      .meta({ type: 'selectfieldset' })
      .default((context) => {
        return (context.相交集 && '相交集') || (context.包含集 && '包含集') || (context.离散集 && '离散集');
      }),
    // 只有一个子图
    相交集,
    // 最多两个子图
    包含集: Joi.array().items(包含集模板).meta({ expandable: true }).min(1).max(2),
    // 使用栅格布局
    离散集: Joi.object({
      原始集合: Joi.array().items(名称.concat(集合).concat(标签).concat(箭头文本)).meta({ expandable: true }).min(1).max(4),
    }),
    全集: Joi.object({
      是否显示: Joi.boolean().default(false),
      全集样式: Joi.string().valid('矩形', '椭圆').meta({ type: 'select' }).default('矩形'),
    })
      .concat(标签)
      .concat(内容)
      .concat(箭头文本)
      .meta({ expandable: true })
      .default({ 是否显示: false })
      .unknown(),
  })
    .unknown()
    .concat(baseDslSchema);
}

export const dslSchema = getDslSchema();

export const viewSchema = getDslSchema().concat(baseViewSchema);

function getTextSchema() {
  return Joi.object({
    宽度: Joi.number().default(50),
    文本行数: Joi.number().default(3),
    文本位置: Joi.string().default('0,0'),
    文本定位: Joi.string()
      .valid(...positions)
      .meta({ type: 'select' }),
    文本对齐: Joi.number().min(0).max(100).meta({ type: 'range' }).default(50),
  }).meta({ expandable: true });
}

function getTextSchemaWithoutPosition() {
  return Joi.object({
    宽度: Joi.number().default(50),
    文本行数: Joi.number().default(3),
  }).meta({ expandable: true });
}

function getFillColorSchema() {
  return Joi.string().valid(填充颜色.不填充, 填充颜色.blue1, 填充颜色.blue2, 填充颜色.blue3).meta({ type: 'select' }).meta({ viewParam: true }).default(填充颜色.不填充);
}

viewSchema.$_terms.keys.forEach(({ key, schema }) => {
  if (key === '相交集') {
    schema.$_terms.keys.forEach(({ key, schema }) => {
      if (key === '原始集合' || key === '衍生集合') {
        schema.$_terms.items[0].$_terms.keys.push({ key: '内容布局', schema: getTextSchema() });
        schema.$_terms.items[0].$_terms.keys.push({ key: '标签布局', schema: getTextSchema() });
        schema.$_terms.items[0].$_terms.keys.push({ key: '箭头布局', schema: getTextSchema().concat(Joi.object({ 连线位置: Joi.string().default('0,0,100,100') })) });
      }
    });
    schema.$_terms.keys.push({ key: '子图宽度', schema: Joi.number().default(220) });
    schema.$_terms.keys.push({ key: '定位', schema: Joi.string().default('0,0') });
  }
  if (key === '包含集') {
    schema.$_terms.items[0].$_terms.keys.forEach(({ key, schema }) => {
      if (key === '原始集合' || key === '衍生集合') {
        schema.$_terms.items[0].$_terms.keys.push({ key: '内容布局', schema: getTextSchemaWithoutPosition() });
      }
    });
    schema.$_terms.items[0].$_terms.keys.push({ key: '子图宽度', schema: Joi.number().default(220) });
    schema.$_terms.items[0].$_terms.keys.push({ key: '定位', schema: Joi.string().default('0,0') });
  }
  if (key === '离散集') {
    schema.$_terms.keys.forEach(({ key, schema }) => {
      if (key === '原始集合' || key === '衍生集合') {
        schema.$_terms.items[0].$_terms.keys.push({ key: '内容布局', schema: getTextSchemaWithoutPosition() });
        schema.$_terms.items[0].$_terms.keys.push({ key: '标签布局', schema: getTextSchema() });
        schema.$_terms.items[0].$_terms.keys.push({ key: '箭头布局', schema: getTextSchema().concat(Joi.object({ 连线位置: Joi.string().default('0,0,100,100') })) });
      }
    });
    schema.$_terms.keys.push({ key: '子图宽度', schema: Joi.number().default(300) });
    schema.$_terms.keys.push({ key: '定位', schema: Joi.string().default('57,21') });
  }
  if (key === '全集') {
    schema.$_terms.keys.push({ key: '位置尺寸', schema: Joi.string().default('0,0,280,210') });
    schema.$_terms.keys.push({ key: '内容布局', schema: getTextSchema() });
    schema.$_terms.keys.push({ key: '标签布局', schema: getTextSchema() });
    schema.$_terms.keys.push({ key: '箭头布局', schema: getTextSchema().concat(Joi.object({ 连线位置: Joi.string().default('0,0,100,100') })) });
  }
});
