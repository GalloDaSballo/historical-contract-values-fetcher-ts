import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";

// ✅ write to file SYNCHRONOUSLY
export default function syncWriteFile(filename: string, data: any) {
  /**
   * flags:
   *  - w = Open file for reading and writing. File is created if not exists
   *  - a+ = Open file for reading and appending. The file is created if not exists
   */
  const back = resolve(__dirname, "..");
  const path = join(back, "/output", filename);

  // Create the directory if it does not already exist
  const directory = join(back, "/output");
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }

  writeFileSync(path, data, {
    flag: "w",
  });
}
