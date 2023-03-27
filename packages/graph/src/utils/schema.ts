import { isArray, isObject, get, set } from 'lodash-es';

export function parseJoiRef(ref, schemas) {
  let result;
  if (ref.type === 'local') {
    travseSchema(schemas, null, (key, subSchema) => {
      const id = subSchema._flags.id || key;
      if (id === ref.path[0]) {
        const path = ref.path.slice(1);
        result = { key: path.length ? undefined : key, schema: path.length ? schemas.$_reach(path) : subSchema };
      }
    });
  }
  return result;
}

export function parseObjectSchema(schema, subSchema, subSchemas) {
  let subSchema2;
  if (subSchema.key) {
    const id = subSchema.schema._flags && subSchema.schema._flags.id ? { id: subSchema.schema._flags.id } : null;
    const expandable = subSchema.schema.$_terms.metas.length && subSchema.schema.$_terms.metas.find((item) => item.expandable) && true;
    schema[subSchema.key] = {
      ...id,
      expandable,
      expanded: expandable ? subSchema.schema.$_terms.metas.find((item) => item.expandable).expanded : false,
      title: subSchema.key,
      type: subSchema.schema.type,
      properties: {},
    };
    subSchema2 = subSchema.schema.$_terms.keys;
    schema = schema[subSchema.key];
  } else {
    const id = subSchema._flags && subSchema._flags.id ? { id: subSchema._flags.id } : null;
    subSchema2 = subSchema.$_terms.keys;
    Object.assign(schema, {
      ...id,
      title: subSchema.key,
      type: subSchema.type,
      properties: {},
    });
  }

  for (const subSchema22 of subSchema2) {
    if (subSchema22.schema.type === 'object') {
      parseObjectSchema(schema.properties, subSchema22, subSchemas);
    } else if (subSchema22.schema.type === 'array') {
      parseArraySchema(schema.properties, subSchema22, subSchemas);
    } else {
      const id = subSchema22.schema._flags && subSchema22.schema._flags.id ? { id: subSchema22.schema._flags.id } : null;
      let type = subSchema22.schema.type;
      let enums, options, isHidden;
      if (subSchema22.schema.$_terms.metas.length > 0) {
        const metas = subSchema22.schema.$_terms.metas.filter((meta) => meta.type);
        type = (metas.length > 0 && metas[0].type) || type;
        options = (metas.length > 0 && metas[0].options) || null;
        isHidden = subSchema22.schema.$_terms.metas.filter((meta) => meta.hidden).length > 0;
      }
      if (subSchema22.schema._valids && (type === 'select' || type === 'selectfieldset')) {
        enums = { enum: [...subSchema22.schema._valids._values] };
      }
      if (type === 'selectfieldset') {
        (schema.form = []), (schema.skipedFields = []);
        schema.form.push({
          type,
          title: subSchema22.key,
          key: subSchema22.key,
          items: enums.enum.map((key) => {
            schema.skipedFields.push(key);
            return {
              key,
              title: key,
            };
          }),
        });
        schema.skipedFields.push(subSchema22.key);
        schema.properties[subSchema22.key] = {
          ...id,
          type: 'string',
          title: subSchema22.key,
          default: subSchema.schema._flags && subSchema.schema._flags.default,
        };
      } else {
        const min = type === 'number' || type === 'range' ? { min: subSchema22.schema._singleRules.get('min')?.args.limit } : null;
        const max = type === 'number' || type === 'range' ? { max: subSchema22.schema._singleRules.get('max')?.args.limit } : null;
        const uiHidden = isHidden ? { hidden: true } : null;
        schema.properties[subSchema22.key] = {
          ...id,
          ...enums,
          ...uiHidden,
          options,
          type,
          ...min,
          ...max,
          step: 10,
          title: (subSchema22.schema._flags && subSchema22.schema._flags.label) || subSchema22.key,
          default: subSchema22.schema._flags && subSchema22.schema._flags.default,
        };
      }
    }
  }
}

export function parseArraySchema(schema, subSchema, subSchemas) {
  const id = subSchema.schema._flags && subSchema.schema._flags.id ? { id: subSchema.schema._flags.id } : null;
  const expandable = subSchema.schema.$_terms.metas.length && subSchema.schema.$_terms.metas.find((item) => item.expandable) && true;
  const minRule = subSchema.schema._rules.find((item) => item.name === 'min');
  const maxRule = subSchema.schema._rules.find((item) => item.name === 'max');
  const minItems = minRule ? minRule.args.limit : -1;
  const maxItems = maxRule ? maxRule.args.limit : -1;
  schema[subSchema.key] = {
    ...id,
    minItems,
    maxItems,
    expandable,
    expanded: expandable ? subSchema.schema.$_terms.metas.find((item) => item.expandable).expanded : false,
    title: (subSchema.schema._flags && subSchema.schema._flags.label) || subSchema.key,
    type: subSchema.schema.type,
    items: {},
  };
  if (subSchema.key === 'items') {
    schema.type = 'array';
  }
  if (subSchema.schema.$_terms.items.length === 1) {
    const subSchema2 = subSchema.schema.$_terms.items[0];
    if (subSchema2.type === 'link') {
      const { key, schema: refSchema } = parseJoiRef(subSchema2.$_terms.link[0].ref, subSchemas);
      schema[subSchema.key].items = {
        type: 'link' || refSchema.type,
        ref: key,
      };
    } else if (subSchema2.type === 'array') {
      parseArraySchema(schema[subSchema.key].items, { schema: subSchema2, key: 'items' }, subSchemas);
    } else if (subSchema2.type === 'object') {
      parseObjectSchema(schema[subSchema.key].items, subSchema2, subSchemas);
    } else {
      const id = subSchema2._flags && subSchema2._flags.id ? { id: subSchema2._flags.id } : null;
      schema[subSchema.key].items = {
        ...id,
        type: subSchema2.type,
        title: subSchema2.key,
        default: subSchema2._flags && subSchema2._flags.default,
      };
    }
  }
}

export function parseRootSchema(subSchemas) {
  const schema = {},
    form = [],
    skipedFields = [];
  for (const subSchema of subSchemas.$_terms.keys) {
    if (subSchema.schema.type === 'object') {
      parseObjectSchema(schema, subSchema, subSchemas);
    } else if (subSchema.schema.type === 'array') {
      parseArraySchema(schema, subSchema, subSchemas);
    } else {
      const id = subSchema.schema._flags && subSchema.schema._flags.id ? { id: subSchema.schema._flags.id } : null;
      let type = subSchema.schema.type;
      if (subSchema.schema.$_terms.metas.length > 0) {
        const metas = subSchema.schema.$_terms.metas.filter((meta) => meta.type);
        type = (metas.length > 0 && metas[0].type) || type;
      }
      let enums;
      if (subSchema.schema._valids && (type === 'select' || type === 'selectfieldset')) {
        enums = { enum: [...subSchema.schema._valids._values] };
      }
      if (type === 'selectfieldset') {
        form.push({
          type,
          title: subSchema.key,
          key: subSchema.key,
          items: enums.enum.map((key) => {
            skipedFields.push(key);
            return {
              key,
              title: key,
            };
          }),
        });
        skipedFields.push(subSchema.key);
        schema[subSchema.key] = {
          ...id,
          type: 'string',
          title: subSchema.key,
          default: subSchema.schema._flags && subSchema.schema._flags.default,
        };
      } else {
        const min = type === 'number' || type === 'range' ? { min: subSchema.schema._singleRules.get('min')?.args.limit } : null;
        const max = type === 'number' || type === 'range' ? { max: subSchema.schema._singleRules.get('max')?.args.limit } : null;
        schema[subSchema.key] = {
          ...id,
          ...enums,
          ...min,
          ...max,
          step: 10,
          type,
          title: subSchema.key,
          default: subSchema.schema._flags && subSchema.schema._flags.default,
        };
      }
    }
    if (subSchema.schema.$_terms.metas.length && subSchema.schema.$_terms.metas.some((meta) => meta.invisible)) {
      schema[subSchema.key].invisible = true;
    }
  }
  return [schema, form, skipedFields];
}

// 遍历schema去除非schema定义的值以及空数组
export function stripFromSchema(schema, values, rootSchema?) {
  if (!rootSchema) {
    rootSchema = schema;
  }
  let result;
  if (schema.type === 'array') {
    result = [];
    // 暂时只支持items.length === 1的情况，即数组的元素类型相同
    if (schema.$_terms.items.length === 1 && values && values.length > 0) {
      values.forEach((value, index) => {
        if (typeof value === 'object') {
          let subSchema = schema.$_terms.items[0];
          if (subSchema.type === 'link') {
            const { schema: refSchema } = parseJoiRef(subSchema.$_terms.link[0].ref, rootSchema);
            subSchema = refSchema;
          }
          result[index] = stripFromSchema(subSchema, isArray(value) ? [...value] : { ...value }, rootSchema);
        } else if (value) {
          result[index] = value;
        }
      });
    }
  }

  if (schema.type === 'object') {
    result = {};
    const subSchemas = schema.$_terms.keys;
    for (const subSchema of subSchemas) {
      if (typeof values[subSchema.key] === 'object') {
        result[subSchema.key] = stripFromSchema(subSchema.schema, isArray(values[subSchema.key]) ? [...values[subSchema.key]] : { ...values[subSchema.key] }, rootSchema);
      } else if (typeof values[subSchema.key] !== 'undefined') {
        result[subSchema.key] = values[subSchema.key];
      }
    }
  }
  return result;
}

/**
 * 遍历schema
 * @param schema a joi schema
 * @param values json参数对象
 * @param cb
 */
export function travseSchema(schema, key, cb) {
  if (schema.type === 'array') {
    // 暂时只支持items.length === 1的情况，即数组的元素类型相同,如果有元组类型，则会被忽略，有可能造成程序错误
    if (schema.$_terms.items.length === 1) {
      const result = cb(key, schema);
      if (typeof result === 'number' && result > 0) {
        for (let i = 0; i < result; i++) {
          const arrayKey = key + `[${i}]`;
          cb(arrayKey, schema.$_terms.items[0]);
          travseSchema(schema.$_terms.items[0], arrayKey, cb);
        }
      } else {
        const arrayKey = key + `[]`;
        cb(arrayKey, schema.$_terms.items[0]);
        travseSchema(schema.$_terms.items[0], arrayKey, cb);
      }
    }
  } else if (schema.type === 'object') {
    cb(key, schema);
    const subSchemas = schema.$_terms.keys;
    for (const subSchema of subSchemas) {
      // 使用浅拷贝，不影响原来的对象
      const newKey = key ? key + '.' + subSchema.key : subSchema.key;

      travseSchema(subSchema.schema, newKey, cb);
    }
  } else {
    cb(key, schema);
  }
}

export function travseSchemaWithValues(schema, values, rootKey, cb) {
  travseSchema(schema, rootKey, (key, subSchema) => {
    const value = get(values, key);
    cb(key, subSchema, value);
    if (isArray(value) && subSchema.type === 'array') {
      return value.length;
    }
  });
}
