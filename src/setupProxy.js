// CRA 개발 서버가 시작할 때 이 파일을 불러온다. 개발 서버가 떠 있는 동안 글 폴더가 바뀌면 색인을 다시 만든다.
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const root = path.join(__dirname, "..");
const script = path.join(root, "scripts", "build-content-index.mjs");

let timer = null;
const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        execFile(process.execPath, [script], { cwd: root }, (error, stdout, stderr) => {
            process.stdout.write(error ? stderr : stdout);
        });
    }, 300);
};

module.exports = () => {
    for (const dir of ["posts", "projects"]) {
        fs.watch(path.join(root, "public", dir), (_event, name) => {
            if (name && name.endsWith(".md")) rebuild();
        });
    }
};
