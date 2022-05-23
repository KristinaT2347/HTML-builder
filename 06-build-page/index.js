const fs = require("fs/promises");
const path = require("path");

async function main() {
  await fs.mkdir(path.join(__dirname, "project-dist"), { recursive: true });
  await makeTemplate();
  await makeCssBundle(
    path.join(__dirname, "styles"),
    path.join(__dirname, "project-dist", "style.css")
  );
  await copyDir(
    path.join(__dirname, "assets"),
    path.join(__dirname, "project-dist", "assets")
  );
}

async function makeTemplate() {
  const content = await fs.readFile(path.join(__dirname, "template.html"), {
    encoding: "utf-8",
  });

  let result = content;

  while (true) {
    const startPos = result.indexOf("{{");
    if (startPos < 0) {
      break;
    }

    const endPos = result.indexOf("}}", startPos + 2);
    if (endPos < 0) {
      break;
    }

    const templateName = result.slice(startPos + 2, endPos);

    const templateContent = await fs.readFile(
      path.join(__dirname, "components", `${templateName}.html`),
      { encoding: "utf8" }
    );

    result =
      result.slice(0, startPos) + templateContent + result.slice(endPos + 2);
  }

  await fs.writeFile(
    path.join(__dirname, "project-dist", "index.html"),
    result
  );
}

async function makeCssBundle(sourceDir, destinationPath) {
  const names = await fs.readdir(sourceDir);

  let result = "";

  for (const name of names) {
    const arr = name.split(".");
    if (arr[arr.length - 1] !== "css") {
      continue;
    }

    const content = await fs.readFile(path.join(__dirname, "styles", name), {
      encoding: "utf-8",
    });

    result += content + "\n";
  }

  await fs.writeFile(destinationPath, result);
}

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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
