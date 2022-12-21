import fs from 'fs';
import readline from 'readline';

export async function readLargeFile(file, transformFn) {
  const readStream = fs.createReadStream(file);
  const readLine = readline.createInterface({ input: readStream });

  for await (const line of readLine) {
    transformFn(line)
  }
}
