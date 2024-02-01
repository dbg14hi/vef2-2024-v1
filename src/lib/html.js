export function template(title, body) {
  const html = /* html */ `
  <html>
    <head>
      <meta charset="utf-8" />
      <link rel="stylesheet" href="styles.css">
      <title>${title}</title>
    </head>
    <body>
      ${body}
    </body>
  </html>`;

  return html;
}

export function indexTemplate() {
  const title = 'Boltadeildin—forsíða!';
  const body = /* html */ `
  <section>
    <h1>Velkomin í Boltadeildina!</h1>
    <ul>
      <li><a href="leikir.html">Seinustu leikir</a></li>
      <li><a href="stada.html">Staðan í deildinni</a></li>
    </ul>
  </section>`;

  return template(title, body);
}

export function stadaTemplate(standings) {
  // Log the type and content of standings
  console.log('Standings type:', typeof standings);
  console.log('Standings content:', standings);

  // Check if standings is an array before using map
  if (!Array.isArray(standings)) {
    console.error('Standings is not an array.');
    return ''; // Return an empty string or handle the error appropriately
  }

  const title = 'Boltadeildin—staðan!';
  const standingsHtml = standings.map((team, index) => `<p>${index + 1}. ${team.name} - ${team.points} points</p>`).join('');
  const body = /* html */ `
    <section>
      <h1>Staðan í deildinni!</h1>
      ${standingsHtml}
    </section>`;

  return template(title, body);
}



export function leikirTemplate(games) {
  const title = 'Boltadeildin—leikir!';
  const gamesHtml = games.toString();
  const body = /* html */ `
  <section>
  <h1>Leikir seinust vikna</h1>
    ${gamesHtml}
  </section>`;
  return template(title, body);
}
