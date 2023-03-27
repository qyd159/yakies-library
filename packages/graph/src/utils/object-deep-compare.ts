import { forOwn, has, keys, forEach, isArray, isObject, isEmpty, pick } from 'lodash-es';

/**
 * This method compares the properties of two objects
 * It returns all the different and common properties
 *
 * @param firstObject
 * @param secondObject
 * @return {Object}
 */
// CompareProperties -
const CompareProperties = (firstObject, secondObject) => {
  const differences: string[] = [];
  const common = {};
  forOwn(firstObject, (value, key: string) => {
    if (!has(secondObject, key)) {
      differences.push(key);
    } else {
      common[key] = true;
    }
  });

  forOwn(secondObject, (value, key) => {
    if (!has(firstObject, key)) {
      differences.push(key);
    } else {
      common[key] = true;
    }
  });

  return {
    differences: differences,
    common: keys(common),
  };
};

/**
 * This method compares two arrays
 * It returns true/false
 *
 * @param firstArray
 * @param secondArray
 * @return {boolean}
 */
// CompareArrays -
const CompareArrays = (firstArray, secondArray, conflictPath) => {
  let conflicts: string[] = [];
  // check for falsy
  if (!firstArray || !secondArray) {
    return false;
  }

  // process arrays
  forEach(firstArray, (firstElement, index) => {
    const currentPath = conflictPath + `[${index}]`;
    if (isArray(firstElement) && isArray(secondArray[index])) {
      const foundConflicts = CompareArrays(firstElement, secondArray[index], currentPath);
      if (!foundConflicts) {
        conflicts = conflicts.concat([currentPath]);
      } else if (!isEmpty(foundConflicts)) {
        conflicts = conflicts.concat(foundConflicts);
      }
    } else if (isObject(firstElement) && isObject(secondArray[index])) {
      const foundConflicts = CompareValuesWithConflicts(
        firstElement,
        secondArray[index],
        currentPath,
      );
      if (!isEmpty(foundConflicts)) {
        conflicts = conflicts.concat(foundConflicts);
      }
    } else {
      if (firstElement !== secondArray[index]) {
        conflicts = conflicts.concat([currentPath]);
      }
    }
  });

  return conflicts;
};

/**
 * This method compares the properties of two objects
 * It returns an array. Each element in the array is the path of the property that is different.
 *
 *
 * @param firstObject
 * @param secondObject
 * @param pathOfConflict - the starting path for the conflict; defaults to empty string
 * @param ignoreDifferentKeys - 是否忽略不同的key,只对比相同key的值
 * @return {boolean}
 */
// CompareValuesWithConflicts -
const CompareValuesWithConflicts = (
  firstObject,
  secondObject,
  pathOfConflict?,
  ignoreDifferentKeys = false,
) => {
  let conflicts: string[] = [];

  if (keys(firstObject).length !== keys(secondObject).length) {
    const result = CompareProperties(firstObject, secondObject);
    if (result && result.differences && !ignoreDifferentKeys) {
      conflicts = conflicts.concat(
        result.differences.map((diff) => (pathOfConflict ? pathOfConflict + '.' + diff : diff)),
      );
    }

    if (result && result.common) {
      firstObject = pick(firstObject, result.common);
      secondObject = pick(secondObject, result.common);
    }
  }

  forOwn(firstObject, (value, key) => {
    let conflictPath = pathOfConflict;
    if (has(firstObject, key) && has(secondObject, key)) {
      // process nested object
      if (isObject(firstObject[key]) && !isArray(firstObject[key])) {
        let currentPath = conflictPath;
        if (isEmpty(conflictPath)) {
          currentPath = key.toString();
        } else {
          currentPath += '.' + key.toString();
        }
        const foundConflicts = CompareValuesWithConflicts(
          firstObject[key],
          secondObject[key],
          currentPath,
        );
        if (!isEmpty(foundConflicts)) {
          conflicts = conflicts.concat(foundConflicts);
        }
      }

      // process array
      else if (isArray(firstObject[key])) {
        if (!isArray(secondObject[key])) {
          if (isEmpty(conflictPath)) {
            conflictPath = key.toString();
          } else {
            conflictPath += '.' + key.toString();
          }
        } else {
          let currentPath = conflictPath;
          if (isEmpty(conflictPath)) {
            currentPath = key.toString();
          } else {
            currentPath += '.' + key.toString();
          }
          const foundConflicts = CompareArrays(firstObject[key], secondObject[key], currentPath);
          if (!foundConflicts) {
            conflictPath = currentPath;
          }
          if (foundConflicts) {
            conflicts = conflicts.concat(foundConflicts);
          }
        }
      }

      // process simple object
      else {
        if (
          typeof firstObject[key] === typeof secondObject[key] &&
          firstObject[key] !== secondObject[key]
        ) {
          if (isEmpty(conflictPath)) {
            conflictPath = key.toString();
          } else {
            conflictPath += '.' + key.toString();
          }
        }
      }
    } else {
      conflicts.push(key);
    }

    // add conflict path to array if different than original path
    if (!isEmpty(conflictPath) && conflictPath !== pathOfConflict) {
      conflicts.push(conflictPath);
    }
  });
  return conflicts;
};

export { CompareProperties, CompareArrays, CompareValuesWithConflicts };
