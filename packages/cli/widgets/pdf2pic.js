const PDF2Pic = require("pdf2pic");

module.exports = args => {
  const pdf2pic = new PDF2Pic({
    density: 100, // output pixels per inch
    savename: "untitled", // output file name
    savedir: "./images", // output file location
    format: "png", // output file format
    size: "600x600" // output size in pixels
  });

  pdf2pic.convert("/Users/qinyadong/Downloads/fangang.pdf").then(resolve => {
    console.log("image converter successfully!");

    return resolve;
  });
};
