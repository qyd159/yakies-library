import markdownIt from 'markdown-it'
import {unref} from 'vue'

const SIGN_REGEXP = /([yMdhsm])(\1*)/g
const DEFAULT_PATTERN = 'yyyy-MM-dd'

export const md = markdownIt({
  breaks: true,
})

function padding(s, len) {
  len = len - (`${s}`).length
  for (let i = 0; i < len; i++)
    s = `0${s}`

  return s
}

export function getQueryStringByName(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  let context = ''
  if (r != null)
    context = r[2]
  r = null
  return context == null || context === '' || context === 'undefined' ? '' : context
}
export const formatDate = {
  format(date, pattern) {
    pattern = pattern || DEFAULT_PATTERN
    return pattern.replace(SIGN_REGEXP, ($0) => {
      switch ($0.charAt(0)) {
        case 'y':
          return padding(date.getFullYear(), $0.length)
        case 'M':
          return padding(date.getMonth() + 1, $0.length)
        case 'd':
          return padding(date.getDate(), $0.length)
        case 'w':
          return date.getDay() + 1
        case 'h':
          return padding(date.getHours(), $0.length)
        case 'm':
          return padding(date.getMinutes(), $0.length)
        case 's':
          return padding(date.getSeconds(), $0.length)
      }
    })
  },
  parse(dateString, pattern) {
    const matchs1 = pattern.match(SIGN_REGEXP)
    const matchs2 = dateString.match(/(\d)+/g)
    if (matchs1.length === matchs2.length) {
      const _date = new Date(1970, 0, 1)
      for (let i = 0; i < matchs1.length; i++) {
        const _int = Number.parseInt(matchs2[i])
        const sign = matchs1[i]
        switch (sign.charAt(0)) {
          case 'y':
            _date.setFullYear(_int)
            break
          case 'M':
            _date.setMonth(_int - 1)
            break
          case 'd':
            _date.setDate(_int)
            break
          case 'h':
            _date.setHours(_int)
            break
          case 'm':
            _date.setMinutes(_int)
            break
          case 's':
            _date.setSeconds(_int)
            break
        }
      }
      return _date
    }
    return null
  },
}

export const receivedCallbacks = {}

export async function promisifyIpc(request_id, sendData, emit, callback?) {
  return await new Promise<any>((resolve, reject) => {
    let messageInterval
    let prevReceivedTime = performance.now()
    const t = setInterval(() => {
      // 两次消息的返回时长超过10秒，主动放弃
      if (messageInterval > 10e3) {
        clearInterval(t)
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('timeout')
      }
      else {
        messageInterval = performance.now() - prevReceivedTime
      }
    })
    receivedCallbacks[request_id] = (receivedType, data) => {
      if (receivedType === request_id) {
        clearInterval(t)
        resolve(data)
        delete receivedCallbacks[request_id]
      }
      else if (receivedType.indexOf(request_id) === 0) {
        messageInterval = 0
        prevReceivedTime = performance.now()
        callback?.(receivedType, data)
      }
      else if (receivedType === 'error') {
        reject(data)
        delete receivedCallbacks[request_id]
      }
    }
    emit({ request_id, ...sendData })
  })
}

export function observeElementDimension(target, cb) {
  // 创建一个 ResizeObserver 实例
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      // 处理每个发生尺寸变化的元素
      const target = entry.target
      cb(target.getBoundingClientRect())
    }
  })
  cb(unref(target).getBoundingClientRect())

  // 监听指定的 DOM 元素
  observer.observe(target)
}

export function processMarkdown(markdownText) {
  const sections: any[] = []
  // 匹配Markdown图片标记，包括alt文本
  const regex = /!\[([^\]]*)\]\((data:image\/\w+;base64,[^)]+|https?:\/\/\S+\.(jpg|jpeg|png|gif|bmp|svg))\)/gi
  let lastIndex = 0
  let match

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(markdownText)) !== null) {
    // 处理匹配之前的文本作为一个段落
    if (lastIndex < match.index) {
      sections.push({
        type: 'text',
        text: markdownText.substring(lastIndex, match.index).trim(),
      })
    }

    // 图像处理
    const imageUrl = match[2]
    if (imageUrl.startsWith('data:image')) {
      // Base64图像
      sections.push({
        type: 'image_url',
        image_url: {
          url: imageUrl,
        },
      })
    }
    else {
      // 网络图像
      sections.push({
        type: 'image_url',
        image_url: {
          url: imageUrl,
        },
      })
    }

    lastIndex = regex.lastIndex
  }

  // 检查并添加最后一段文本
  if (lastIndex < markdownText.length) {
    sections.push({
      type: 'text',
      text: markdownText.substring(lastIndex).trim(),
    })
  }

  if (sections.every(item => item.type === 'text'))
    return markdownText

  // 移除空文本段落
  return sections.filter(section => section.text !== '')
}
