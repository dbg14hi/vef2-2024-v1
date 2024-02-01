// score.js

export function calculateStandings(games, teams) {
  const standings = [];

  // Initialize standings with teams
  teams.forEach((team) => {
    standings.push({ teamName: team, points: 0 });
  });

  // Update standings based on game results
  games.forEach((game) => {
    const homeTeamName = typeof game.home.name === 'string' ? game.home.name : null;
    const awayTeamName = typeof game.away.name === 'string' ? game.away.name : null;

    const homeTeam = standings.find((team) => team.teamName === homeTeamName);
    const awayTeam = standings.find((team) => team.teamName === awayTeamName);

    // Debug logs
    console.log('Game:', game);
    console.log('Home Team:', homeTeam);
    console.log('Away Team:', awayTeam);

    if (homeTeam && awayTeam) {
      if (game.home.score > game.away.score) {
        homeTeam.points += 3; // Home team won
      } else if (game.home.score < game.away.score) {
        awayTeam.points += 3; // Away team won
      } else {
        homeTeam.points += 1; // It's a draw
        awayTeam.points += 1;
      }
    }
  });

  // Sort standings by points in descending order
  standings.sort((a, b) => b.points - a.points);

  return standings;
}
