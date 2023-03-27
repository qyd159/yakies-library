import { nelderMead, bisect, conjugateGradient, zeros, zerosM, norm2, scale } from 'fmin';
import { scaleSolution, intersectionArea, ellipseOverlap, ellipseEllipseIntersection, distance, getBoundingBox, calculateArcsPath, getIntersectionPoints, getCenter } from '../utils/ellipseintersection';
import { 获取当前图形, 获取取样方向 } from '../utils';
import { 点, 填充区域 } from '../common/图元';
import { ellipticity, overlapedPaddig } from '../consts/geometry';
import * as kld from 'kld-intersections';
import { Combination, Permutation } from 'js-combinatorics';
import { map, chunk, flatten } from 'lodash-es';

const { ShapeInfo, Point2D, Intersection, IntersectionQuery } = kld;
/** given a list of set objects, and their corresponding overlaps.
updates the (x, y, radius) attribute on each set such that their positions
roughly correspond to the desired overlaps */
export function venn(areas, parameters, overlaped, 类型) {
  parameters = parameters || {};
  parameters.maxIterations = parameters.maxIterations || 500;
  var initialLayout = parameters.initialLayout || bestInitialLayout;
  var loss = parameters.lossFunction || lossFunction;
  // add in missing pairwise areas as having 0 size
  areas = addMissingAreas(areas, overlaped);

  // initial layout is done greedily
  var ellipses = initialLayout(areas, parameters, 类型);
  const 图形 = 获取当前图形();
  const 子图 = 图形.当前布局子图;
  const 取样方向 = 获取取样方向();
  // transform x/y coordinates to a vector to optimize
  var initial = [],
    setids = [],
    setid,
    fixedDimension;
  for (setid in ellipses) {
    if (ellipses.hasOwnProperty(setid)) {
      initial.push(ellipses[setid].x);
      initial.push(ellipses[setid].y);
      setids.push(setid);
    }
  }

  // 在包含集中各个集合椭圆的中心点在同一水平或竖直线上
  if (图形.韦恩图类型 === '包含集') {
    fixedDimension = 取样方向 === 'x' ? initial[1] : initial[0];
    initial = chunk(initial, 2).map((point) => (取样方向 === 'x' ? point[0] : point[1]));
  }

  // 对于包含集-一层包含-双子集不能使用nelderMead算法，无法进行收敛，应该使用bisect算法
  // optimize initial layout from our loss function
  var totalFunctionCalls = 0;
  var solution, positions;
  if (图形.韦恩图类型 === '包含集' && 子图.类型 === '一层包含' && 子图.一层包含.类型 === '双子集') {
    const ellipseArr = map(ellipses, (ellipse) => ellipse).sort((a, b) => (a.size > b.size ? -1 : 1));
    let current: any = {};
    const d =
      子图.一层包含.双子集.类型 === '子集相交'
        ? bisect(
            (d) => {
              var j = 0,
                output = 0;
              for (var i = 0; i < setids.length; ++i) {
                var setid = setids[i];
                if (ellipses[setid].radius === ellipseArr[0].radius) {
                  current[setid] = ellipseArr[0];
                } else {
                  current[setid] = {
                    x: 取样方向 === 'x' ? ellipseArr[0].x + (j === 0 ? d : -d) : ellipseArr[0].x,
                    y: 取样方向 === 'y' ? ellipseArr[0].y + (j === 0 ? d : -d) : ellipseArr[0].y,
                    radius: ellipses[setid].radius,
                    size: ellipses[setid].size,
                  };
                  j++;
                }
              }
              for (var i = 0; i < areas.length; ++i) {
                var area = areas[i],
                  overlap,
                  bias = 0;
                if (area.sets.length == 1) {
                  continue;
                } else if (area.sets.length == 2) {
                  var left = current[area.sets[0]],
                    right = current[area.sets[1]];
                  const distance1 = distance(left, right);
                  overlap = ellipseOverlap(left.radius, right.radius, distance1, Math.atan2(right.y - left.y, right.x - left.x));
                }
                output += overlap - area.size;
              }
              return output;
            },
            0,
            ellipseArr[0].radius * (取样方向 === 'x' ? 1 : ellipticity)
          )
        : ((ellipseArr[0].radius - ellipseArr[1].radius * 2) / 3 + ellipseArr[1].radius) * (取样方向 === 'x' ? 1 : ellipticity);
    var j = 0;
    for (var i = 0; i < setids.length; ++i) {
      var setid = setids[i];
      if (ellipses[setid].radius === ellipseArr[0].radius) {
        current[setid] = ellipseArr[0];
      } else {
        current[setid] = {
          x: 取样方向 === 'x' ? ellipseArr[0].x + (j === 0 ? d : -d) : ellipseArr[0].x,
          y: 取样方向 === 'y' ? ellipseArr[0].y + (j === 0 ? d : -d) : ellipseArr[0].y,
          radius: ellipses[setid].radius,
          size: ellipses[setid].size,
        };
        j++;
      }
    }
    positions = flatten(map(current, (ellipse) => [ellipse.x, ellipse.y]));
  } else {
    solution = nelderMead(
      function (values) {
        if (图形.韦恩图类型 === '包含集') {
          values = values.map((dimension) => (取样方向 === 'x' ? [dimension, fixedDimension] : [fixedDimension, dimension])).flat();
        }
        totalFunctionCalls += 1;
        var current = {};
        for (var i = 0; i < setids.length; ++i) {
          var setid = setids[i];
          current[setid] = {
            x: values[2 * i],
            y: values[2 * i + 1],
            radius: ellipses[setid].radius,
            // size : ellipses[setid].size
          };
        }
        return loss(current, areas);
      },
      initial,
      parameters
    );
    // transform solution vector back to x/y points
    positions = solution.x;
    if (图形.韦恩图类型 === '包含集') {
      positions = positions.map((dimension) => (取样方向 === 'x' ? [dimension, fixedDimension] : [fixedDimension, dimension])).flat();
    }
  }

  for (var i = 0; i < setids.length; ++i) {
    setid = setids[i];
    ellipses[setid].x = positions[2 * i];
    ellipses[setid].y = positions[2 * i + 1];
  }

  return ellipses;
}

var SMALL = 1e-10;

/** Returns the distance necessary for two ellipses of radius r1 + r2 to
have the overlap area 'overlap' */
export function distanceFromIntersectArea(ellipse1, ellipse2, overlap, 取样方向) {
  const alpha = 取样方向 === 'x' ? 0 : Math.PI / 2;
  // handle complete overlapped ellipses
  if (Math.min(ellipse1.radius, ellipse2.radius) * Math.min(ellipse1.radius, ellipse2.radius) * ellipticity * Math.PI <= overlap + SMALL) {
    return Math.abs(ellipse1.radius - ellipse2.radius) * (1 - overlapedPaddig);
  }

  if (overlap < SMALL) {
    return 0;
  }

  return bisect(
    function (distance) {
      return ellipseOverlap(ellipse1.radius, ellipse2.radius, distance, alpha) - overlap;
    },
    0,
    取样方向 === 'x' ? ellipse1.radius + ellipse2.radius : (ellipse1.radius + ellipse2.radius) * ellipticity
  );
}

export function distanceFromAxis(ellipse1, ellipse2, overlap, 方向) {
  // handle complete overlapped ellipses
  if (Math.min(ellipse1.radius, ellipse2.radius) * Math.min(ellipse1.radius, ellipse2.radius) * ellipticity * Math.PI <= overlap + SMALL) {
    return [Math.abs(ellipse1.radius - ellipse2.radius) * (1 - overlapedPaddig) * (方向 === 'x' ? 1 : ellipticity), true];
  }

  if (方向 === 'x') {
    return [
      bisect(
        function (y) {
          const distance1 = distance(ellipse1, { x: ellipse2.x, y });
          const alpha = Math.acos((ellipse2.x - ellipse1.x) / distance1);
          return ellipseOverlap(ellipse1.radius, ellipse2.radius, distance1, alpha) - overlap;
        },
        ellipse1.y,
        ellipse1.y + ellipse1.radius * ellipticity + ellipse2.radius * ellipticity
      ),
      false,
    ];
  } else {
    return [
      bisect(
        function (x) {
          const distance1 = distance(ellipse1, { x, y: ellipse2.y });
          const alpha = Math.acos((ellipse2.x - ellipse1.x) / distance1);
          return ellipseOverlap(ellipse1.radius, ellipse2.radius, distance1, alpha) - overlap;
        },
        ellipse1.x,
        ellipse1.x + ellipse1.radius + ellipse2.radius
      ),
      false,
    ];
  }
}

/** Missing pair-wise intersection area data can cause problems:
 treating as an unknown means that sets will be laid out overlapping,
 which isn't what people expect. To reflect that we want disjoint sets
 here, set the overlap to 0 for all missing pairwise set intersections */
function addMissingAreas(areas, overlaped) {
  areas = areas.slice();

  // two ellipse intersections that aren't defined
  var ids = [],
    pairs = {},
    i,
    j,
    a,
    b,
    primitiveAreas = [];
  for (i = 0; i < areas.length; ++i) {
    var area = areas[i];
    if (area.sets.length == 1) {
      ids.push(area.sets[0]);
      primitiveAreas.push(area);
    } else if (area.sets.length == 2) {
      a = area.sets[0];
      b = area.sets[1];
      // @ts-ignore
      pairs[[a, b]] = true;
      // @ts-ignore
      pairs[[b, a]] = true;
    }
  }
  ids.sort(function (a, b) {
    return a > b ? 1 : -1;
  });

  for (i = 0; i < ids.length; ++i) {
    a = ids[i];
    for (j = i + 1; j < ids.length; ++j) {
      b = ids[j];
      // @ts-ignore
      if (!([a, b] in pairs)) {
        if (overlaped) {
          areas.push({
            sets: [a, b],
            size: Math.min(primitiveAreas.find((area) => area.sets.join('') === a).size, primitiveAreas.find((area) => area.sets.join('') === b).size),
          });
        } else {
          areas.push({
            sets: [a, b],
            size: 0,
          });
        }
      }
    }
  }
  return areas;
}

/// Returns two matrices, one of the euclidean distances between the sets
/// and the other indicating if there are subset or disjoint set relationships
export function getDistanceMatrices(areas, sets, setids) {
  // initialize an empty distance matrix between all the points
  var distances = zerosM(sets.length, sets.length),
    constraints = zerosM(sets.length, sets.length);

  // compute required distances between all the sets such that
  // the areas match
  areas
    .filter(function (x) {
      return x.sets.length == 2;
    })
    .map(function (current) {
      var left = setids[current.sets[0]],
        right = setids[current.sets[1]],
        r1 = Math.sqrt(sets[left].size / Math.PI),
        r2 = Math.sqrt(sets[right].size / Math.PI),
        // @ts-ignore
        distance = distanceFromIntersectArea(
          { radius: r1 },
          {
            radius: r2,
          },
          current.size
        );

      distances[left][right] = distances[right][left] = distance;

      // also update constraints to indicate if its a subset or disjoint
      // relationship
      var c = 0;
      if (current.size + 1e-10 >= Math.min(sets[left].size, sets[right].size)) {
        c = 1;
      } else if (current.size <= 1e-10) {
        c = -1;
      }
      constraints[left][right] = constraints[right][left] = c;
    });

  return { distances: distances, constraints: constraints };
}

/// computes the gradient and loss simulatenously for our constrained MDS optimizer
function constrainedMDSGradient(x, fxprime, distances, constraints) {
  var loss = 0,
    i;
  for (i = 0; i < fxprime.length; ++i) {
    fxprime[i] = 0;
  }

  for (i = 0; i < distances.length; ++i) {
    var xi = x[2 * i],
      yi = x[2 * i + 1];
    for (var j = i + 1; j < distances.length; ++j) {
      var xj = x[2 * j],
        yj = x[2 * j + 1],
        dij = distances[i][j],
        constraint = constraints[i][j];

      var squaredDistance = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi),
        distance = Math.sqrt(squaredDistance),
        delta = squaredDistance - dij * dij;

      if ((constraint > 0 && distance <= dij) || (constraint < 0 && distance >= dij)) {
        continue;
      }

      loss += 2 * delta * delta;

      fxprime[2 * i] += 4 * delta * (xi - xj);
      fxprime[2 * i + 1] += 4 * delta * (yi - yj);

      fxprime[2 * j] += 4 * delta * (xj - xi);
      fxprime[2 * j + 1] += 4 * delta * (yj - yi);
    }
  }
  return loss;
}

/// takes the best working variant of either constrained MDS or greedy
export function bestInitialLayout(areas, params, 类型) {
  var initial = greedyLayout(areas, params, 类型);
  var loss = params.lossFunction || lossFunction;

  // greedylayout is sufficient for all 2/3 ellipse cases. try out
  // constrained MDS for higher order problems, take its output
  // if it outperforms. (greedy is aesthetically better on 2/3 ellipses
  // since it axis aligns)
  // if (areas.length >= 8) {
  //     var constrained = constrainedMDSLayout(areas, params),
  //         constrainedLoss = loss(constrained, areas),
  //         greedyLoss = loss(initial, areas);

  //     if (constrainedLoss + 1e-8 < greedyLoss) {
  //         initial = constrained;
  //     }
  // }
  return initial;
}

/// use the constrained MDS variant to generate an initial layout
export function constrainedMDSLayout(areas, params) {
  params = params || {};
  var restarts = params.restarts || 10;

  // bidirectionally map sets to a rowid  (so we can create a matrix)
  var sets = [],
    setids = {},
    i;
  for (i = 0; i < areas.length; ++i) {
    var area = areas[i];
    if (area.sets.length == 1) {
      setids[area.sets[0]] = sets.length;
      sets.push(area);
    }
  }

  var matrices = getDistanceMatrices(areas, sets, setids),
    distances = matrices.distances,
    constraints = matrices.constraints;

  // keep distances bounded, things get messed up otherwise.
  // TODO: proper preconditioner?
  var norm = norm2(distances.map(norm2)) / distances.length;
  distances = distances.map(function (row) {
    return row.map(function (value) {
      return value / norm;
    });
  });

  var obj = function (x, fxprime) {
    return constrainedMDSGradient(x, fxprime, distances, constraints);
  };

  var best, current;
  for (i = 0; i < restarts; ++i) {
    var initial = zeros(distances.length * 2).map(Math.random);

    current = conjugateGradient(obj, initial, params);
    if (!best || current.fx < best.fx) {
      best = current;
    }
  }
  var positions = best.x;

  // translate rows back to (x,y,radius) coordinates
  var ellipses = {};
  for (i = 0; i < sets.length; ++i) {
    var set = sets[i];
    ellipses[set.sets[0]] = {
      x: positions[2 * i] * norm,
      y: positions[2 * i + 1] * norm,
      radius: Math.sqrt(set.size / Math.PI),
    };
  }

  if (params.history) {
    for (i = 0; i < params.history.length; ++i) {
      scale(params.history[i].x, norm);
    }
  }
  return ellipses;
}

/** Lays out a Venn diagram greedily, going from most overlapped sets to
least overlapped, attempting to position each new set such that the
overlapping areas to already positioned sets are basically right */
export function greedyLayout(areas, params, 类型) {
  const 取样方向 = 获取取样方向();
  var loss = params && params.lossFunction ? params.lossFunction : lossFunction;
  // define a ellipse for each set
  var ellipses = {},
    setOverlaps = {},
    set;
  for (var i = 0; i < areas.length; ++i) {
    var area = areas[i];
    if (area.sets.length == 1) {
      set = area.sets[0];
      ellipses[set] = {
        x: 1e10,
        y: 1e10,
        // rowid: ellipses.length,
        size: area.size,
        radius: Math.sqrt(area.size / Math.PI / ellipticity),
      };
      setOverlaps[set] = [];
    }
  }
  areas = areas.filter(function (a) {
    return a.sets.length == 2;
  });

  // map each set to a list of all the other sets that overlap it
  for (i = 0; i < areas.length; ++i) {
    var current = areas[i];
    var weight = current.hasOwnProperty('weight') ? current.weight : 1.0;
    var left = current.sets[0],
      right = current.sets[1];

    // completely overlapped ellipses shouldn't be positioned early here
    if (current.size + SMALL >= Math.min(ellipses[left].size, ellipses[right].size)) {
      weight = 0;
    }

    setOverlaps[left].push({ set: right, size: current.size, weight: weight });
    setOverlaps[right].push({ set: left, size: current.size, weight: weight });
  }

  // get list of most overlapped sets
  var mostOverlapped = [];
  for (set in setOverlaps) {
    if (setOverlaps.hasOwnProperty(set)) {
      var size = 0;
      for (i = 0; i < setOverlaps[set].length; ++i) {
        size += setOverlaps[set][i].size * setOverlaps[set][i].weight;
      }

      mostOverlapped.push({ set: set, size: size });
    }
  }

  // sort by size desc
  function sortOrder(a, b) {
    return b.size - a.size;
  }
  mostOverlapped.sort(sortOrder);

  // keep track of what sets have been laid out
  var positioned = {};
  function isPositioned(element) {
    return element.set in positioned;
  }

  // adds a point to the output
  function positionSet(point, index) {
    ellipses[index].x = point.x;
    ellipses[index].y = point.y;
    positioned[index] = true;
  }

  // add most overlapped set at (0,0)
  positionSet({ x: 0, y: 0 }, mostOverlapped[0].set);

  // get distances between all points. TODO, necessary?
  // answer: probably not
  // var distances = venn.getDistanceMatrices(ellipses, areas).distances;
  for (i = 1; i < mostOverlapped.length; ++i) {
    var setIndex = mostOverlapped[i].set,
      overlap = setOverlaps[setIndex].filter(isPositioned);
    set = ellipses[setIndex];
    overlap.sort(sortOrder);

    if (overlap.length === 0) {
      // this shouldn't happen anymore with addMissingAreas
      throw 'ERROR: missing pairwise overlap information';
    }

    var points = [];
    for (var j = 0; j < overlap.length; ++j) {
      // get appropriate distance from most overlapped already added set
      var p1 = ellipses[overlap[j].set],
        // 这里从水平或垂直方向计算逼近overlap大小的实际距离
        d1 = distanceFromIntersectArea(set, p1, overlap[j].size, 取样方向);

      // sample positions at 90 degrees for maximum aesthetics
      if (取样方向 === 'x') {
        points.push({ x: p1.x + d1, y: p1.y });
      } else {
        points.push({ x: p1.x, y: p1.y - d1 });
      }

      if (类型 !== '三层包含') {
        if (取样方向 === 'x') {
          points.push({ x: p1.x - d1, y: p1.y });
        } else {
          points.push({ x: p1.x, y: p1.y + d1 });
        }
      }

      // if we have at least 2 overlaps, then figure out where the
      // set should be positioned analytically and try those too
      for (var k = j + 1; k < overlap.length; ++k) {
        var p2 = ellipses[overlap[k].set],
          // 三个集合相交，待加入的集合需要定位到另外两个集合的相交点的连线上，暂不考虑三个以上的集合
          [d2, overlaped] = distanceFromAxis(p2, 取样方向 === 'x' ? { radius: set.radius, x: (p1.x + p2.x) / 2 } : { radius: set.radius, y: (p1.y + p2.y) / 2 }, overlap[k].size, 取样方向);
        if (!overlaped) {
          points.push(取样方向 === 'x' ? { x: (p1.x + p2.x) / 2, y: p2.y + d2 } : { x: p2.x + d2, y: (p1.y + p2.y) / 2 });
          // points.push(取样方向 === 'x' ? { x: (p1.x + p2.x) / 2, y: p2.y - d2 } : { x: p2.x - d2, y: (p1.y + p2.y) / 2 })
        } else {
          points.push(取样方向 === 'x' ? { x: p2.x + d2, y: p2.y } : { x: p2.x, y: p2.y - d2 });
        }
      }
    }

    // we have some candidate positions for the set, examine loss
    // at each position to figure out where to put it at
    var bestLoss = 1e50,
      bestPoint = points[0];
    for (j = 0; j < points.length; ++j) {
      ellipses[setIndex].x = points[j].x;
      ellipses[setIndex].y = points[j].y;
      var localLoss = loss(ellipses, areas);
      if (localLoss < bestLoss) {
        bestLoss = localLoss;
        bestPoint = points[j];
      }
    }

    positionSet(bestPoint, setIndex);
  }

  return ellipses;
}

/** Given a bunch of sets, and the desired overlaps between these sets - computes
the distance from the actual overlaps to the desired overlaps. Note that
this method ignores overlaps of more than 2 ellipses */
export function lossFunction(sets, overlaps) {
  var output = 0;

  function getEllipses(indices) {
    return indices.map(function (i) {
      return sets[i];
    });
  }

  const 取样方向 = 获取取样方向();

  for (var i = 0; i < overlaps.length; ++i) {
    var area = overlaps[i],
      overlap,
      bias = 0;
    if (area.sets.length == 1) {
      continue;
    } else if (area.sets.length == 2) {
      var left = sets[area.sets[0]],
        right = sets[area.sets[1]];
      const distance1 = distance(left, right);
      overlap = ellipseOverlap(left.radius, right.radius, distance1, Math.atan2(right.y - left.y, right.x - left.x));
      const smaller = left.radius < right.radius ? left : right;
      const larger = left.radius > right.radius ? left : right;
      if (larger.y < smaller.y && 取样方向 === 'x') {
        bias = smaller.y - larger.y;
      }
    } else {
      const stats: any = {};
      const ellipses = getEllipses(area.sets);
      overlap = intersectionArea(ellipses, stats);
      if (stats.overlaped && 取样方向 === 'x') {
        const smallest = stats.arcs[0].ellipse;
        const larger = ellipses.filter((ellipse) => ellipse.radius > smallest.radius);
        if (larger.x > smallest.x) {
          bias = larger.x - smallest.x;
        }
      } else if (stats.overlaped && 取样方向 === 'y') {
        const smallest = stats.arcs[0].ellipse;
        const larger = ellipses.find((ellipse) => ellipse.radius > smallest.radius);
        if (larger.y > smallest.y) {
          bias = larger.y - smallest.y;
        }
      }
    }

    var weight = area.hasOwnProperty('weight') ? area.weight : 1.0;
    output += weight * (overlap - area.size) * (overlap - area.size);
    output += bias;
  }

  return output;
}

// orientates a bunch of ellipses to point in orientation
function orientateEllipses(ellipses, orientation, orientationOrder) {
  if (orientationOrder === null) {
    ellipses.sort(function (a, b) {
      return b.radius - a.radius;
    });
  } else {
    ellipses.sort(orientationOrder);
  }

  var i;
  // shift ellipses so largest ellipse is at (0, 0)
  if (ellipses.length > 0) {
    var largestX = ellipses[0].x,
      largestY = ellipses[0].y;

    for (i = 0; i < ellipses.length; ++i) {
      ellipses[i].x -= largestX;
      ellipses[i].y -= largestY;
    }
  }

  if (ellipses.length == 2) {
    // if the second ellipse is a subset of the first, arrange so that
    // it is off to one side. hack for https://github.com/benfred/venn.js/issues/120
    var dist = distance(ellipses[0], ellipses[1]);
    if (dist < Math.abs(ellipses[1].radius - ellipses[0].radius)) {
      ellipses[1].x = ellipses[0].x + ellipses[0].radius - ellipses[1].radius - 1e-10;
      ellipses[1].y = ellipses[0].y;
    }
  }

  // rotate ellipses so that second largest is at an angle of 'orientation'
  // from largest
  if (ellipses.length > 1) {
    var rotation = Math.atan2(ellipses[1].x, ellipses[1].y) - orientation,
      c = Math.cos(rotation),
      s = Math.sin(rotation),
      x,
      y;

    for (i = 0; i < ellipses.length; ++i) {
      x = ellipses[i].x;
      y = ellipses[i].y;
      ellipses[i].x = c * x - s * y;
      ellipses[i].y = s * x + c * y;
    }
  }

  // mirror solution if third solution is above plane specified by
  // first two ellipses
  if (ellipses.length > 2) {
    var angle = Math.atan2(ellipses[2].x, ellipses[2].y) - orientation;
    while (angle < 0) {
      angle += 2 * Math.PI;
    }
    while (angle > 2 * Math.PI) {
      angle -= 2 * Math.PI;
    }
    if (angle > Math.PI) {
      var slope = ellipses[1].y / (1e-10 + ellipses[1].x);
      for (i = 0; i < ellipses.length; ++i) {
        var d = (ellipses[i].x + slope * ellipses[i].y) / (1 + slope * slope);
        ellipses[i].x = 2 * d - ellipses[i].x;
        ellipses[i].y = 2 * d * slope - ellipses[i].y;
      }
    }
  }
}

export function disjointCluster(ellipses) {
  // union-find clustering to get disjoint sets
  ellipses.map(function (ellipse) {
    ellipse.parent = ellipse;
  });

  // path compression step in union find
  function find(ellipse) {
    if (ellipse.parent !== ellipse) {
      ellipse.parent = find(ellipse.parent);
    }
    return ellipse.parent;
  }

  function union(x, y) {
    var xRoot = find(x),
      yRoot = find(y);
    xRoot.parent = yRoot;
  }

  // get the union of all overlapping sets
  for (var i = 0; i < ellipses.length; ++i) {
    for (var j = i + 1; j < ellipses.length; ++j) {
      var maxDistance = ellipses[i].radius + ellipses[j].radius;
      if (distance(ellipses[i], ellipses[j]) + 1e-10 < maxDistance) {
        union(ellipses[j], ellipses[i]);
      }
    }
  }

  // find all the disjoint clusters and group them together
  var disjointClusters = {},
    setid;
  for (i = 0; i < ellipses.length; ++i) {
    setid = find(ellipses[i]).parent.setid;
    if (!(setid in disjointClusters)) {
      disjointClusters[setid] = [];
    }
    disjointClusters[setid].push(ellipses[i]);
  }

  // cleanup bookkeeping
  ellipses.map(function (ellipse) {
    delete ellipse.parent;
  });

  // return in more usable form
  var ret = [];
  for (setid in disjointClusters) {
    if (disjointClusters.hasOwnProperty(setid)) {
      ret.push(disjointClusters[setid]);
    }
  }
  return ret;
}

export function normalizeSolution(solution, orientation, orientationOrder) {
  if (orientation === null) {
    orientation = Math.PI / 2;
  }

  // work with a list instead of a dictionary, and take a copy so we
  // don't mutate input
  var ellipses = [],
    i,
    setid;
  for (setid in solution) {
    if (solution.hasOwnProperty(setid)) {
      var previous = solution[setid];
      ellipses.push({
        x: previous.x,
        y: previous.y,
        radius: previous.radius,
        setid: setid,
      });
    }
  }

  // get all the disjoint clusters
  var clusters = disjointCluster(ellipses);

  // orientate all disjoint sets, get sizes
  for (i = 0; i < clusters.length; ++i) {
    orientateEllipses(clusters[i], orientation, orientationOrder);
    var bounds = getBoundingBox(clusters[i]);
    clusters[i].size = (bounds.xRange.max - bounds.xRange.min) * (bounds.yRange.max - bounds.yRange.min);
    clusters[i].bounds = bounds;
  }
  clusters.sort(function (a, b) {
    return b.size - a.size;
  });

  // orientate the largest at 0,0, and get the bounds
  ellipses = clusters[0];
  // @ts-ignore
  var returnBounds = ellipses.bounds;

  var spacing = (returnBounds.xRange.max - returnBounds.xRange.min) / 50;

  function addCluster(cluster, right, bottom) {
    if (!cluster) return;

    var bounds = cluster.bounds,
      xOffset,
      yOffset,
      centreing;

    if (right) {
      xOffset = returnBounds.xRange.max - bounds.xRange.min + spacing;
    } else {
      xOffset = returnBounds.xRange.max - bounds.xRange.max;
      centreing = (bounds.xRange.max - bounds.xRange.min) / 2 - (returnBounds.xRange.max - returnBounds.xRange.min) / 2;
      if (centreing < 0) xOffset += centreing;
    }

    if (bottom) {
      yOffset = returnBounds.yRange.max - bounds.yRange.min + spacing;
    } else {
      yOffset = returnBounds.yRange.max - bounds.yRange.max;
      centreing = (bounds.yRange.max - bounds.yRange.min) / 2 - (returnBounds.yRange.max - returnBounds.yRange.min) / 2;
      if (centreing < 0) yOffset += centreing;
    }

    for (var j = 0; j < cluster.length; ++j) {
      cluster[j].x += xOffset;
      cluster[j].y += yOffset;
      ellipses.push(cluster[j]);
    }
  }

  var index = 1;
  while (index < clusters.length) {
    addCluster(clusters[index], true, false);
    addCluster(clusters[index + 1], false, true);
    addCluster(clusters[index + 2], true, true);
    index += 3;

    // have one cluster (in top left). lay out next three relative
    // to it in a grid
    returnBounds = getBoundingBox(ellipses);
  }

  // convert back to solution form
  var ret = {};
  for (i = 0; i < ellipses.length; ++i) {
    ret[ellipses[i].setid] = ellipses[i];
  }
  return ret;
}

export function overlappedEllipses(ellipses) {
  var ret = {},
    ellipseids = [];
  for (var ellipseid in ellipses) {
    ellipseids.push(ellipseid);
    ret[ellipseid] = [];
  }

  [...new Combination(ellipseids, 2)].forEach(([id1, id2]) => {
    var a = ellipses[id1];
    var b = ellipses[id2],
      d = distance(a, b);

    if (getIntersectionPoints([a, b]).length === 0 && distance(a, b) < Math.abs(a.radius - b.radius)) {
      if (a.radius < b.radius) {
        ret[id1].push(id2);
      } else {
        ret[id2].push(id1);
      }
    }
  });
  return ret;
}

export function computeTextCentres(ellipses, areas, 类型) {
  var ret = {},
    overlapped = overlappedEllipses(ellipses);
  for (var i = 0; i < areas.length; ++i) {
    var area = areas[i].sets,
      areaids = {},
      exclude = {};
    for (var j = 0; j < area.length; ++j) {
      areaids[area[j]] = true;
      var overlaps = overlapped[area[j]];
      // keep track of any circles that overlap this area,
      // and don't consider for purposes of computing the text
      // centre
      for (var k = 0; k < overlaps.length; ++k) {
        exclude[overlaps[k]] = true;
      }
    }

    var interior = [],
      exterior = [];
    for (var setid in ellipses) {
      if (setid in areaids) {
        interior.push(ellipses[setid]);
      } else if (!(setid in exclude)) {
        exterior.push(ellipses[setid]);
      }
    }
    var centre = computeTextCentre(interior, exterior, 类型);
    area.sort();
    if (interior.length === 2 && exterior.length === 1 && Object.keys(exclude).length === 0) {
      // 这种情况下，添加两个interior相交的情况
      const otherEllipse = Object.keys(ellipses).find((item) => !area.includes(item));
      ret[area] = computeTextCentre(interior, [], 类型);
      ret[area + '-' + otherEllipse] = centre;
    } else {
      ret[area] = centre;
    }
    if (centre.disjoint && areas[i].size > 0) {
      console.log('WARNING: area ' + area + ' not represented on screen');
    }
  }
  return ret;
}

// compute the center of some circles by maximizing the margin of
// the center point relative to the circles (interior) after subtracting
// nearby circles (exterior)
export function computeTextCentre(interior, exterior, 类型) {
  // get an initial estimate by sampling around the interior circles
  // and taking the point with the biggest margin
  var points = [],
    i;
  for (i = 0; i < interior.length; ++i) {
    var c = interior[i];
    points.push({ x: c.x, y: c.y });
    points.push({ x: c.x + c.radius / 2, y: c.y });
    points.push({ x: c.x - c.radius / 2, y: c.y });
    points.push({ x: c.x, y: c.y + (c.radius * ellipticity) / 2 });
    points.push({ x: c.x, y: c.y - (c.radius * ellipticity) / 2 });
  }
  var initial = points[0],
    margin = ellipseMargin(points[0], interior, exterior);
  for (i = 1; i < points.length; ++i) {
    var m = ellipseMargin(points[i], interior, exterior);
    if (m >= margin) {
      initial = points[i];
      margin = m;
    }
  }

  // maximize the margin numerically
  var solution = nelderMead(
    function (p) {
      let bias = 0;
      // 偏向于和椭圆平齐，和各个椭圆的圆心在一条水平线上
      if (类型 === '一层包含-单子集' || 类型 === '二层包含' || 类型 === '三层包含') {
        let sumX = 0,
          sumY = 0;
        for (i = 0; i < interior.length; ++i) {
          sumX = +Math.abs(p[0] - interior[i].x);
          sumY = +Math.abs(p[1] - interior[i].y);
        }
        for (i = 0; i < exterior.length; ++i) {
          sumX = +Math.abs(p[0] - exterior[i].x);
          sumY = +Math.abs(p[1] - exterior[i].y);
        }
        bias = Math.min(sumX, sumY);
      }
      if (类型 === '一层包含-双子集') {
        let sumX = 0,
          sumY = 0;
        for (i = 0; i < interior.length; ++i) {
          sumX = +Math.abs(p[0] - interior[i].x);
          sumY = +Math.abs(p[1] - interior[i].y);
        }
        for (i = 0; i < exterior.length; ++i) {
          sumX = +Math.abs(p[0] - exterior[i].x);
          sumY = +Math.abs(p[1] - exterior[i].y);
        }
        if (interior.length === 1 && exterior.length === 2 && interior[0].radius > exterior[0].radius + SMALL) {
          bias = 0;
        } else {
          bias = Math.min(sumX, sumY);
        }
      }
      return -1 * ellipseMargin({ x: p[0], y: p[1] }, interior, exterior) + 1 * bias;
    },
    [initial.x, initial.y],
    { maxIterations: 500, minErrorDelta: 1e-10 }
  ).x;
  var ret: any = { x: solution[0], y: solution[1] };

  // check solution, fallback as needed (happens if fully overlapped
  // etc)
  var valid = true;
  for (i = 0; i < interior.length; ++i) {
    if (distance(ret, interior[i]) > interior[i].radius) {
      valid = false;
      break;
    }
  }

  for (i = 0; i < exterior.length; ++i) {
    if (distance(ret, exterior[i]) < exterior[i].radius) {
      valid = false;
      break;
    }
  }

  if (!valid) {
    if (interior.length == 1) {
      ret = { x: interior[0].x, y: interior[0].y };
    } else {
      var areaStats: any = {};
      intersectionArea(interior, areaStats);

      if (areaStats.arcs.length === 0) {
        ret = { x: 0, y: -1000, disjoint: true };
      } else if (areaStats.arcs.length == 1) {
        ret = {
          x: areaStats.arcs[0].ellipse.x,
          y: areaStats.arcs[0].ellipse.y,
        };
      } else if (exterior.length) {
        // try again without other circles
        ret = computeTextCentre(interior, [], 类型);
      } else {
        // take average of all the points in the intersection
        // polygon. this should basically never happen
        // and has some issues:
        // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
        ret = getCenter(
          areaStats.arcs.map(function (a) {
            return a.p1;
          })
        );
      }
    }
  }

  return ret;
}

function ellipseArcDistance(ellipse, point) {
  const theta = Math.atan2(point.y - ellipse.y, point.x - ellipse.x);
  const denominator = Math.sqrt(ellipse.radius * ellipse.radius * ellipticity * ellipticity * Math.cos(theta) * Math.cos(theta) + ellipse.radius * ellipse.radius * Math.sin(theta) * Math.sin(theta));
  const pointOnEllipse = { x: ellipse.x + (ellipse.radius * ellipse.radius * ellipticity * Math.cos(theta)) / denominator, y: ellipse.y + (ellipse.radius * ellipse.radius * ellipticity * Math.sin(theta)) / denominator };
  return distance(ellipse, pointOnEllipse);
}

function ellipseMargin(current, interior, exterior) {
  var margin = ellipseArcDistance(interior[0], current) - distance(interior[0], current),
    i,
    m;
  for (i = 1; i < interior.length; ++i) {
    m = ellipseArcDistance(interior[i], current) - distance(interior[i], current);
    if (m <= margin) {
      margin = m;
    }
  }

  for (i = 0; i < exterior.length; ++i) {
    m = distance(exterior[i], current) - ellipseArcDistance(exterior[i], current);
    if (m <= margin) {
      margin = m;
    }
  }
  return margin;
}

export function getIntersectedEllipsesAreas(ellipses) {
  if (ellipses.length < 1) {
    console.error('至少需要两个不同的名称');
    return;
  }
  const areas = [];
  [...new Combination(ellipses, 2)].forEach(([ellipse1, ellipse2]) => {
    const ellipse3 = ellipses.find((ellipse) => ellipse !== ellipse1 && ellipse !== ellipse2);
    const name1 = ellipse1;
    const name2 = ellipse2;
    const name3 = ellipse3;
    const sets = [name1, name2].sort();
    areas.push(sets[0] + '∩' + sets[1]);
    if (ellipses.length === 2) {
      // areas.push(sets[0] + '∪' + sets[1] + '-' + sets[0])
      // areas.push(sets[0] + '∪' + sets[1] + '-' + sets[1])
    }
    if (ellipses.length === 3) {
      areas.push(sets[0] + '∩' + sets[1] + '-' + name3);
      // areas.push(sets[0] + '∪' + sets[1] + '-' + name3)
    }
  });
  if (ellipses.length === 3) {
    areas.push(ellipses.map((ellipse) => ellipse).join('∩'));
  }
  return areas;
}
