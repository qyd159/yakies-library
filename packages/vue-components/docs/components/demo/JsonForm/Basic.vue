<template>
  <JsonForm :schema="schema" v-model="values">
  </JsonForm>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
const schema = ref(
  {
    "树": {
      "id": "node",
      "expandable": true,
      "title": "树",
      "type": "object",
      "properties": {
        "id": {
          "ui:Hidden": true,
          "options": null,
          "type": "string",
          "step": 10,
          "title": "id"
        },
        "name": {
          "type": "string",
          "step": 10,
          "title": "name"
        },
        "强调效果": {
          "enum": [
            "无",
            "文本着色"
          ],
          "options": null,
          "type": "select",
          "step": 10,
          "title": "强调效果",
          "default": "无"
        },
        "边框样式": {
          "enum": [
            "无",
            "实线边框",
            "虚线边框",
            "实线边框-强调",
            "虚线边框-强调"
          ],
          "options": null,
          "type": "select",
          "step": 10,
          "title": "边框样式",
          "default": "无"
        },
        "children": {
          "minItems": -1,
          "maxItems": -1,
          "expandable": 0,
          "expanded": false,
          "title": "",
          "type": "array",
          "items": {
            "type": "link",
            "ref": "树"
          }
        }
      }
    },
    "有层级标签": {
      "step": 10,
      "type": "boolean",
      "title": "有层级标签"
    },
    "层级标签集": {
      "minItems": -1,
      "maxItems": -1,
      "expandable": true,
      "title": "层级标签集",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "ui:Hidden": true,
            "options": null,
            "type": "string",
            "step": 10,
            "title": "id"
          },
          "name": {
            "type": "string",
            "step": 10,
            "title": " "
          },
          "强调效果": {
            "enum": [
              "无",
              "文本着色"
            ],
            "options": null,
            "type": "select",
            "step": 10,
            "title": "强调效果",
            "default": "无"
          },
          "边框样式": {
            "enum": [
              "无",
              "实线边框",
              "虚线边框",
              "实线边框-强调",
              "虚线边框-强调"
            ],
            "options": null,
            "type": "select",
            "step": 10,
            "title": "边框样式",
            "default": "无"
          }
        }
      }
    },
    "有底部标签": {
      "step": 10,
      "type": "boolean",
      "title": "有底部标签"
    },
    "底部标签集": {
      "minItems": -1,
      "maxItems": -1,
      "expandable": true,
      "title": "底部标签集",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "ui:Hidden": true,
            "options": null,
            "type": "string",
            "step": 10,
            "title": "id"
          },
          "name": {
            "type": "string",
            "step": 10,
            "title": " "
          },
          "强调效果": {
            "enum": [
              "无",
              "文本着色"
            ],
            "options": null,
            "type": "select",
            "step": 10,
            "title": "强调效果",
            "default": "无"
          },
          "边框样式": {
            "enum": [
              "无",
              "实线边框",
              "虚线边框",
              "实线边框-强调",
              "虚线边框-强调"
            ],
            "options": null,
            "type": "select",
            "step": 10,
            "title": "边框样式",
            "default": "无"
          }
        }
      }
    },
    "树延展方向": {
      "enum": [
        "向上",
        "向下",
        "向右"
      ],
      "step": 10,
      "type": "select",
      "title": "树延展方向",
      "default": "向下"
    },
    "主题": {
      "enum": [
        "light",
        "dark"
      ],
      "step": 10,
      "type": "select",
      "title": "主题",
      "default": "light"
    },
    "图元动作序列": {
      "minItems": -1,
      "maxItems": -1,
      "expandable": true,
      "expanded": true,
      "title": "图元动作序列",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "目标": {
            "options": null,
            "type": "select",
            "step": 10,
            "title": "目标"
          },
          "动作": {
            "enum": [
              "强调",
              "填充",
              "移动"
            ],
            "options": null,
            "type": "select",
            "step": 10,
            "title": "动作"
          }
        }
      }
    }
  }
)

const values = reactive({ "树": { "id": "根", "name": "开始", "强调效果": "无", "边框样式": "无", "children": [{ "id": "子节点1", "name": "黑球", "强调效果": "无", "边框样式": "无", "children": [{ "id": "叶子1", "name": "黑球", "强调效果": "无", "边框样式": "无" }, { "id": "叶子2", "name": "红球", "强调效果": "无", "边框样式": "无" }, { "id": "aid_49", "name": "白球", "强调效果": "无", "边框样式": "无" }] }, { "id": "子节点", "name": "红球", "强调效果": "无", "边框样式": "无", "children": [{ "id": "叶子3", "name": "黑球", "强调效果": "无", "边框样式": "无" }, { "id": "aid_80", "name": "红球", "强调效果": "无", "边框样式": "无" }, { "id": "aid_81", "name": "白球", "强调效果": "无", "边框样式": "无" }] }, { "id": "aid_34", "name": "haha", "强调效果": "文本着色", "边框样式": "无", "children": [{ "id": "aid_84", "name": "你好", "强调效果": "无", "边框样式": "无" }, { "id": "aid_272", "name": "嘿嘿", "强调效果": "无", "边框样式": "无" }] }] }, "有层级标签": true, "层级标签集": [{ "id": "层_0", "name": "层_0", "强调效果": "无", "边框样式": "无" }, { "id": "层_1", "name": "层_1", "强调效果": "无", "边框样式": "无" }, { "id": "层_2", "name": "层_2", "强调效果": "无", "边框样式": "无" }], "有底部标签": true, "底部标签集": [{ "id": "黑球", "name": "黑球", "强调效果": "无", "边框样式": "无" }, { "id": "红球", "name": "红球", "强调效果": "无", "边框样式": "无" }, { "id": "黑球", "name": "黑球", "强调效果": "无", "边框样式": "无" }, { "id": "红球", "name": "红球", "强调效果": "无", "边框样式": "无" }, { "id": "嘿嘿", "name": "嘿嘿", "强调效果": "无", "边框样式": "无" }, { "id": "嘿嘿", "name": "嘿嘿", "强调效果": "无", "边框样式": "无" }, { "id": "哈哈", "name": "哈哈", "强调效果": "无", "边框样式": "无" }, { "id": "bottom-empty-7", "强调效果": "无", "边框样式": "无" }], "树延展方向": "向右", "主题": "light", "层级间距": 80, "邻接节点间距": 22, "子树间距": 8, "字体大小": 12 }
)
</script>
