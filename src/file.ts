import { existsSync, writeFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";

// ✅ write to file SYNCHRONOUSLY
export default function syncWriteFile(
  fileName: string,
  fileDirectory: string,
  data: any
) {
  /**
   * flags:
   *  - w = Open file for reading and writing. File is created if not exists
   *  - a+ = Open file for reading and appending. The file is created if not exists
   */
  const back = resolve(__dirname, "..");
  const path = join(back, `/output/${fileDirectory}`, fileName);

  // Create the directory if it does not already exist
  // TODO: Create output first
  const outputFolder = join(back, `/output/`);
  if (!existsSync(outputFolder)) {
    mkdirSync(outputFolder);
  }

  const directory = join(back, `/output/${fileDirectory}`);
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }

  writeFileSync(path, data, {
    flag: "w",
  });
}
