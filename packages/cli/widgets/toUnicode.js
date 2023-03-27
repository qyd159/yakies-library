module.exports = async function run() {
  function toUnicode(s) {
    return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function(s) {
      return "\\u" + s.charCodeAt(0).toString(16);
    });
  }
  console.log(toUnicode("您好，我是您的智能助手。请问你需要咨询什么问题？"));
};
