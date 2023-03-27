import * as Joi from 'joi';
import { baseDslSchema, baseViewSchema } from './base';

function getDslSchema() {
  return Joi.object({
    // your schema
  })
    .unknown()
    .concat(baseDslSchema);
}
export const dslSchema = getDslSchema();

export const viewSchema = getDslSchema().concat(baseViewSchema);
