/**
 * Component list, register here to setting it in the form
 */
import {
  Input,
  Select,
  Radio,
  Checkbox,
  AutoComplete,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  TimePicker,
  TreeSelect,
  Tree,
  Slider,
  Rate,
  Divider,
  Upload
} from 'ant-design-vue';

export const componentMap:any = {
  Input,
  InputGroup: Input.Group,
  InputPassword: Input.Password,
  InputSearch: Input.Search,
  InputTextArea: Input.TextArea,
  InputNumber,
  AutoComplete,
  Select,
  TreeSelect,
  Tree,
  Switch,
  RadioGroup: Radio.Group,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Cascader,
  Slider,
  Rate,
  DatePicker,
  MonthPicker: DatePicker.MonthPicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  TimePicker,
  Upload,
  Divider,
};

export type ComponentMapType = keyof typeof componentMap;

export enum ComponentTypeEnum {
  Input = 'Input',
  InputGroup = 'InputGroup',
  InputPassword = 'InputPassword',
  InputSearch = 'InputSearch',
  InputTextArea = 'InputTextArea',
  InputNumber = 'InputNumber',
  AutoComplete = 'AutoComplete',
  Select = 'Select',
  TreeSelect = 'TreeSelect',
  Tree = 'Tree',
  Switch = 'Switch',
  RadioGroup = 'RadioGroup',
  Checkbox = 'Checkbox',
  CheckboxGroup = 'CheckboxGroup',
  Cascader = 'Cascader',
  Slider = 'Slider',
  Rate = 'Rate',
  DatePicker = 'DatePicker',
  MonthPicker = 'MonthPicker',
  RangePicker = 'RangePicker',
  WeekPicker = 'WeekPicker',
  TimePicker = 'TimePicker',
  Upload = 'Upload',
  Divider = 'Divider',
}

function inputFieldTemplate(component) {
  return {
    component,
    fieldtemplate: true,
    inputfield: true
  }
};

export const elementTypes = {
  'text': inputFieldTemplate('Input'),
  'mathexpression': inputFieldTemplate('Input'),
  'number': inputFieldTemplate('InputNumber'),
  'select': inputFieldTemplate('Select'),
  'selectfieldset': inputFieldTemplate('Select'),
  'array': {
    'fieldtemplate': true,
    'array': true,
  },
  'link': {},
  'fieldset': {},
  'checkbox': inputFieldTemplate('Checkbox'),
  'actions': {},
  'submit': {}
}
