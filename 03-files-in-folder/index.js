const fs = require("fs");
const path = require("path");

fs.readdir(path.join(__dirname, "secret-folder"), (error, names) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }

  names.forEach((fileName) => {
    fs.stat(path.join(__dirname, "secret-folder", fileName), (error, stat) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }

      if (!stat.isFile()) {
        return;
      }

      const arr = fileName.split(".");

      console.log(
        `${arr.slice(0, arr.length - 1).join("")} - ${arr[arr.length - 1]} - ${stat.size}b`
      );
    });
  });
});
