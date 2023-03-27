import * as kld from 'kld-intersections';
import { ellipticity } from '../consts/geometry';
import { 椭圆, 点 } from '../common/图元';
import { createSVGNode, 获取当前图形 } from '../utils';
import * as inpairs from 'inpairs';
import { Combination, Permutation } from 'js-combinatorics';

const { ShapeInfo, Point2D, Intersection, IntersectionQuery } = kld;
const SMALL = 1e-1;
/** Gets all intersection points between a bunch of ellipses */
export function getIntersectionPoints(ellipses) {
  var ret = [];
  for (var i = 0; i < ellipses.length; ++i) {
    for (var j = i + 1; j < ellipses.length; ++j) {
      var intersect = ellipseEllipseIntersection(ellipses[i], ellipses[j]);
      for (var k = 0; k < intersect.length; ++k) {
        var p = intersect[k];
        p.parentIndex = [i, j];
        ret.push(p);
      }
    }
  }
  return ret;
}

/** returns whether a point is contained by all of a list of ellipses */
export function containedInEllipses(point, ellipses) {
  for (var i = 0; i < ellipses.length; ++i) {
    if (!IntersectionQuery.pointInEllipse(new Point2D(point.x, point.y), new Point2D(ellipses[i].x, ellipses[i].y), ellipses[i].radius, ellipses[i].radius * ellipticity + SMALL)) {
      return false;
    }
  }
  return true;
}

export function containedInEitherEllipse(point, ellipses) {
  for (var i = 0; i < ellipses.length; ++i) {
    if (IntersectionQuery.pointInEllipse(new Point2D(point.x, point.y), new Point2D(ellipses[i].x, ellipses[i].y), ellipses[i].radius, ellipses[i].radius * ellipticity + SMALL)) {
      return true;
    }
  }
  return false;
}

// 点在椭圆上
export function onEllipse(point, ellipse) {
  const point1 = new Point2D(point.x, point.y);
  const point2 = new Point2D(ellipse.x, ellipse.y);
  return IntersectionQuery.pointInEllipse(point1, point2, ellipse.radius + SMALL, ellipse.radius * ellipticity + SMALL) && !IntersectionQuery.pointInEllipse(point1, point2, ellipse.radius - SMALL, ellipse.radius * ellipticity - SMALL);
}

/** Returns the intersection area of a bunch of ellipses (where each ellipse
 is an object having an x,y and radius property) */
export function intersectionArea(ellipses, stats = null) {
  // get all the intersection points of the ellipses
  var intersectionPoints = getIntersectionPoints(ellipses);

  // filter out points that aren't included in all the ellipses
  var innerPoints = intersectionPoints.filter(function (p) {
    return containedInEllipses(p, ellipses);
  });

  // const 图形 = 获取当前图形();
  // 图形.清空画布()
  // let 画布尺寸 = 图形.画布尺寸.split(',');
  // 画布尺寸 = [+画布尺寸[0], +画布尺寸[1]]
  // const { scaled: ellipses2, scalePoint } = scaleSolution(ellipses, 画布尺寸[0], 画布尺寸[1], 20);
  // for (let key in ellipses2) {
  //     const ellipse = ellipses2[key];
  //     new 椭圆(ellipse, 图形).渲染()
  // }
  // intersectionPoints.forEach(point => {
  //     new 点(scalePoint(point), 图形).渲染()
  // })
  // new 点(scalePoint(getCenter(innerPoints)), 图形).渲染()

  var arcArea = 0,
    polygonArea = 0,
    arcs = [],
    i,
    overlaped = false;

  // if we have intersection points that are within all the ellipses,
  // then figure out the area contained by them
  if (innerPoints.length > 1) {
    // sort the points by angle from the center of the polygon, which lets
    // us just iterate over points to get the edges
    var center = getCenter(innerPoints);
    for (i = 0; i < innerPoints.length; ++i) {
      var p = innerPoints[i];
      p.angle = Math.atan2(p.x - center.x, p.y - center.y);
    }
    innerPoints.sort(function (a, b) {
      return b.angle - a.angle;
    });

    // iterate over all points, get arc between the points
    // and update the areas
    var p2 = innerPoints[innerPoints.length - 1];
    for (i = 0; i < innerPoints.length; ++i) {
      var p1 = innerPoints[i];

      // polygon area updates easily ...
      polygonArea += (p2.x + p1.x) * (p1.y - p2.y);

      var arc = null;

      for (var j = 0; j < p1.parentIndex.length; ++j) {
        if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
          // figure out the angle halfway between the two points
          // on the current ellipse
          var ellipse = ellipses[p1.parentIndex[j]];
          arc = {
            ellipse: ellipse,
            p1: p1,
            p2: p2,
          };
        }
      }

      if (arc !== null) {
        arcs.push(arc);
        arcArea += ellipseArea(arc.ellipse.radius, Math.atan2(p1.x - ellipse.x, p1.y - ellipse.y), Math.atan2(p2.x - ellipse.x, p2.y - ellipse.y));
        p2 = p1;
      }
    }
  } else {
    // no intersection points, is either disjoint - or is completely
    // overlapped. figure out which by examining the smallest ellipse
    var smallest = ellipses[0];
    for (i = 1; i < ellipses.length; ++i) {
      if (ellipses[i].radius < smallest.radius) {
        smallest = ellipses[i];
      }
    }

    // make sure the smallest ellipse is completely contained in all
    // the other ellipses
    var disjoint = false;
    const point = [smallest.x + smallest.radius, 0];
    for (i = 0; i < ellipses.length; ++i) {
      if (!containedInEllipses(point, ellipses[i])) {
        disjoint = true;
        break;
      }
    }

    if (disjoint) {
      arcArea = polygonArea = 0;
    } else {
      overlaped = true;
      arcArea = smallest.radius * smallest.radius * ellipticity * Math.PI;
      arcs.push({
        ellipse: smallest,
        p1: { x: smallest.x, y: smallest.y + smallest.radius },
        p2: { x: smallest.x - SMALL, y: smallest.y + smallest.radius },
      });
    }
  }

  polygonArea /= 2;
  if (stats) {
    stats.area = arcArea + polygonArea;
    stats.arcArea = arcArea;
    stats.polygonArea = polygonArea;
    stats.arcs = arcs;
    stats.innerPoints = innerPoints;
    stats.intersectionPoints = intersectionPoints;
    stats.overlaped = overlaped;
  }

  return arcArea + polygonArea;
}

export function ellipseOverlap(r1, r2, d, alpha) {
  const ellipse1 = { x: 0, y: 0, radius: r1 };
  const ellipse2 = { x: d * Math.cos(alpha), y: d * Math.sin(alpha), radius: r2 };
  const points = ellipseEllipseIntersection(ellipse1, ellipse2);
  if (points.length) {
    // 相交
    // 要计算overlap的面积需要计算两个交点在不同的两个椭圆的共四个弧度值（分别用α1,β1,α2,β2来表示），参考https://www.cut-the-knot.org/Generalization/Cavalieri2.shtml
    points[0].y = points[0].y / ellipticity;
    points[1].y = points[1].y / ellipticity;
    const distance1 = distance(points[0], ellipse1);
    const distance2 = distance(points[1], ellipse1);
    const distance3 = distance(points[0], ellipse2);
    const distance4 = distance(points[1], ellipse2);
    const α1 = points[0].y - ellipse1.y > 0 ? Math.acos((points[0].x - ellipse1.x) / distance1) : 2 * Math.PI - Math.acos((points[0].x - ellipse1.x) / distance1);
    const β1 = points[1].y - ellipse1.y > 0 ? Math.acos((points[1].x - ellipse1.x) / distance2) : 2 * Math.PI - Math.acos((points[1].x - ellipse1.x) / distance2);
    const α2 = points[0].y - ellipse2.y > 0 ? Math.acos((points[0].x - ellipse2.x) / distance3) : 2 * Math.PI - Math.acos((points[0].x - ellipse2.x) / distance3);
    const β2 = points[1].y - ellipse2.y > 0 ? Math.acos((points[1].x - ellipse2.x) / distance4) : 2 * Math.PI - Math.acos((points[1].x - ellipse2.x) / distance4);
    return ellipseArea(ellipse1.radius, α1, β1) + ellipseArea(ellipse2.radius, α2, β2);
  } else if (distance(ellipse1, ellipse2) < Math.min(ellipse1.radius, ellipse2.radius, ellipse1.radius * ellipticity, ellipse2.radius * ellipticity)) {
    // 包含
    return ellipse1.radius < ellipse2.radius ? Math.PI * ellipticity * ellipse1.radius * ellipse1.radius : Math.PI * ellipticity * ellipse2.radius * ellipse2.radius;
  }
  // 不相交
  return 0;
}
export function ellipseEllipseIntersection(ellipse1, ellipse2) {
  const shape1 = ShapeInfo.ellipse({ cx: ellipse1.x, cy: ellipse1.y, rx: ellipse1.radius, ry: ellipse1.radius * ellipticity });
  const shape2 = ShapeInfo.ellipse({ cx: ellipse2.x, cy: ellipse2.y, rx: ellipse2.radius, ry: ellipse2.radius * ellipticity });
  const intersection = Intersection.intersect(shape1, shape2);
  if (intersection.status === 'Intersection') {
    const { points } = intersection;
    return [{ ...points[0] }, { ...points[1] }];
  } else {
    return [];
  }
}

/** euclidean distance between two points */
export function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

export function ellipseArea(r, alpha, beta) {
  const gamma = Math.abs(alpha - beta);
  return gamma > Math.PI ? (ellipticity / 2) * r * r * (Math.PI * 2 - gamma - Math.sin(Math.PI * 2 - gamma)) : (ellipticity / 2) * r * r * (gamma - Math.sin(gamma));
}

/** Returns the center of a bunch of points */
export function getCenter(points) {
  var center = { x: 0, y: 0 };
  for (var i = 0; i < points.length; ++i) {
    center.x += points[i].x;
    center.y += points[i].y;
  }
  center.x /= points.length;
  center.y /= points.length;
  return center;
}

/** Scales a solution from venn.venn or venn.greedyLayout such that it fits in
a rectangle of width/height - with padding around the borders. also
centers the diagram in the available space at the same time */
export function scaleSolution(solution, width) {
  var ellipses = [],
    setids = [];
  for (var setid in solution) {
    if (solution.hasOwnProperty(setid)) {
      setids.push(setid);
      ellipses.push(solution[setid]);
    }
  }

  var bounds = getBoundingBox(ellipses),
    xRange = bounds.xRange,
    yRange = bounds.yRange;

  if (xRange.max == xRange.min || yRange.max == yRange.min) {
    console.log('not scaling solution: zero size detected');
    return solution;
  }

  var scaling = width / (xRange.max - xRange.min);
  const height = (yRange.max - yRange.min) * scaling;

  var scaled = {};
  for (var i = 0; i < ellipses.length; ++i) {
    var ellipse = ellipses[i];
    scaled[setids[i]] = {
      radius: scaling * ellipse.radius,
      x: (ellipse.x - xRange.min) * scaling,
      y: height - (ellipse.y - yRange.min) * scaling,
    };
  }

  return {
    scaled,
    scalePoint: function (point) {
      const { x, y } = point;
      return {
        x: (x - xRange.min) * scaling,
        y: height - (y - yRange.min) * scaling,
      };
    },
    height,
  };
}

export function getBoundingBox(ellipses) {
  var minMax = function (d) {
    var hi = Math.max.apply(
        null,
        ellipses.map(function (c) {
          return c[d] + (d === 'x' ? c.radius : c.radius * ellipticity);
        })
      ),
      lo = Math.min.apply(
        null,
        ellipses.map(function (c) {
          return c[d] - (d === 'x' ? c.radius : c.radius * ellipticity);
        })
      );
    return { max: hi, min: lo };
  };

  return { xRange: minMax('x'), yRange: minMax('y') };
}

/** returns a svg path of the intersection area of a bunch of ellipses */
export function intersectionAreaPath(ellipses) {
  var stats: any = {};
  intersectionArea(ellipses, stats);
  // @ts-ignore
  var arcs = stats.arcs;
  return { pathD: calculateArcsPath(arcs), stats };
}

export function calculateArcsPath(arcs, ellipses = null) {
  if (arcs.length === 0) {
    return 'M 0 0';
  } else if (arcs.length == 1) {
    var ellipse = arcs[0].ellipse;
    return ellipsePath(ellipse.x, ellipse.y, ellipse.radius);
  } else {
    // draw path around arcs
    var ret = ['\nM', arcs[0].p2.x, arcs[0].p2.y];
    for (var i = 0; i < arcs.length; ++i) {
      let flags = [0, 1];
      if (ellipses) {
        flags = arcPathOnEllipse(arcs[i], ellipses) || flags;
      }
      var arc = arcs[i],
        r = arc.ellipse.radius;
      ret.push('\nA', r, r * ellipticity, 0, ...flags, arc.p1.x, arc.p1.y);
    }
    return ret.join(' ');
  }
}

const possibleFlags = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

function arcPathOnEllipse(arc, ellipses) {
  const r = arc.ellipse.radius;
  const otherEllipses = ellipses.filter((ellipse) => ellipse !== arc.ellipse);
  for (const possibleFlag of possibleFlags) {
    const ret = ['\nM', arc.p2.x, arc.p2.y, '\nA', r, r * ellipticity, 0, ...possibleFlag, arc.p1.x, arc.p1.y];
    const path = createSVGNode('path') as SVGPathElement;
    path.setAttribute('d', ret.join(' '));
    const arcMiddlePoint = path.getPointAtLength(path.getTotalLength() / 2);
    if (onEllipse(arcMiddlePoint, arc.ellipse)) {
      if (!containedInEitherEllipse(arcMiddlePoint, otherEllipses)) {
        return possibleFlag;
      } else if (!arc.isIsolatedArc) {
        return possibleFlag;
      }
    }
  }
}

export function ellipsePath(x, y, r) {
  var ret = [];
  ret.push('\nM', x, y);
  ret.push('\nm', -r, 0);
  ret.push('\na', r, r * ellipticity, 0, 1, 0, r * 2, 0);
  ret.push('\na', r, r * ellipticity, 0, 1, 0, -r * 2, 0);
  return ret.join(' ');
}

/**
 * 1、各个椭圆不与其它椭圆相交的区域
 * 需要定位3个相交点，然后计算出svgpath。
 * 解析：一个点在目标椭圆的内部、另外两个点是目标椭圆和第二个椭圆的交点，但该点不在第三个椭圆上
 */
export function intersectionIsolatedAreaPath(ellipses, stats) {
  const { intersectionPoints, innerPoints } = stats;
  const results = [];
  if (innerPoints.length === 0) return results;
  if (innerPoints.length === 2) {
    const arcs1 = [
      {
        ellipse: ellipses[0],
        p1: innerPoints[0],
        p2: innerPoints[1],
        isIsolatedArc: true,
      },
      {
        ellipse: ellipses[1],
        p1: innerPoints[1],
        p2: innerPoints[0],
        isIsolatedArc: false,
      },
    ];
    const arcs2 = [
      {
        ellipse: ellipses[1],
        p1: innerPoints[0],
        p2: innerPoints[1],
        isIsolatedArc: true,
      },
      {
        ellipse: ellipses[0],
        p1: innerPoints[1],
        p2: innerPoints[0],
        isIsolatedArc: false,
      },
    ];
    return [
      {
        arcs: arcs1,
        path: calculateArcsPath(arcs1, ellipses),
        ellipse: ellipses[0],
      },
      {
        arcs: arcs2,
        path: calculateArcsPath(arcs2, ellipses),
        ellipse: ellipses[1],
      },
    ];
  }
  for (let i = 0; i < ellipses.length; i++) {
    const ellipse = ellipses[i];
    const innerPoint = intersectionPoints.filter((point) => innerPoints.includes(point)).filter((point) => !onEllipse(point, ellipse))[0];
    const onPoints = intersectionPoints.filter((point) => onEllipse(point, ellipse)).filter((point) => !innerPoints.includes(point));
    const points = intersectionPoints.length <= 2 ? intersectionPoints : [innerPoint, ...onPoints];
    const arcs = [];
    let p2 = points[points.length - 1];
    for (let i = 0; i < points.length; i++) {
      let p1 = points[i],
        arc = null;
      for (var j = 0; j < p1.parentIndex.length; ++j) {
        if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
          // figure out the angle halfway between the two points
          // on the current ellipse
          var ellipse2 = ellipses[p1.parentIndex[j]];
          arc = {
            ellipse: ellipse2,
            p1: p1,
            p2: p2,
            isIsolatedArc: ellipse === ellipse2 || intersectionPoints.length <= 2,
          };
        }
      }
      if (arc) {
        arcs.push(arc);
        p2 = p1;
      }
    }
    results.push({ arcs, path: calculateArcsPath(arcs, ellipses), ellipse });
  }
  return results;
}

export function intersectionPairsAreaPath(ellipses, stats) {
  const { intersectionPoints, innerPoints } = stats;
  const results = [];
  if (ellipses.length === 2) {
    const arcs = [
      {
        ellipse: ellipses[0],
        p1: innerPoints[0],
        p2: innerPoints[1],
      },
      {
        ellipse: ellipses[1],
        p1: innerPoints[1],
        p2: innerPoints[0],
      },
    ];
    return [
      {
        arcs,
        path: calculateArcsPath(arcs, ellipses),
        ellipses,
      },
    ];
  }
  [...new Combination(ellipses, 2)].forEach(([ellipse1, ellipse2]) => {
    const twoPoints = getIntersectionPoints([ellipse1, ellipse2]);
    const intersectionPoints2 = intersectionPoints.filter((point) => twoPoints.some((point2) => equivalentPoints(point, point2)));
    const points =
      intersectionPoints.length <= 2
        ? intersectionPoints
        : [intersectionPoints2.find((point) => !innerPoints.some((innerPoint) => equivalentPoints(point, innerPoint))), ...innerPoints.filter((point) => !intersectionPoints2.some((point2) => equivalentPoints(point, point2)))];
    const arcs = [];
    let p2 = points[points.length - 1];
    for (let i = 0; i < points.length; i++) {
      let p1 = points[i],
        arc = null;
      for (var j = 0; j < p1.parentIndex.length; ++j) {
        if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
          // figure out the angle halfway between the two points
          // on the current ellipse
          arc = {
            ellipse: ellipses[p1.parentIndex[j]],
            p1: p1,
            p2: p2,
          };
        }
      }
      if (arc) {
        arcs.push(arc);
        p2 = p1;
      }
    }
    results.push({ arcs, path: calculateArcsPath(arcs, ellipses), ellipses: [ellipse1, ellipse2] });
  });
  return results;
}

export function equivalentPoints(point1, point2) {
  return distance(point1, point2) < SMALL;
}
