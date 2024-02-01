export function parseTeamsJson(data) {
  return JSON.parse(data);
}

export function parseGamedayFile(fileContent, teams) {
  try {
    const parsedData = JSON.parse(fileContent);

    // Map team IDs to team names for easy lookup
    const teamIdToName = new Map(teams.map(team => [team.id, team.name]));

    const parsedGameday = {
      date: new Date(parsedData.date),
      games: parsedData.games.map(game => ({
          home: {
            name: teamIdToName.get(game.home.name),
            score: game.home.score,
          },
          away: {
            name: teamIdToName.get(game.away.name),
            score: game.away.score,
          },
        })),
    };

    return parsedGameday;
  } catch (error) {
    console.error('Error parsing game day file:', error.message);
    throw error;
  }
}



/**
 * Tekur `gameday` gögn, staðfestir og hendir ólöglegum
 * færslum, skilar á normalizeseruðu formi.
 * @param {string} data Gögn lesin af disk
 * @returns {null | string[]} Gögn á flottara formi
 */
export function parseGameday(data) {
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    console.error('invalid data', e);
    return null;
  }

  if (!parsed) {
    console.warn('parsed data is not an object');
    return null;
  }

  if (!parsed.games) {
    console.warn('missing games array');
    return null;
  }

  if (!parsed.date) {
    console.warn('missing date string');
    return null;
  }

  return parsed;
}
