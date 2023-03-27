const _ = require('../lib/util');
const path = require('path');
const fs = require('fs-extra');
async function run(args, options = {}) {
    let toConvertFiles;
    if (!args.f) {
        const files = _.getAllFiles(
            '.',
            null,
            '.js',
            options
        );
        toConvertFiles = files.filter(file => !file.dir).map(file => file.path);
    } else {
        toConvertFiles = [args.f];
    }
    if (toConvertFiles) {
        toConvertFiles.forEach(file => {
            const filePath = path.join(options.cwd || process.cwd(), file);
            let fileContent = fs.readFileSync(filePath).toString();
            fileContent = fileContent
                .replace(
                    /model\s+yqd_(.*?)\s+{((.|\n)*?)}/g,
                    ($0, $1, $2) => {
                        return `model ${$1.replace(/^[a-z]/, ($0) => {
                            return $0.toUpperCase()
                        })} \{${$2}  \@\@map(name: "yqd_${$1}")\n\}`
                    }
                )
            // console.log(fileContent)
            fs.outputFileSync(
                path.join(
                    options.outputDir || path.dirname(filePath),
                    path.basename(filePath, '.prisma') + '.gen.prisma'
                ),
                fileContent
            );
        })
    }
}

module.exports = run;
