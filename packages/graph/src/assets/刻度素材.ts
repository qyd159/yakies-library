function loadFile(name) { // name为文件所在位置
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("image/svg+xml;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}


function readFile(filePath) {
    // 创建一个新的xhr对象
    let xhr = null
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    const okStatus = document.location.protocol === 'file' ? 0 : 200
    xhr.open('GET', filePath, false)
    xhr.overrideMimeType('image/svg+xml')
    xhr.send(null)
    return xhr.status === okStatus ? xhr.responseText : null
}

export function getkd(i) {
    let data = readFile(`./小刻度${i}.svg`)
    // data = data.replace('', '<?xml version="1.0" encoding="UTF-8"?>')
    return data
}


export const 小刻度 = [
    `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>外圈读数与刻度</title>
<g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="画板" transform="translate(-40.000000, -214.000000)">
        <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
            <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                <line x1="119" y1="13" x2="145" y2="13" id="路径-16" transform="translate(132.000000, 13.000000) rotate(270.000000) translate(-132.000000, -13.000000) "></line>
                //1-5
                <line x1="131.438887" y1="13.6518945" x2="157.438887" y2="13.6518945" id="路径-16" transform="translate(144.438887, 13.651894) rotate(276.000000) translate(-144.438887, -13.651894) "></line>
                <line x1="143.741491" y1="15.6004355" x2="169.741491" y2="15.6004355" id="路径-16" transform="translate(156.741491, 15.600436) rotate(282.000000) translate(-156.741491, -15.600436) "></line>
                <line x1="155.773022" y1="18.8242746" x2="181.773022" y2="18.8242746" id="路径-16" transform="translate(168.773022, 18.824275) rotate(288.000000) translate(-168.773022, -18.824275) "></line>
                <line x1="167.401661" y1="23.2880905" x2="193.401661" y2="23.2880905" id="路径-16" transform="translate(180.401661, 23.288091) rotate(294.000000) translate(-180.401661, -23.288091) "></line>
                <line x1="178.5" y1="28.9429769" x2="204.5" y2="28.9429769" id="路径-16" transform="translate(191.500000, 28.942977) rotate(300.000000) translate(-191.500000, -28.942977) "></line>
            </g>
            <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                <text id="4" font-size="12">
                    <tspan x="202" y="25">4</tspan>
                </text>
                <text id="3" font-size="12">
                    <tspan x="188" y="20">3</tspan>
                </text>
                <text id="2" font-size="12">
                    <tspan x="174" y="16">2</tspan>
                </text>
                <text id="1" font-size="12">
                    <tspan x="160" y="14">1</tspan>
                </text>
            </g>
        </g>
    </g>
</g>
</svg>`,
    `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<title>外圈读数与刻度</title>
<g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="画板" transform="translate(-40.000000, -214.000000)">
        <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
            <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                <line x1="178.5" y1="28.9429769" x2="204.5" y2="28.9429769" id="路径-16" transform="translate(191.500000, 28.942977) rotate(300.000000) translate(-191.500000, -28.942977) "></line>
                //6-10
                <line x1="188.946445" y1="35.7269777" x2="214.946445" y2="35.7269777" id="路径-16" transform="translate(201.946445, 35.726978) rotate(306.000000) translate(-201.946445, -35.726978) "></line>
                <line x1="198.626542" y1="43.5657658" x2="224.626542" y2="43.5657658" id="路径-16" transform="translate(211.626542, 43.565766) rotate(312.000000) translate(-211.626542, -43.565766) "></line>
                <line x1="207.434234" y1="52.3734578" x2="233.434234" y2="52.3734578" id="路径-16" transform="translate(220.434234, 52.373458) rotate(318.000000) translate(-220.434234, -52.373458) "></line>
                <line x1="215.273022" y1="62.053555" x2="241.273022" y2="62.053555" id="路径-16" transform="translate(228.273022, 62.053555) rotate(324.000000) translate(-228.273022, -62.053555) "></line>
                <line x1="222.057023" y1="72.5" x2="248.057023" y2="72.5" id="路径-16" transform="translate(235.057023, 72.500000) rotate(330.000000) translate(-235.057023, -72.500000) "></line>
            </g>
            <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                <text id="9" font-size="12">
                    <tspan x="259" y="71">9</tspan>
                </text>
                <text id="8" font-size="12">
                    <tspan x="250" y="59">8</tspan>
                </text>
                <text id="7" font-size="12">
                    <tspan x="240" y="49">7</tspan>
                </text>
                <text id="6" font-size="12">
                    <tspan x="228" y="40">6</tspan>
                </text>
            </g>
        </g>
    </g>
</g>
</svg>`,
    `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 <title>外圈读数与刻度</title>
 <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
     <g id="画板" transform="translate(-40.000000, -214.000000)">
         <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
             <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                 <line x1="222.057023" y1="72.5" x2="248.057023" y2="72.5" id="路径-16" transform="translate(235.057023, 72.500000) rotate(330.000000) translate(-235.057023, -72.500000) "></line>
                 //11-15
                 <line x1="227.711909" y1="83.5983395" x2="253.711909" y2="83.5983395" id="路径-16" transform="translate(240.711909, 83.598339) rotate(336.000000) translate(-240.711909, -83.598339) "></line>
                 <line x1="232.175725" y1="95.2269777" x2="258.175725" y2="95.2269777" id="路径-16" transform="translate(245.175725, 95.226978) rotate(342.000000) translate(-245.175725, -95.226978) "></line>
                 <line x1="235.399564" y1="107.258509" x2="261.399564" y2="107.258509" id="路径-16" transform="translate(248.399564, 107.258509) rotate(348.000000) translate(-248.399564, -107.258509) "></line>
                 <line x1="237.348106" y1="119.561113" x2="263.348106" y2="119.561113" id="路径-16" transform="translate(250.348106, 119.561113) rotate(354.000000) translate(-250.348106, -119.561113) "></line>
                 <line x1="238" y1="132" x2="264" y2="132" id="路径-16"></line>
             </g>
             <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                 <text id="11备份" font-size="12">
                     <tspan x="271" y="97">11</tspan>
                 </text>
                 <text id="12备份" font-size="12">
                     <tspan x="276" y="111">12</tspan>
                 </text>
                 <text id="13备份" font-size="12">
                     <tspan x="280" y="125">13</tspan>
                 </text>
                 <text id="14" font-size="12">
                     <tspan x="282" y="139">14</tspan>
                 </text>
             </g>
         </g>
     </g>
 </g>
</svg>`,
    `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>外圈读数与刻度</title>
        <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="画板" transform="translate(-40.000000, -214.000000)">
                <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                    <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                    //16 - 20
                        <line x1="237.348106" y1="144.438887" x2="263.348106" y2="144.438887" id="路径-16" transform="translate(250.348106, 144.438887) rotate(6.000000) translate(-250.348106, -144.438887) "></line>
                        <line x1="235.399564" y1="156.741491" x2="261.399564" y2="156.741491" id="路径-16" transform="translate(248.399564, 156.741491) rotate(12.000000) translate(-248.399564, -156.741491) "></line>
                        <line x1="232.175725" y1="168.773022" x2="258.175725" y2="168.773022" id="路径-16" transform="translate(245.175725, 168.773022) rotate(18.000000) translate(-245.175725, -168.773022) "></line>
                        <line x1="227.711909" y1="180.401661" x2="253.711909" y2="180.401661" id="路径-16" transform="translate(240.711909, 180.401661) rotate(24.000000) translate(-240.711909, -180.401661) "></line>
                        <line x1="222.057023" y1="191.5" x2="248.057023" y2="191.5" id="路径-16" transform="translate(235.057023, 191.500000) rotate(30.000000) translate(-235.057023, -191.500000) "></line>
                        <line x1="238" y1="132" x2="264" y2="132" id="路径-16"></line>
                    </g>
                    <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                        <text id="16" font-size="12">
                            <tspan x="282" y="168">16</tspan>
                        </text>
                        <text id="17" font-size="12">
                            <tspan x="280" y="183">17</tspan>
                        </text>
                        <text id="18" font-size="12">
                            <tspan x="276" y="197">18</tspan>
                        </text>
                        <text id="19" font-size="12">
                            <tspan x="270" y="212">19</tspan>
                        </text>
                    </g>
                </g>
            </g>
        </g>
    </svg>`,
     `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
         <title>外圈读数与刻度</title>
         <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
             <g id="画板" transform="translate(-40.000000, -214.000000)">
                 <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                     <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                         <line x1="222.057023" y1="191.5" x2="248.057023" y2="191.5" id="路径-16" transform="translate(235.057023, 191.500000) rotate(30.000000) translate(-235.057023, -191.500000) "></line>
                         //21-25
                         <line x1="215.273022" y1="201.946445" x2="241.273022" y2="201.946445" id="路径-16" transform="translate(228.273022, 201.946445) rotate(36.000000) translate(-228.273022, -201.946445) "></line>
                         <line x1="207.434234" y1="211.626542" x2="233.434234" y2="211.626542" id="路径-16" transform="translate(220.434234, 211.626542) rotate(42.000000) translate(-220.434234, -211.626542) "></line>
                         <line x1="198.626542" y1="220.434234" x2="224.626542" y2="220.434234" id="路径-16" transform="translate(211.626542, 220.434234) rotate(48.000000) translate(-211.626542, -220.434234) "></line>
                         <line x1="188.946445" y1="228.273022" x2="214.946445" y2="228.273022" id="路径-16" transform="translate(201.946445, 228.273022) rotate(54.000000) translate(-201.946445, -228.273022) "></line>
                         <line x1="178.5" y1="235.057023" x2="204.5" y2="235.057023" id="路径-16" transform="translate(191.500000, 235.057023) rotate(60.000000) translate(-191.500000, -235.057023) "></line>
                     </g>
                     <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                         <text id="21" font-size="12">
                             <tspan x="256" y="237">21</tspan>
                         </text>
                         <text id="22" font-size="12">
                             <tspan x="247" y="248">22</tspan>
                         </text>
                         <text id="23" font-size="12">
                             <tspan x="237" y="258">23</tspan>
                         </text>
                         <text id="24" font-size="12">
                             <tspan x="226" y="268">24</tspan>
                         </text>
                     </g>
                 </g>
             </g>
         </g>
     </svg>`,
     `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
         <title>外圈读数与刻度</title>
         <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
             <g id="画板" transform="translate(-40.000000, -214.000000)">
                 <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                     <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                         <line x1="178.5" y1="235.057023" x2="204.5" y2="235.057023" id="路径-16" transform="translate(191.500000, 235.057023) rotate(60.000000) translate(-191.500000, -235.057023) "></line>
                         //26-30
                         <line x1="167.401661" y1="240.711909" x2="193.401661" y2="240.711909" id="路径-16" transform="translate(180.401661, 240.711909) rotate(66.000000) translate(-180.401661, -240.711909) "></line>
                         <line x1="155.773022" y1="245.175725" x2="181.773022" y2="245.175725" id="路径-16" transform="translate(168.773022, 245.175725) rotate(72.000000) translate(-168.773022, -245.175725) "></line>
                         <line x1="143.741491" y1="248.399564" x2="169.741491" y2="248.399564" id="路径-16" transform="translate(156.741491, 248.399564) rotate(78.000000) translate(-156.741491, -248.399564) "></line>
                         <line x1="131.438887" y1="250.348106" x2="157.438887" y2="250.348106" id="路径-16" transform="translate(144.438887, 250.348106) rotate(84.000000) translate(-144.438887, -250.348106) "></line>
                         <line x1="119" y1="251" x2="145" y2="251" id="路径-16" transform="translate(132.000000, 251.000000) rotate(90.000000) translate(-132.000000, -251.000000) "></line>
                     </g>
                     <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                         <text id="26" font-size="12">
                             <tspan x="199" y="283">26</tspan>
                         </text>
                         <text id="27" font-size="12">
                             <tspan x="186" y="288">27</tspan>
                         </text>
                         <text id="28" font-size="12">
                             <tspan x="171" y="292">28</tspan>
                         </text>
                         <text id="29" font-size="12">
                             <tspan x="157" y="294">29</tspan>
                         </text>
                     </g>
                 </g>
             </g>
         </g>
     </svg>`,
     `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
         <title>外圈读数与刻度</title>
         <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
             <g id="画板" transform="translate(-40.000000, -214.000000)">
                 <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                     <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                         <line x1="119" y1="251" x2="145" y2="251" id="路径-16" transform="translate(132.000000, 251.000000) rotate(90.000000) translate(-132.000000, -251.000000) "></line>
                         //31-35
                         <line x1="106.561113" y1="250.348106" x2="132.561113" y2="250.348106" id="路径-16" transform="translate(119.561113, 250.348106) rotate(96.000000) translate(-119.561113, -250.348106) "></line>
                         <line x1="94.2585088" y1="248.399564" x2="120.258509" y2="248.399564" id="路径-16" transform="translate(107.258509, 248.399564) rotate(102.000000) translate(-107.258509, -248.399564) "></line>
                         <line x1="82.2269777" y1="245.175725" x2="108.226978" y2="245.175725" id="路径-16" transform="translate(95.226978, 245.175725) rotate(108.000000) translate(-95.226978, -245.175725) "></line>
                         <line x1="70.5983395" y1="240.711909" x2="96.5983395" y2="240.711909" id="路径-16" transform="translate(83.598339, 240.711909) rotate(114.000000) translate(-83.598339, -240.711909) "></line>
                         <line x1="59.5" y1="235.057023" x2="85.5" y2="235.057023" id="路径-16" transform="translate(72.500000, 235.057023) rotate(120.000000) translate(-72.500000, -235.057023) "></line>
                     </g>
                     <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                         <text id="31" font-size="12">
                             <tspan x="127" y="294">31</tspan>
                         </text>
                         <text id="32" font-size="12">
                             <tspan x="113" y="292">32</tspan>
                         </text>
                         <text id="33" font-size="12">
                             <tspan x="98" y="288">33</tspan>
                         </text>
                         <text id="34" font-size="12">
                             <tspan x="84" y="283">34</tspan>
                         </text>
                     </g>
                 </g>
             </g>
         </g>
     </svg>`,
     `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
         <title>外圈读数与刻度</title>
         <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
             <g id="画板" transform="translate(-40.000000, -214.000000)">
                 <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                     <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                         <line x1="59.5" y1="235.057023" x2="85.5" y2="235.057023" id="路径-16" transform="translate(72.500000, 235.057023) rotate(120.000000) translate(-72.500000, -235.057023) "></line>
                          //36-40
                         <line x1="49.053555" y1="228.273022" x2="75.053555" y2="228.273022" id="路径-16" transform="translate(62.053555, 228.273022) rotate(126.000000) translate(-62.053555, -228.273022) "></line>
                         <line x1="39.3734578" y1="220.434234" x2="65.3734578" y2="220.434234" id="路径-16" transform="translate(52.373458, 220.434234) rotate(132.000000) translate(-52.373458, -220.434234) "></line>
                         <line x1="30.5657658" y1="211.626542" x2="56.5657658" y2="211.626542" id="路径-16" transform="translate(43.565766, 211.626542) rotate(138.000000) translate(-43.565766, -211.626542) "></line>
                         <line x1="22.7269777" y1="201.946445" x2="48.7269777" y2="201.946445" id="路径-16" transform="translate(35.726978, 201.946445) rotate(144.000000) translate(-35.726978, -201.946445) "></line>
                         <line x1="15.9429769" y1="191.5" x2="41.9429769" y2="191.5" id="路径-16" transform="translate(28.942977, 191.500000) rotate(150.000000) translate(-28.942977, -191.500000) "></line>
                     </g>
                     <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                         <text id="36" font-size="12">
                             <tspan x="59" y="268">36</tspan>
                         </text>
                         <text id="37" font-size="12">
                             <tspan x="47" y="259">37</tspan>
                         </text>
                         <text id="38" font-size="12">
                             <tspan x="37" y="248">38</tspan>
                         </text>
                         <text id="39" font-size="12">
                             <tspan x="28" y="237">39</tspan>
                         </text>
                     </g>
                 </g>
             </g>
         </g>
     </svg>`,
     `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
         <title>外圈读数与刻度</title>
         <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
             <g id="画板" transform="translate(-40.000000, -214.000000)">
                 <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                     <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                        <line x1="15.9429769" y1="191.5" x2="41.9429769" y2="191.5" id="路径-16" transform="translate(28.942977, 191.500000) rotate(150.000000) translate(-28.942977, -191.500000) "></line>
                         //41-45
                         <line x1="10.2880905" y1="180.401661" x2="36.2880905" y2="180.401661" id="路径-16" transform="translate(23.288091, 180.401661) rotate(156.000000) translate(-23.288091, -180.401661) "></line>
                         <line x1="5.82427456" y1="168.773022" x2="31.8242746" y2="168.773022" id="路径-16" transform="translate(18.824275, 168.773022) rotate(162.000000) translate(-18.824275, -168.773022) "></line>
                         <line x1="2.60043551" y1="156.741491" x2="28.6004355" y2="156.741491" id="路径-16" transform="translate(15.600436, 156.741491) rotate(168.000000) translate(-15.600436, -156.741491) "></line>
                         <line x1="0.651894451" y1="144.438887" x2="26.6518945" y2="144.438887" id="路径-16" transform="translate(13.651894, 144.438887) rotate(174.000000) translate(-13.651894, -144.438887) "></line>
                         <line x1="0" y1="132" x2="26" y2="132" id="路径-16" transform="translate(13.000000, 132.000000) rotate(180.000000) translate(-13.000000, -132.000000) "></line>
                     </g>
                     <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                         <text id="41" font-size="12">
                             <tspan x="13" y="211">41</tspan>
                         </text>
                         <text id="42" font-size="12">
                             <tspan x="8" y="197">42</tspan>
                         </text>
                         <text id="43" font-size="12">
                             <tspan x="4" y="183">43</tspan>
                         </text>
                         <text id="44" font-size="12">
                             <tspan x="2" y="169">44</tspan>
                         </text>
                     </g>
                 </g>
             </g>
         </g>
     </svg>`,
    `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>外圈读数与刻度</title>
        <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="画板" transform="translate(-40.000000, -214.000000)">
                <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                    <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                      <line x1="0" y1="132" x2="26" y2="132" id="路径-16" transform="translate(13.000000, 132.000000) rotate(180.000000) translate(-13.000000, -132.000000) "></line>
                        //46-50
                        <line x1="0.651894451" y1="119.561113" x2="26.6518945" y2="119.561113" id="路径-16" transform="translate(13.651894, 119.561113) rotate(186.000000) translate(-13.651894, -119.561113) "></line>
                        <line x1="2.60043551" y1="107.258509" x2="28.6004355" y2="107.258509" id="路径-16" transform="translate(15.600436, 107.258509) rotate(192.000000) translate(-15.600436, -107.258509) "></line>
                        <line x1="5.82427456" y1="95.2269777" x2="31.8242746" y2="95.2269777" id="路径-16" transform="translate(18.824275, 95.226978) rotate(198.000000) translate(-18.824275, -95.226978) "></line>
                        <line x1="10.2880905" y1="83.5983395" x2="36.2880905" y2="83.5983395" id="路径-16" transform="translate(23.288091, 83.598339) rotate(204.000000) translate(-23.288091, -83.598339) "></line>
                        <line x1="15.9429769" y1="72.5" x2="41.9429769" y2="72.5" id="路径-16" transform="translate(28.942977, 72.500000) rotate(210.000000) translate(-28.942977, -72.500000) "></line>
                    </g>
                    <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                         <text id="46" font-size="12">
                            <tspan x="2" y="139">46</tspan>
                        </text>
                        <text id="47" font-size="12">
                            <tspan x="4" y="125">47</tspan>
                        </text>
                        <text id="48" font-size="12">
                            <tspan x="8" y="110">48</tspan>
                        </text>
                        <text id="49" font-size="12">
                            <tspan x="13" y="96">49</tspan>
                        </text>
                    </g>
                </g>
            </g>
        </g>
    </svg>`,
    `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>外圈读数与刻度</title>
        <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="画板" transform="translate(-40.000000, -214.000000)">
                <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                    <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                      <line x1="15.9429769" y1="72.5" x2="41.9429769" y2="72.5" id="路径-16" transform="translate(28.942977, 72.500000) rotate(210.000000) translate(-28.942977, -72.500000) "></line>
                        //51-55
                        <line x1="22.7269777" y1="62.053555" x2="48.7269777" y2="62.053555" id="路径-16" transform="translate(35.726978, 62.053555) rotate(216.000000) translate(-35.726978, -62.053555) "></line>
                        <line x1="30.5657658" y1="52.3734578" x2="56.5657658" y2="52.3734578" id="路径-16" transform="translate(43.565766, 52.373458) rotate(222.000000) translate(-43.565766, -52.373458) "></line>
                        <line x1="39.3734578" y1="43.5657658" x2="65.3734578" y2="43.5657658" id="路径-16" transform="translate(52.373458, 43.565766) rotate(228.000000) translate(-52.373458, -43.565766) "></line>
                        <line x1="49.053555" y1="35.7269777" x2="75.053555" y2="35.7269777" id="路径-16" transform="translate(62.053555, 35.726978) rotate(234.000000) translate(-62.053555, -35.726978) "></line>
                        <line x1="59.5" y1="28.9429769" x2="85.5" y2="28.9429769" id="路径-16" transform="translate(72.500000, 28.942977) rotate(240.000000) translate(-72.500000, -28.942977) "></line>
                    </g>
                    <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                        <text id="51" font-size="12">
                            <tspan x="28" y="70">51</tspan>
                        </text>
                        <text id="52" font-size="12">
                            <tspan x="37" y="59">52</tspan>
                        </text>
                        <text id="53" font-size="12">
                            <tspan x="48" y="49">53</tspan>
                        </text>
                        <text id="54" font-size="12">
                            <tspan x="59" y="39">54</tspan>
                        </text>
                    </g>
                </g>
            </g>
        </g>
    </svg>`,
    `<svg width="296px" height="300px" viewBox="0 0 296 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>外圈读数与刻度</title>
        <g id="正式版1.1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="画板" transform="translate(-40.000000, -214.000000)">
                <g id="外圈读数与刻度" transform="translate(40.000000, 214.000000)">
                    <g id="刻度线" transform="translate(16.000000, 18.000000)" stroke="#000000" stroke-dasharray="2,2" stroke-opacity="0.445722247">
                       <line x1="59.5" y1="28.9429769" x2="85.5" y2="28.9429769" id="路径-16" transform="translate(72.500000, 28.942977) rotate(240.000000) translate(-72.500000, -28.942977) "></line>
                        //56-60
                        <line x1="70.5983395" y1="23.2880905" x2="96.5983395" y2="23.2880905" id="路径-16" transform="translate(83.598339, 23.288091) rotate(246.000000) translate(-83.598339, -23.288091) "></line>
                        <line x1="82.2269777" y1="18.8242746" x2="108.226978" y2="18.8242746" id="路径-16" transform="translate(95.226978, 18.824275) rotate(252.000000) translate(-95.226978, -18.824275) "></line>
                        <line x1="94.2585088" y1="15.6004355" x2="120.258509" y2="15.6004355" id="路径-16" transform="translate(107.258509, 15.600436) rotate(258.000000) translate(-107.258509, -15.600436) "></line>
                        <line x1="106.561113" y1="13.6518945" x2="132.561113" y2="13.6518945" id="路径-16" transform="translate(119.561113, 13.651894) rotate(264.000000) translate(-119.561113, -13.651894) "></line>
                        <line x1="119" y1="13" x2="145" y2="13" id="路径-16" transform="translate(132.000000, 13.000000) rotate(270.000000) translate(-132.000000, -13.000000) "></line>
                    </g>
                    <g id="外圈数字" fill="#000000" fill-opacity="0.652671547" font-family="MathJax_Main-Regular, MathJax_Main" font-weight="normal">
                       <text id="56" font-size="12">
                            <tspan x="85" y="25">56</tspan>
                        </text>
                        <text id="57" font-size="12">
                            <tspan x="98" y="20">57</tspan>
                        </text>
                        <text id="58" font-size="12">
                            <tspan x="113" y="16">58</tspan>
                        </text>
                        <text id="59" font-size="12">
                            <tspan x="127" y="14">59</tspan>
                        </text>
                    </g>
                </g>
            </g>
        </g>
    </svg>`
]



