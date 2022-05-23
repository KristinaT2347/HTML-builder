const fs = require("fs");
const path = require("path");

let ws = fs.createWriteStream(path.join(__dirname, "hi.txt"));
process.stdout.write("Введите техт: ");

process.stdin.setEncoding("utf-8");

process.stdin.on("data", (data) => {
  ws.write(data);
  if (data.trim() === "exit") {
    process.stdout.write("Конец!\n");
    process.exit();
  }
});
