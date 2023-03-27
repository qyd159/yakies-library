import * as Joi from 'joi';

export const baseDslSchema = Joi.object<{ 主题: string; 图元动作序列: { 目标: string; 动作: string }[] }>({
  主题: Joi.string().valid('light', 'dark').meta({ type: 'select' }).default('light'),
  图元动作序列: Joi.array()
    .items(
      Joi.object({
        目标: Joi.any().meta({ type: 'select' }),
        动作: Joi.any().meta({ type: 'select' }).valid('强调', '填充', '移动'),
        // 持续时间: Joi.number().meta({ type: 'time' })
      })
    )
    .meta({ expandable: true, expanded: true })
    .default([]),
});

export const baseViewSchema = Joi.object<{ 字体大小: number }>({
  字体大小: Joi.number().default(12).min(12),
});
