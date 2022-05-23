const fs = require("fs/promises");
const path = require("path");

async function copyDir(source, destination) {
  await fs.rm(destination, { recursive: true, force: true });

  const folders = ["."];

  while (folders.length) {
    const relativePath = folders.pop();

    const sourcePath = path.join(source, relativePath);
    const destinationPath = path.join(destination, relativePath);

    const stat = await fs.stat(sourcePath);

    if (stat.isDirectory()) {
      await fs.mkdir(destinationPath, { recursive: true });
      const names = await fs.readdir(sourcePath);

      names.forEach((name) => {
        folders.push(path.join(relativePath, name));
      });
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

copyDir(
  path.join(__dirname, "files"),
  path.join(__dirname, "files-copy")
).catch((error) => {
  console.error(error);
  process.exit(1);
});
