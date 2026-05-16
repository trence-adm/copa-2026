import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Huge database of players by country - Copa América 2026 squads
const PLAYERS_BY_COUNTRY = {
  'MEX': ['Ochoa', 'Vega', 'Montes', 'Vasquez', 'Gutierrez', 'Lozano', 'Herrera', 'Guardado', 'Anguiano', 'Jimenez', 'Chavez', 'Lainez', 'Reyes', 'Moreno', 'Hirving', 'Berardo', 'Romo', 'Corona'],
  'CAN': ['Buchanan', 'Laryea', 'Johnston', 'McKenzie', 'Miller', 'Osorio', 'Savanier', 'Ibrahim', 'Eustaquio', 'Kone', 'Shaffelburg', 'David', 'Owusu', 'Cavallini', 'Borjan', 'Crepeau'],
  'USA': ['Pulisic', 'McConnell', 'Reyna', 'Weah', 'Adams', 'Dest', 'Sargent', 'Steffen', 'Antonin', 'Ledezma', 'Musah', 'Tillman', 'Busio', 'Williamson', 'Scally'],
  'ARG': ['Messi', 'Higuain', 'Aguero', 'Tevez', 'Mascherano', 'Campagnaro', 'Demichelis', 'Insaurralde', 'Rojo', 'Ota', 'Romero', 'Mercado', 'Montero', 'Diaz', 'Perotti', 'Banega'],
  'BRA': ['Neymar', 'Vinicius', 'Rodrygo', 'Fred', 'Casemiro', 'Antony', 'Neres', 'Cunha', 'Caio', 'Fabinho', 'Militao', 'Vanderson', 'Arana', 'Eder', 'Barbosa'],
  'URU': ['Cavani', 'Forlan', 'Lugano', 'Futre', 'Maxi', 'Rodriguez', 'Balanta', 'Valverde', 'Ramírez', 'Vigorito', 'Gonçalo', 'Pereira', 'De Arrascaeta', 'Cebolla'],
  'COL': ['Falcao', 'James', 'Zuniga', 'Cuadrado', 'Murillo', 'Davinson', 'Arias', 'Diaz', 'Lerma', 'Jhon', 'Carrascal', 'Caicedo', 'Guachirin', 'Campuzano'],
  'ECU': ['Valencia', 'Ibarra', 'Castillo', 'Arboleda', 'Ramires', 'Mena', 'Moreno', 'Hinestroza', 'Chicaiza', 'Gualpa', 'Martinez', 'Reasco', 'Ronny', 'Preciado'],
  'CHI': ['Sanchez', 'Vargas', 'Vidal', 'Isla', 'Puente', 'Mena', 'Maripan', 'Medel', 'Gutierrez', 'Aranguiz', 'Nunez', 'Brereton', 'Munoz', 'Osorio'],
  'PER': ['Guerrero', 'Farfan', 'Pizarro', 'Ramos', 'Cueva', 'Advincuta', 'Zambrano', 'Acevedo', 'Santa Maria', 'Flores', 'Yotun', 'Valera', 'Benavente', 'Quispe'],
  'PAR': ['Cardozo', 'Higuita', 'Santa Cruz', 'Gamarra', 'Caniza', 'Caseres', 'Ayoví', 'Nery', 'Alegre', 'Morales', 'Baez', 'Diaz', 'Acuña', 'Ferreira'],
  'VEN': ['Ronaldinho', 'Faryd', 'Maldonado', 'Penaloza', 'Viafara', 'Seijas', 'Morales', 'Arismendi', 'Rosales', 'Herrera', 'Fariña', 'Murillo', 'Vizcarrondo'],
  'ENG': ['Sterling', 'Kane', 'Mount', 'Rice', 'Foden', 'Grealish', 'Stones', 'Pickford', 'Maguire', 'Shaw', 'Henderson', 'Rashford', 'Saka', 'Bellingham'],
  'FRA': ['Mbappe', 'Griezmann', 'Benzema', 'Henry', 'Desailly', 'Vieira', 'Zidane', 'Thuram', 'Platini', 'Pastore', 'Kante', 'Pogba', 'Mendy', 'Upamecano'],
  'ESP': ['Busquets', 'Iniesta', 'Xavi', 'Puyol', 'Ramos', 'Casillas', 'Silva', 'Fabregas', 'Torres', 'Villa', 'Alonso', 'Mascherano', 'Pique', 'Valdes'],
  'GER': ['Muller', 'Kroos', 'Neuer', 'Reus', 'Kruse', 'Gomez', 'Ballack', 'Schweinsteiger', 'Klose', 'Bastian', 'Hummels', 'Boateng', 'Ozil', 'Podolski'],
  'POR': ['Ronaldo', 'Nani', 'Quaresma', 'Pauleta', 'Figo', 'Coentrao', 'Patricio', 'Joao', 'Bruno', 'Pepe', 'Conceição', 'Rui', 'Pinto', 'Beto'],
  'NED': ['Van Dijk', 'De Vrij', 'Dumfries', 'Akanji', 'Cruyff', 'Gullit', 'Van Basten', 'Bergkamp', 'Seedorf', 'Kluivert', 'Robben', 'Sneijder', 'Iniesta', 'Eboue'],
  'ITA': ['Insigne', 'Pellegrini', 'Barella', 'Immobile', 'Verratti', 'Chiellini', 'Buffon', 'Totti', 'Baggio', 'Pirlo', 'Cannavaro', 'Nesta', 'Maldini', 'Donnarumma'],
  'BEL': ['Hazard', 'De Bruyne', 'Lukaku', 'Chadli', 'Kompany', 'Van der Elst', 'Desmet', 'Tielemans', 'Mertens', 'Vertonghen', 'Alderweireld', 'Wilmots', 'Verhoeven'],
  'CRO': ['Modric', 'Rakitic', 'Lovren', 'Vida', 'Perisic', 'Corluka', 'Mandzukic', 'Rebic', 'Juranovic', 'Vrsaljko', 'Bradaric', 'Halilovic', 'Kramaric'],
  'SUI': ['Xhaka', 'Shaqiri', 'Seferovic', 'Rodriguez', 'Lichtsteiner', 'Behrami', 'Inler', 'Hitzfeld', 'Wiss', 'Drmic', 'Fernandes', 'Akanji', 'Stojkovic'],
  'DEN': ['Eriksen', 'Poulsen', 'Braithwaite', 'Kjaer', 'Delaney', 'Christiansen', 'Schmeichel', 'Jensen', 'Vestergaard', 'Dalsgaard', 'Norgaard', 'Holm-Johansen'],
  'SWE': ['Ibrahimovic', 'Larsson', 'Svensson', 'Ljungberg', 'Kallstrom', 'Jonsson', 'Mellberg', 'Elmander', 'Svensson', 'Holmberg', 'Ekdal', 'Granqvist'],
  'NOR': ['Ødegaard', 'Aasen', 'Aleesami', 'Johnsen', 'Valgren', 'Elabdellaoui', 'Horneland', 'Nyland', 'Risa', 'Osnes', 'Solbakken', 'Sorloth'],
  'POL': ['Lewandowski', 'Milik', 'Zielinski', 'Klich', 'Glik', 'Pazdan', 'Szczesny', 'Tymoteusz', 'Salamon', 'Jedenastka', 'Krol', 'Skorupski'],
  'SRB': ['Mitrovic', 'Tadic', 'Vlahovic', 'Ivanovic', 'Vidic', 'Matic', 'Kostic', 'Kolarov', 'Markovic', 'Antic', 'Mandzukic', 'Jovetic'],
  'AUT': ['Alaba', 'Arnautovic', 'Sabitzer', 'Schaub', 'Lazaro', 'Frieser', 'Grillitsch', 'Bachmann', 'Onisiwo', 'Wober', 'Siebenhandl', 'Drazan'],
  'TUR': ['Yilmaz', 'Ozil', 'Calhanoglu', 'Tosun', 'Tufan', 'Ozbayrakli', 'Tatar', 'Toprak', 'Soyuncu', 'Belozoglu', 'Guzelbey', 'Altintop'],
  'UKR': ['Shevchenko', 'Yarmolenko', 'Konoplyanka', 'Milevskiy', 'Zinchenko', 'Alderweireld', 'Bezuhov', 'Tymchenko', 'Vynarchyk', 'Nazarenko', 'Bondarenko'],
  'MAR': ['Ziyech', 'Mahrez', 'Boufal', 'Bissouma', 'Noussair', 'Aguerd', 'Bono', 'Kudus', 'Saiss', 'Hakimi', 'Attiyat', 'Buya'],
  'SEN': ['Mane', 'Sarr', 'Koulibaly', 'Seck', 'Pape', 'Sarr', 'Wague', 'Gueye', 'Savie', 'Niang', 'Kouyate', 'Mendy'],
  'NGA': ['Iwobi', 'Osimhen', 'Kanu', 'Mikel', 'Obi', 'Ekong', 'Uzoho', 'Iheanacho', 'Ajayi', 'Bassey', 'Ejuke', 'Omeruo'],
  'GHA': ['Ayew', 'Gyan', 'Partey', 'Mensah', 'Adomah', 'Mensah', 'Amoah', 'Dede', 'Bah', 'Takyi', 'Addo', 'Dzigbordi'],
  'CMR': ['Eto', 'Mboma', 'Foe', 'Songo', 'Njitap', 'Makoun', 'Keosela', 'Olinga', 'Wowo', 'Simo', 'Momo', 'Emana'],
  'TUN': ['Ben Youssef', 'Mathlouthi', 'Kharja', 'Tebily', 'Ben Younes', 'Jeridi', 'Dziri', 'Boualem', 'Tiba', 'Hadji', 'Ayouni'],
  'ALG': ['Mahrez', 'Slimani', 'Bentaleb', 'Baku', 'Mandi', 'Bedimo', 'Guechi', 'Bolaji', 'Benazouz', 'Tielemans', 'Brahimi', 'Ghezzal'],
  'EGY': ['Salah', 'Amr', 'Hegazi', 'Gabaski', 'Emam', 'Soliman', 'Rayan', 'Maher', 'Halim', 'Fathy', 'Said', 'Elsayed'],
  'JPN': ['Honda', 'Nagatomo', 'Makino', 'Hasebe', 'Shibasaki', 'Kagawa', 'Matsuda', 'Obi', 'Kamada', 'Minamino', 'Ito', 'Sugimoto'],
  'KOR': ['Son', 'Kim', 'Lee', 'Kwon', 'Koo', 'Park', 'Oh', 'Jung', 'Hwang', 'Paik', 'Lim', 'Na'],
  'AUS': ['Leckie', 'Behich', 'Devlin', 'Karacic', 'Cahill', 'Brebner', 'Vidmar', 'Neill', 'Postiga', 'Duke', 'Reddy', 'Mooy'],
  'IRN': ['Taremi', 'Azmoun', 'Jahanbakhsh', 'Pouraliganji', 'Cheshmi', 'Rezaeian', 'Hosseini', 'Shojaei', 'Karimi', 'Ansarifard', 'Niazmand'],
  'KSA': ['Al-Dosari', 'Al-Khaibari', 'Al-Muwallad', 'Al-Johani', 'Al-Nemer', 'Al-Motairi', 'Al-Bulayhi', 'Al-Bishi', 'Al-Harbi', 'Al-Faraj'],
  'QAT': ['Almoez', 'Akram', 'Al-Rawi', 'Al-Marri', 'Al-Duhail', 'Haydos', 'Khoukh', 'Zubair', 'Al-Kubaisi', 'Alaaeldin'],
  'IRQ': ['Khudairi', 'Al-Ghannam', 'Rasheed', 'Al-Maliki', 'Al-Rawi', 'Al-Karawi', 'Al-Dulaimi', 'Hameed', 'Al-Bayati'],
  'UAE': ['Trezeguet', 'Afif', 'Mabkhout', 'Al-Shamsi', 'Ahmed', 'Al-Junaibi', 'Al-Fahim', 'Khaled', 'Fayez'],
  'NZL': ['Soctland', 'Wood', 'Bosnich', 'Neill', 'Vidmar', 'Cahill', 'Maran', 'Toffoli', 'Postiga', 'Duke'],
  'CRC': ['Navas', 'Rónald', 'Bolanos', 'Herrera', 'Calvo', 'González', 'Mejía', 'Duarte', 'Madrigal', 'Fonseca'],
};

// Read the OCR log
const logPath = path.join(ROOT, 'ocr-analysis.log');
const logContent = await fs.readFile(logPath, 'utf8');
const lines = logContent.split('\n');

// Parse the lines
const results = [];
for (const line of lines) {
  const match = line.match(/\[(\d+)\]\s+(\?{4}|[A-Z]{3})\s+\|\s*(.+?)(\s*)$/);
  if (match) {
    const index = parseInt(match[1]);
    const country = match[2];
    const playerName = match[3].trim();
    
    results.push({ index, country, playerName });
  }
}

console.log(`Parsed ${results.length} stickers from OCR log\n`);

// Try to identify unknown countries by player name
const identified = [];
const stillUnknown = [];

for (const result of results) {
  if (result.country !== '????') {
    identified.push(result);
    continue;
  }

  // Try to match player name
  const playerUpperCase = result.playerName.toUpperCase();
  let foundCountry = null;

  for (const [countryCode, players] of Object.entries(PLAYERS_BY_COUNTRY)) {
    for (const player of players) {
      if (playerUpperCase.includes(player.toUpperCase())) {
        foundCountry = countryCode;
        break;
      }
    }
    if (foundCountry) break;
  }

  if (foundCountry) {
    result.country = foundCountry;
    identified.push(result);
  } else {
    stillUnknown.push(result);
  }
}

console.log(`Identified by player name: ${identified.length}`);
console.log(`Still unknown: ${stillUnknown.length}\n`);

// Distribution
const distribution = {};
for (const result of identified) {
  distribution[result.country] = (distribution[result.country] || 0) + 1;
}

console.log('Final country distribution:');
Object.entries(distribution)
  .sort((a, b) => b[1] - a[1])
  .forEach(([country, count]) => {
    console.log(`  ${country}: ${count}`);
  });

// Save to file
const finalMapPath = path.join(ROOT, 'sticker-final-mapping.json');
await fs.writeFile(finalMapPath, JSON.stringify(identified, null, 2), 'utf8');
console.log(`\n✅ Final mapping saved to: sticker-final-mapping.json (${identified.length} stickers)`);

if (stillUnknown.length > 0) {
  console.log(`\n⚠️  ${stillUnknown.length} stickers still unknown:`);
  stillUnknown.slice(0, 30).forEach(s => {
    console.log(`  [${String(s.index).padStart(4, '0')}] ${s.playerName}`);
  });

  const unknownPath = path.join(ROOT, 'sticker-still-unknown.json');
  await fs.writeFile(unknownPath, JSON.stringify(stillUnknown, null, 2), 'utf8');
  console.log(`\n⚠️  Unknown stickers list: sticker-still-unknown.json`);
}
