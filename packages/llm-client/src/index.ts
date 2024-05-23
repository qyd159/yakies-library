import { v4 as uuid } from 'uuid'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import waitUntil from 'async-wait-until'
import { getTokenFromLocal } from '@yakies/http'
import { formatDate, processMarkdown, promisifyIpc, receivedCallbacks } from './util'
import type { ModelType } from './shared'
import { botName, getModelInfo, isImgModel, modelCategories } from './shared'
import {unref, ref, computed, nextTick} from 'vue'
import {isArray} from 'lodash-es'
import SocketClient from '@yakies/rx-socket-client'

function normalizeAnswer(text) {
  return text
}

let session_id

export function useChatSocket({
  records,
  responseLoading,
  responsingText,
  autoScrollEnabled,
  scrollToBottom,
  voiceTextPopoverVisible,
  content,
  responsing,
  setContent,
  model,
  role,
  imgSize,
  chatStore,
  userStore,
  backToLogin,
  message,
  initSession
}) {
  let lastQuestion
  const socket = ref()
  const chatgpt_id = ref()
  const dialog_id = ref()
  const socketInst = ref()
/* The line `const router = useRouter()` is importing the `useRouter` function from a library or module
and assigning it to the variable `router`. This function is typically used in Vue.js applications to
access the router instance and perform navigation-related tasks, such as programmatically navigating
to different routes within the application. */
  const useGptContext = computed(() => chatStore.gptContext)
  const modelInfo = computed(() => getModelInfo(unref(model)))
  const organizedModels = computed(() => {
    const result = modelCategories.map((item) => {
      const selectedModels = chatStore.modelProviders[chatStore.selectedModelProviderIndex]?.models ?? []
      item.children = chatStore.availableModels.filter(model => item.filter?.(model.id) && selectedModels.includes(model.id)).map(model => ({
        label: item.getName?.(model.id) || model.id,
        value: model.id,
        type: 'dialog' as ModelType,
      }))
      return item
    }).filter(item => (item.children?.length && item.children.length > 0) || false)
    const solos = result.filter(item => item.children?.length === 1)
    const groups = result.filter(item => item.children?.length !== 1)
    return solos.map(item => item.children![0]).concat(groups)
  })
  const exhausted = computed(() => chatStore.getGptTokens.consumed >= chatStore.getGptTokens.total)

  async function init() {
    socket.value = new SocketClient(
      // 生产环境临时使用chatgpt.yakies.cn, 腾讯云cdn不支持代理websocket,会有10s超时的限制，后面使用系统字典配置
      `${window.location.protocol}//gateway.yakies.cn/chatgpt/socket.io`,
      { autoConnect: true, reconnection: true, reconnectionDelay: 1000, transports: ['websocket'], query: { token: getTokenFromLocal() } },
      async (raw_socket) => {
        socketInst.value = raw_socket
        session_id = await initSession({})
        unref(socket).emit(['sign', { id: session_id }])
        retrieveModels()
      },
    )

    unref(socket).on('begin', ({ id }) => {
      unref(records)
        .slice(-1)
        .forEach(item => (item.id = id))
    })
    unref(socket).on('aborted', (data) => {
      responseLoading[data.request_id] = false
      if (!responsingText[data.request_id]) {
        const index = unref(records).findIndex(item => item.request_id === data.request_id)
        if (index !== -1)
          unref(records).splice(index, 1)
      }
      else {
        Object.assign(unref(records).find(item => item.request_id === data.request_id)!, { content: normalizeAnswer(responsingText[data.request_id]) })
      }
    })
    unref(socket).on('models', (data) => {
      chatStore.setAvailableModels(data.data)
    })
    unref(socket).on('answer', (data) => {
      if (!responseLoading[data.request_id]) {
        responseLoading[data.request_id] = true
        Object.assign(unref(records)[unref(records).length - 1], { content: '' })
      }
      responsingText[data.request_id] = normalizeAnswer(responsingText[data.request_id] + data.content)
      unref(autoScrollEnabled) && scrollToBottom()
      receivedCallbacks[data.request_id] && receivedCallbacks[data.request_id](`${data.request_id}_tokens`, data)
    })
    unref(socket).on('end', (data) => {
      Object.assign(unref(records).find(item => item.request_id === data.request_id)!, { content: normalizeAnswer(data.content) })
      // websocket失联，此时loading状态取消
      responseLoading[data.request_id] = false
      receivedCallbacks[data.request_id] && receivedCallbacks[data.request_id](data.request_id, data)
    })
    unref(socket).on('error', (data) => {
      if (data === '会话已失效')
        backToLogin()

      if (data?.code === 'ECONNRESET') {
        Object.assign(unref(records)[unref(records).length - 1], {
          name: botName,
          content: `${botName}暂时打盹了,请稍后再试或联系系统管理员`,
          err: true,
        })
      }
    })
  }

  async function createAIRequest(ctext, request_id = uuid(), count = 1) {
    const messages: ChatCompletionMessageParam[] = [{ role: 'user', content: ctext }]
    if (useGptContext.value && unref(records).length > 0) {
      let i = 2
      let record = unref(records)[unref(records).length - i]
      while (record?.contextual) {
        messages.unshift({ role: 'user', content: record.question }, { role: 'assistant', content: record.content })
        record = unref(records)[unref(records).length - ++i]
      }
    }
    messages.unshift({ role: 'system', content: unref(role).instruction })
    try {
      const res
        = await promisifyIpc(
          request_id,
          {
            request_id,
            msg: ctext,
            messages,
            chatgpt_id: unref(useGptContext) ? unref(chatgpt_id) : undefined,
            session_id,
            contextual: unref(useGptContext),
            dialog_id: unref(dialog_id),
            model: unref(model),
            cat: modelInfo.value?.catInfo?.value,
            modelProvider: chatStore.modelProviders[chatStore.selectedModelProviderIndex],
            ...(isImgModel(unref(model)) ? { imgSize: unref(imgSize) } : {}),
          },
          (data) => {
            unref(socket).emit(['ask', data])
          },
          () => { },
        )
      if (modelInfo.value?.catInfo?.type === 'img') {
        Object.assign(unref(records).find(item => item.request_id === request_id)!, {
          time: formatDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          downloadUrl: res.images[0],
        })
      }
      else {
        if (!res.content) {
          console.error(res.rawResponse)
          Object.assign(unref(records).find(item => item.request_id === request_id)!, {
            content: res.rawResponse,
            history: true,
          })
          throw new Error('响应超时')
        }
        if (res.rawResponse.type === 'exception' && count === 1) {
          createAIRequest(lastQuestion, 2)
          return
        }
        Object.assign(unref(records).find(item => item.request_id === request_id)!, {
          time: formatDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          chatgpt_id: res.rawResponse.id,
          history: true,
        })
        chatgpt_id.value = res.rawResponse.id
        dialog_id.value = res.dialog_id
      }

      nextTick(() => {
        scrollToBottom()
        // focusTxtContent(); //聚焦输入框
      })
    }
    catch (error: any) {
      if (responseLoading[request_id]) {
        if (error === '会话已失效' || error === 'timeout') {
          const record = unref(records).find(item => item.request_id === request_id)
          if (record) {
            Object.assign(record, {
              time: formatDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
              name: botName,
              content: `No Reply Received. ${error}`,
              err: true,
            })
          }
        }
      }
      if (error.message === '登录身份已过期')
        backToLogin()
    }
    finally {
      responseLoading[request_id] = false
      responsing[request_id] = false
    }
  }

  async function sendMsg(msg?) {
    if (exhausted.value) {
      chatStore.setChargeVisibie(true)
      return
    }
    voiceTextPopoverVisible.value = false
    const ctext = msg ?? unref(content)
    if (ctext === '') {
      message.info('请输入您的问题')
      return
    }

    const processedContent = processMarkdown(ctext)
    if (isArray(processedContent) && !isImgModel(unref(model))) {
      // TODO 包含图像数据，检查当前model是否是vision model或者img model
      return message.warn('请选择图像模型')
    }

    const request_id = uuid()
    responsingText[request_id] = ''
    responsing[request_id] = true
    responseLoading[request_id] = false
    unref(records).push({
      time: formatDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      name: '你自己',
      question: processedContent,
      request_id,
      model: unref(model),
      contextual: unref(useGptContext),
      showAnswer: true,
    })
    lastQuestion = processedContent
    setContent('')
    await nextTick(() => {
      autoScrollEnabled.value = true
      scrollToBottom()
      // focusTxtContent(); //聚焦输入框
    })
    await createAIRequest(processedContent, request_id)
  }

  function stopGeneration() {
    unref(socket).emit(['stop', { id: session_id }])
  }

  async function retrieveModels() {
    await waitUntil(() => userStore.userInfo?.id, { timeout: 10000 })
    unref(socket).emit(['models', { session_id, user: userStore.userInfo?.id, cat: modelCategories.find(item => item.children?.find(item => item.value === unref(model)))?.value ?? modelCategories[0].value, modelProvider: chatStore.modelProviders[chatStore.selectedModelProviderIndex] }])
  }

  return { init, chatgpt_id, dialog_id, createAIRequest, sendMsg, stopGeneration, retrieveModels, organizedModels, socketInst }
}
