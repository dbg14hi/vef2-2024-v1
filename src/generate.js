import { writeFile } from 'fs/promises';
import { join } from 'node:path';
import {
  createDirIfNotExists,
  readFile,
  readFilesFromDir,
} from './lib/file.js';

import { indexTemplate, leikirTemplate, stadaTemplate } from './lib/html.js';
import { parseGamedayFile, parseTeamsJson } from './lib/parse.js';
import { calculateStandings } from './lib/score.js';

const INPUT_DIR = './data';
const OUTPUT_DIR = './dist';

async function main() {
  // Búa til möppuna sem geymir unnin gögn ef ekki til
  await createDirIfNotExists(OUTPUT_DIR);


  // Sækjum liðaheiti, ef gögn spillt mun þetta kasta villu og hætta keyrslu

  const teamsFileData = await readFile(join(INPUT_DIR, 'teams.json'));
  const teams = parseTeamsJson(teamsFileData);
  console.info('team names read, total', teams.length);


  // Finnum allar skrár sem byrja á 'gameday-' í 'INPUT_DIR'
  const files = await readFilesFromDir(INPUT_DIR);
  const gamedayFiles = files.filter((file) => file.indexOf('gameday-') > 0);
  console.info('gameday files found', gamedayFiles.length);

  // Fara yfir alla skrár og þátta þær
  const gamedays = [];
  console.info('starting to parse gameday files');
  for await (const gamedayFile of gamedayFiles) {
    const file = await readFile(gamedayFile);

    try {
      // Reyna að þátta skrána og síðan bæta í fylkið ef það tekst
      gamedays.push(parseGamedayFile(file, teams));
    } catch (e) {
      console.error(`unable to parse ${gamedayFile}`, e.message);
    }
  }
  console.info('gameday files parsed', gamedays.length)

  // Sort þ.a. elsi leikdagur sé fyrst
  gamedays.sort((a, b) => a.date.getTime() - b.date.getTime())



  // Reikna stöðu frá öllum leikjum
  // Reikna stöðu frá öllum leikjum
const allGames = [];

for (const gameday of gamedays) {
  const parsedGames = gameday.games.map(game => {
    const homeTeamName = typeof game.home.name === 'string' ? game.home.name : null;
    const awayTeamName = typeof game.away.name === 'string' ? game.away.name : null;

    return {
      home: {
        name: homeTeamName,
        score: typeof game.home.score === 'number' ? game.home.score : null,
      },
      away: {
        name: awayTeamName,
        score: typeof game.away.score === 'number' ? game.away.score : null,
      },
    };
  });

  allGames.push(...parsedGames);
}

console.log('All Games:', allGames);


  const standings = calculateStandings(allGames, teams);
  console.log('Standings:', standings);



  // Búum til HTML skrár
  const indexHtml = indexTemplate();
  const indexFilename = join(OUTPUT_DIR, 'index.html');
  await writeFile(indexFilename, indexHtml);

  const stadaHtml = stadaTemplate(standings);
  const stadaFilename = join(OUTPUT_DIR, 'stada.html');
  await writeFile(stadaFilename, stadaHtml);

  const leikirHtml = leikirTemplate(gamedays);
  const leikirFilename = join(OUTPUT_DIR, 'leikir.html');
  await writeFile(leikirFilename, leikirHtml);
}

main().catch((error) => {
  console.error('error generating', error);
});
