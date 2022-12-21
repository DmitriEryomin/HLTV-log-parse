import FakeDB from './fakeDB.js';

const EventNames = {
  ROUND_START: 'World triggered "Round_Start"',
  ROUND_END: 'World triggered "Round_End"',
  GAME_OVER: /Game Over:/,
  KILLED: /killed "/,
};

const Filters = {
  SCORE: 'score',
  ROUND_AVERAGE: 'round_average',
  KILLS: 'kills',
};

const PlayerNickName = /^\".+?\<\d{1,}\>/;
const PlayerNickNameReplace = /"|\<\d{1,}\>/g;
const Score = /[0-9]{1,2}:[0-9]{1,2}/;

const ONE_SECOND = 1000;

export async function getRoundAverageLength() {
  const eventsData = await FakeDB.getData();
  let isRoundStarted = false;
  let roundStartTime = null;

  let isRoundEnded = false;
  let roundEndTime = null;

  const roundDurations = [];

  for (const [time, events] of Object.entries(eventsData)) {
    if (!isRoundStarted) {
      isRoundStarted = events.find((event) => event === EventNames.ROUND_START);
      roundStartTime = time;
    }

    if (isRoundStarted) {
      const isRestarted = events.find(
        (event) => event === EventNames.ROUND_START
      );
      if (isRestarted) {
        roundStartTime = time;
      }

      isRoundEnded = events.find((event) => event === EventNames.ROUND_END);
    }

    if (isRoundStarted && isRoundEnded) {
      roundEndTime = time;
      const roundDuration =
        new Date(roundEndTime.replace('-', '')) -
        new Date(roundStartTime.replace('-', ''));
      roundDurations.push(roundDuration / ONE_SECOND);
      isRoundStarted = false;
      isRoundEnded = false;
    }
  }

  const roundAverageLength = Math.floor(
    roundDurations.reduce((acc, duration) => acc + duration, 0) /
      roundDurations.length
  );
  return `${roundAverageLength} seconds`;
}

export async function getKillsPerPlayer() {
  const eventsData = await FakeDB.getData();
  const kills = {};
  for (const events of Object.values(eventsData)) {
    for (const gameEvent of events) {
      if (gameEvent.match(EventNames.KILLED)) {
        const [res] = gameEvent.match(PlayerNickName);
        const nickName = res.replace(PlayerNickNameReplace, '');
        if (kills[nickName]) {
          kills[nickName] += 1;
        } else {
          kills[nickName] = 1;
        }
      }
    }
  }
  return kills;
}

export async function getMatchScore() {
  const eventsData = await FakeDB.getData();
  const events = Object.values(eventsData);
  let score = '';

  for (let index = events.length - 1; index >= 0; index--) {
    const gameOverEventIndex = events[index].findIndex(
      (event) => !!event.match(EventNames.GAME_OVER)
    );
    if (gameOverEventIndex > -1) {
      const gameOverEvent = events[index][gameOverEventIndex];
      const [ctScore, ttScore] = gameOverEvent.match(Score)[0].split(':');

      const ctEvent = events[index][gameOverEventIndex - 3];
      const ttEvent = events[index][gameOverEventIndex - 2];
      const searchStr = '": ';
      const ctTeam = ctEvent.slice(
        ctEvent.indexOf(searchStr) + searchStr.length
      );
      const ttTeam = ttEvent.slice(
        ttEvent.indexOf(searchStr) + searchStr.length
      );

      score = `${ctTeam} (CT) ${ctScore}:${ttScore} ${ttTeam} (TT)`;
    }
  }

  return score;
}

export async function getStatisticsByFilter(filter) {
  if (filter === Filters.SCORE) {
    const matchScore = await getMatchScore();
    return { matchScore };
  }

  if (filter === Filters.ROUND_AVERAGE) {
    const roundAverageLength = await getRoundAverageLength();
    return { roundAverageLength };
  }

  if (filter === Filters.KILLS) {
    const killsPerPlayer = await getKillsPerPlayer();
    return { killsPerPlayer };
  }

  if (filter === '') {
    return {
      roundAverageLength: await getRoundAverageLength(),
      killsPerPlayer: await getKillsPerPlayer(),
      matchScore: await getMatchScore(),
    };
  }

  throw Error("Filter doesn't exist");
}
