import fastify from 'fastify';
import cors from '@fastify/cors';

import FakeDB from './services/fakeDB.js';

import {
  getRoundAverageLength,
  getKillsPerPlayer,
  getMatchScore,
  getStatisticsByFilter,
} from './services/filterEvents.js';

const server = fastify({ logger: true });

server.get('/statistics', async (_, reply) => {
  const payload = {
    roundAverageLength: await getRoundAverageLength(),
    killsPerPlayer: await getKillsPerPlayer(),
    matchScore: await getMatchScore(),
  };
  reply.send(payload);
});

server.get('/statistics/:filter', async (request, reply) => {
  const { filter } = request.params;
  const payload = await getStatisticsByFilter(filter);

  reply.send(payload);
});

async function start() {
  try {
    await server.register(cors, {
      origin: true,
    });
    await FakeDB.initialize();
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
