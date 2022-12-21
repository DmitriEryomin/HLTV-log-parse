import { readLargeFile } from './readLargeFile.js';

class FakeDB {
  constructor() {
    this.data = {};
  }

  async initialize() {
    try {
      await readLargeFile('./NAVIvsVitaGF-Nuke.txt', (line) => {
        const [time, event] = line.split(/\d{2}: /);
        if (this.data[time]) {
          this.data[time].push(event);
        } else {
          this.data[time] = [event];
        }
      });
    } catch (error) {
      throw Error('Unable to initialize DB');
    }
  }

  async getData() {
    return await this.data;
  }
}

const db = new FakeDB();

export default db;
