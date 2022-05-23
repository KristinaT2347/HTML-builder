const fs = require("fs/promises");
const path = require("path");

async function makeBundle() {
  const names = await fs.readdir(path.join(__dirname, "styles"));

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

  await fs.writeFile(
    path.join(__dirname, "project-dist", "bundle.css"),
    result
  );
}

makeBundle().catch((error) => {
  console.error(error);
  process.exit(1);
});
