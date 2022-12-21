import fastify from 'fastify';

import { FakeDB } from './services/fakeDB.js';

import {
  getRoundAverageLength,
  getKillsPerPlayer,
  getMatchScore,
} from './services/filterEvents.js';

const server = fastify({ logger: true });
const db = new FakeDB();

server.get('/statistics', (_, reply) => {
  const data = db.getData();
  const payload = {
    roundAverageLength: getRoundAverageLength(data),
    killsPerPlayer: getKillsPerPlayer(data),
    matchScore: getMatchScore(data),
  };
  reply.send(payload);
});

async function start() {
  try {
    await db.initialize();
    await server.listen({ port: 3000 });
  } catch (error) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
