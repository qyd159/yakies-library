async function showMathMl(container) {
  try {
    if (!container) return;
    // let t = 0;

    // while (!MathJax || (!MathJax.mathml2chtml && t < 5)) {
    //     t++;
    //     await new Promise(resolve => setTimeout(resolve, 100));
    // }

    let mathList = container.querySelectorAll('math');
    for (let math of mathList) {
      let mml = math.outerHTML;
      math.parentNode && math.parentNode.replaceChild(MathJax.mathml2chtml(mml), math);
    }
    mathList.length && MathJax.startup.document.updateDocument();
  } catch (err) {
    console.log('showMathMl');
    console.error(err);
  }
}
showMathMl(document.getElementById('math_font_preload'));
