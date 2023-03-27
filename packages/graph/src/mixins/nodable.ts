const nodable = function <T extends new (...a: any[]) => any>(base: T) {
  return class extends base {
    data: TreeNode;
    // mixin methods or properties here
  };
};

export default nodable;
