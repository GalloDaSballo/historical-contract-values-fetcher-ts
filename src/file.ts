import { readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";

// https://bobbyhadz.com/blog/typescript-write-to-a-file

// ✅ write to file SYNCHRONOUSLY
export default function syncWriteFile(filename: string, data: any) {
  /**
   * flags:
   *  - w = Open file for reading and writing. File is created if not exists
   *  - a+ = Open file for reading and appending. The file is created if not exists
   */
  const back = resolve(__dirname, "..");
  const path = join(back, "/output", filename);

  writeFileSync(path, data, {
    flag: "a+",
  });
}