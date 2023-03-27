const path = require("path");
var width = "1080";
var frameNth = "5";
var dither_algorithm = "floyd_steinberg";

module.exports = async args => {
  require("child_process").execFile(
    path.join(__dirname, "../vendors/gifenc.sh"),
    ["-w", width, "-n", frameNth, "-d", dither_algorithm, args.f],
    null,
    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};
