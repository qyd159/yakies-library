import { debounce } from 'lodash-es';

// 位置记录
const position = {
  start: undefined as any,
  end: undefined as any,
  sourceEl: undefined as undefined | HTMLTableRowElement,
};

function closest(el, selector) {
  while (el && !el.matches(selector)) {
    el = el.parentNode;
  }
  return el ? el : null;
}

function isElem1AboveElem2(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();

  return rect1.bottom <= rect2.top;
}

export function useSortTable(expandedRowKeys, collapseRows, onDragFinished) {
  // 排序
  const reorder = ({ start, end }) => {
    const datas = start.parent.children;
    const startIndex = datas.findIndex((item) => item.id === start.id);
    const endIndex = datas.findIndex((item) => item.id === end.id);
    if (startIndex !== undefined && endIndex !== undefined) {
      if (startIndex > endIndex) {
        // 当开始大于结束
        const temp = datas[startIndex];
        datas.splice(startIndex, 1);
        datas.splice(endIndex, 0, temp);
      } else if (startIndex < endIndex) {
        // 结束大于开始
        const temp = datas[startIndex];
        datas.splice(startIndex, 1);
        datas.splice(endIndex, 0, temp);
      }
    }
  };

  function removeHighlights(allTrs) {
    Array.prototype.forEach.call(allTrs, (node: Element) => {
      if (node.nodeName === 'TR' && node.classList.contains('highlight')) {
        node.classList.remove('highlight');
        node.classList.remove('bottom');
      }
    });
  }

  const highlightItem = debounce((ev) => {
    const tr = closest(ev.target, 'tr');
    const allTrs = closest(ev.target, 'tbody').childNodes;
    removeHighlights(allTrs);
    tr.classList.add('highlight');
    if (!isElem1AboveElem2(tr, position.sourceEl)) {
      tr.classList.add('bottom');
    }
  }, 100);
  function customRow(record) {
    return {
      // 鼠标移入
      onMouseenter: (event) => {
        // 兼容IE
        const ev = event || window.event;
        if (record.isEdit) {
          ev.target.draggable = false;
          ev.target.style.cursor = 'default';
        } else {
          ev.target.draggable = true;
          ev.target.style.cursor = 'move';
        }
      },
      // 开始拖拽
      onDragstart: (event) => {
        const keys = unref(expandedRowKeys);
        if (!record.isLeaf && keys.some((key) => key === record.id)) {
          collapseRows([record.id]);
          return;
        }
        // 兼容IE
        const ev = event || window.event;
        // 阻止冒泡
        ev.stopPropagation();
        // 得到源目标数据;
        position.start = record;
        const tr = ev.target as HTMLTableRowElement;
        position.sourceEl = tr;
      },
      // 拖动元素经过的元素
      onDragover: (event) => {
        const ev = event || window.event;
        // console.log(ev.target);
        // 阻止默认行为
        ev.preventDefault();
      },
      onDragenter: (event) => {
        const ev = event || window.event;
        highlightItem(ev);
      },
      // onDragleave: (event) => {
      //   const ev = event || window.event;
      //   if (ev.target.nodeName === 'TR') {
      //     ev.target.classList.remove('highlight');
      //   }
      //   console.log('移出');
      // },
      // 松开
      onDrop: async (event) => {
        const ev = event || window.event;
        // 阻止默认行为
        ev.preventDefault();

        const allTrs = closest(ev.target, 'tbody').childNodes;
        removeHighlights(allTrs);
        position.end = record;
        if (record.parent.id !== position.start.parent.id) {
          const tr = closest(ev.target, 'tr');
          const children = position.start.parent.children;
          if (!isElem1AboveElem2(tr, position.sourceEl)) {
            position.end = children[children.length - 1];
          } else {
            position.end = children[0];
          }
        }
        await onDragFinished(position);
        reorder(position);
        // animation(position);
      },
    };
  }
  // 实现动画效果
  // function animation({ start, end, sourceEl }) {
  //   // 48 是每行的高度，也可以自动获取，根据情况而定
  //   const count = 48 * (start! - end!);
  //   sourceEl.style.translate = `0px ${count}px`;
  //   setTimeout(() => {
  //     sourceEl!.style.transition = 'all 0.5s';
  //     sourceEl!.style.translate = `0px 0px`;
  //   });
  // }

  return { customRow };
}
