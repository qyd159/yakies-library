import rewrite from './lib/rewrite.js';
import script from './lib/script'

function noop(req, res, next) {
  next();
}

export default function(options) {
  // sub midllewares
  return (
    [rewrite, script]

      // initialize
      .map(function(fn) {
        return fn(options);
      })

      // reduce right.
      .reverse()
      .reduce(function(prev, curr) {
        return function(req, res, next) {
          curr(req, res, function() {
            prev(req, res, next);
          });
        };
      }, noop)
  );

  // make sure the reduce excute even
  // the middlewares only got single child.
};
