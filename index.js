import { readLargeFile } from './services/readLargeFile.js';

import {
  getRoundAverageLength,
  getKillsPerPlayer,
  getMatchScore,
} from './services/filterEvents.js';

(async () => {
  const data = {};

  await readLargeFile('./NAVIvsVitaGF-Nuke.txt', (line) => {
    const [time, event] = line.split(/\d{2}: /);
    if (data[time]) {
      data[time].push(event);
    } else {
      data[time] = [event];
    }
  });

  const roundAverageLength = getRoundAverageLength(data);
  const killsPerPlayer = getKillsPerPlayer(data);
  const matchScore = getMatchScore(data);

  console.log({
    roundAverageLength: `${roundAverageLength} seconds`,
    killsPerPlayer,
    matchScore,
  });
})();
