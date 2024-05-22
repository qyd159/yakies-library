import {reactive} from 'vue'
export const botName = '知识小萌宝'
export const defaultRole = { id: -1, name: '默认角色', instruction: 'You are ChatGPT, a large language model trained by OpenAI' }
export type ModelType = 'dialog' | 'img' | 'vision' | 'tts' | 'asr' | 'nlu' | 'nlg' | 'kg' | 'qa' | 'emotion' | 'sentiment' | 'ocr' | 'face' | 'pose' | 'gesture' | 'action' | 'video' | 'audio' | 'image' | 'text' | 'file' | 'other'
export interface ModelItem {
  label: string
  value: string
  type: ModelType
  filter?: (model: string) => boolean
  company?: string
  getName?: (model: string) => string
  selectable?: boolean
  children?: ModelItem[]

}
export const modelCategories = reactive<ModelItem[]>([
  {
    label: 'GPT-3.5',
    value: 'openai365-gpt3.5',
    type: 'dialog',
    filter(model) { return model.includes('gpt-3.5') },
    selectable: false,
    children: [],
  },
  {
    label: 'GPT-4-8k',
    value: 'openai365-gpt4-8k',
    type: 'dialog',
    filter(model) { return model.includes('gpt-4') && !model.includes('gpt-4-32k') && !model.includes('vision') },
    selectable: false,
    children: [],
  },
  {
    label: 'GPT-4-32k',
    value: 'openai365-gpt4-32k',
    type: 'dialog',
    filter(model) { return model.includes('gpt-4-32k') },
    selectable: false,
    children: [],
  },
  {
    label: 'ClAUDE',
    value: 'openai365-claude',
    type: 'dialog',
    filter(model) { return model.includes('claude') },
    getName(model) {
      if (model.includes('claude-3-opus'))
        return 'claude-3-opus'

      if (model.includes('claude-3-sonnet'))
        return 'claude-3-sonnet'

      return model
    },
    selectable: false,
    children: [],
  },
  {
    label: '图文问答',
    value: '',
    type: 'vision',
    selectable: false,
    filter(model) { return model.includes('gpt-4-vision') },
    children: [],
  },
  {
    label: '文生图，图生图',
    value: '',
    type: 'img',
    selectable: false,
    filter(model) { return model.includes('dalle') || model.includes('midjourney') || model.includes('stable-diffusion') },
    children: [],
  },
  // {
  //   label: '其它',
  //   value: '',
  //   type: 'other',
  //   selectable: false,
  //   filter(model) { return model.includes('gpt-4-vision') },
  //   children: [],
  // },
])

export const imgSizes = [
  {
    label: '360p(nHD)',
    value: '640x360',
  },
  {
    label: 'VGA',
    value: '640x480',
  },
  {
    label: 'SVGA',
    value: '800x600',
  },
  {
    label: '720p(HD)',
    value: '1280x720',
  },
  {
    label: 'UXGA',
    value: '1600x1200',
  },
  {
    label: '1080p(FHD)',
    value: '1920x1080',
  },
  {
    label: '2K(FHD)',
    value: '2560x1440',
  },
  {
    label: '4K(UHD)',
    value: '3840x2160',
  },
]

export function isImgModel(model) {
  return ['img', 'vision'].includes(modelCategories.find(item => item.children?.some(item => item.value === model) || item.value === model)?.type as string)
}

export function getModelInfo(model) {
  const catInfo = modelCategories.find(item => item.children?.some(item => item.value === model) || item.value === model)
  const modelInfo = catInfo?.children?.find(item => item.value === model)
  return { catInfo, modelInfo }
}
