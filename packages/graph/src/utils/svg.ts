import { NS } from '../consts/namespaces';
import { isUndefined, isNull } from 'lodash-es';

const NEAR_ZERO = 1e-14;

export const assignAttributes = function (elem, attrs) {
  for (const [key, value] of Object.entries(attrs)) {
    const ns = key.substr(0, 4) === 'xml:' ? NS.XML : key.substr(0, 6) === 'xlink:' ? NS.XLINK : null;
    if (isUndefined(value) || isNull(value)) {
      if (ns) {
        elem.removeAttributeNS(ns, key);
      } else {
        elem.removeAttribute(key);
      }
      continue;
    }
    if (ns) {
      elem.setAttributeNS(ns, key, value);
    } else {
      elem.setAttribute(key, value);
    }
  }
};

export function createSVGNode(data) {
  if (typeof data === 'string') return document.createElementNS(NS.SVG, data) as SVGGraphicsElement;
  const shape = document.createElementNS(NS.SVG, data.element) as SVGGraphicsElement;
  assignAttributes(shape, data.attr);
  return shape;
}

let scaleVal: number | Function = 1;

export function getScale() {
  return typeof scaleVal === 'function' ? scaleVal() : scaleVal;
}

export function setScale(scale) {
  scaleVal = scale;
}

let canvasOffsetVal: [number, number] = [0, 0];

export function getCanvasOffset() {
  return canvasOffsetVal;
}

export function setCanvasOffset(canvasOffset: [number, number]) {
  canvasOffsetVal = canvasOffset;
}

export const findDefs = function (svgElement) {
  let defs = svgElement.getElementsByTagNameNS(NS.SVG, 'defs');
  if (defs.length > 0) {
    defs = defs[0];
  } else {
    defs = svgElement.ownerDocument.createElementNS(NS.SVG, 'defs');
    if (svgElement.firstChild) {
      // first child is a comment, so call nextSibling
      svgElement.insertBefore(defs, svgElement.firstChild.nextSibling);
      // svgElement.firstChild.nextSibling.before(defs); // Not safe
    } else {
      svgElement.append(defs);
    }
  }
  return defs;
};

export const getTransformList = function (elem) {
  if (elem.transform) {
    return elem.transform.baseVal;
  }
  if (elem.gradientTransform) {
    return elem.gradientTransform.baseVal;
  }
  if (elem.patternTransform) {
    return elem.patternTransform.baseVal;
  }
  return null;
};

export const matrixMultiply = function (...args) {
  const m = args.reduceRight((prev, m1) => {
    return m1.multiply(prev);
  });

  if (Math.abs(m.a) < NEAR_ZERO) {
    m.a = 0;
  }
  if (Math.abs(m.b) < NEAR_ZERO) {
    m.b = 0;
  }
  if (Math.abs(m.c) < NEAR_ZERO) {
    m.c = 0;
  }
  if (Math.abs(m.d) < NEAR_ZERO) {
    m.d = 0;
  }
  if (Math.abs(m.e) < NEAR_ZERO) {
    m.e = 0;
  }
  if (Math.abs(m.f) < NEAR_ZERO) {
    m.f = 0;
  }

  return m;
};

export const transformListToTransform = function (tlist, min?, max?) {
  const svg = document.createElementNS(NS.SVG, 'svg') as SVGSVGElement;
  if (!tlist) {
    // Or should tlist = null have been prevented before this?
    return svg.createSVGTransformFromMatrix(svg.createSVGMatrix());
  }
  min = min || 0;
  max = max || tlist.numberOfItems - 1;
  min = Number.parseInt(min);
  max = Number.parseInt(max);
  if (min > max) {
    const temp = max;
    max = min;
    min = temp;
  }
  let m = svg.createSVGMatrix();
  for (let i = min; i <= max; ++i) {
    // if our indices are out of range, just use a harmless identity matrix
    const mtom = i >= 0 && i < tlist.numberOfItems ? tlist.getItem(i).matrix : svg.createSVGMatrix();
    m = matrixMultiply(m, mtom);
  }
  return svg.createSVGTransformFromMatrix(m);
};

export const getMatrix = function (elem) {
  const tlist = getTransformList(elem);
  return transformListToTransform(tlist).matrix;
};

/*
 * 创建用于承载树状图图形的SVG根元素
 * */
export function createSVGElement(className: string) {
  const SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  SVGElement.classList.add(className);
  // SVGElement.style.opacity = '0';
  SVGElement.style.display = 'block';
  SVGElement.style.margin = '0 auto';
  return SVGElement;
}
