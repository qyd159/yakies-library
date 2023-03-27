export function createObserveMethod(func, context) {
  return function (...args) {
    console.log(args)
    const res = func.apply(context, args)
    console.log(res);
    return res;
  }
}
