import clipboardy from 'clipboardy'
const readline = require('readline');

function codeToSnippetBody(code) {
    var lines = code.split('\n');
    var escapedLines = lines.map(line => line.replace(/"/g, '\\"').replace(/\t/g, '\\t'));
    var body = '[\n\t"' + escapedLines.join('",\n\t"') + '"\n]';
    return body;
}

export default function (args) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let code = '';
    console.log('Please enter your code, press "enter" key to finish:');
    rl.on('line', (input) => {
        if (input === 'eof') {
          console.log('The snippet body is:\n', codeToSnippetBody(code));
          clipboardy.writeSync(codeToSnippetBody(code));
            rl.close();
        } else {
            code += input + '\n';
        }
    });
}

