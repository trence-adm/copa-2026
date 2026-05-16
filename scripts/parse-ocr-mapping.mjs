import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Copa América 2026 squad player database - comprehensive list of known players
const PLAYERS_BY_COUNTRY = {
  'MEX': ['Ochoa', 'Vega', 'Montes', 'Vasquez', 'Gutierrez', 'Lozano', 'Herrera', 'Guardado', 'Anguiano', 'Jimenez', 'Chavez', 'Lainez', 'Reyes', 'Moreno', 'Hirving', 'Romo', 'Corona', 'Sanchez', 'Arteaga'],
  'CAN': ['Buchanan', 'Laryea', 'Johnston', 'McKenzie', 'Miller', 'Osorio', 'Savanier', 'Ibrahim', 'Eustaquio', 'Kone', 'Shaffelburg', 'David', 'Owusu', 'Cavallini', 'Borjan', 'Crepeau', 'Sam', 'Koné', 'Adekugbe'],
  'USA': ['Pulisic', 'McConnell', 'Reyna', 'Weah', 'Adams', 'Dest', 'Sargent', 'Steffen', 'Antonin', 'Ledezma', 'Musah', 'Tillman', 'Busio', 'Williamson', 'Scally', 'Robinson', 'Hoppe'],
  'ARG': ['Messi', 'Higuain', 'Aguero', 'Tevez', 'Mascherano', 'Campagnaro', 'Demichelis', 'Insaurralde', 'Rojo', 'Ota', 'Romero', 'Mercado', 'Montero', 'Diaz', 'Perotti', 'Banega', 'Acuna'],
  'BRA': ['Neymar', 'Vinicius', 'Rodrygo', 'Fred', 'Casemiro', 'Antony', 'Neres', 'Cunha', 'Caio', 'Fabinho', 'Militao', 'Vanderson', 'Arana', 'Eder', 'Barbosa', 'Tielemans', 'Havertz'],
  'URU': ['Cavani', 'Forlan', 'Lugano', 'Futre', 'Maxi', 'Rodriguez', 'Valverde', 'Ramirez', 'Vigorito', 'Pereira', 'Garrido', 'Sanguinetti'],
  'COL': ['Falcao', 'James', 'Zuniga', 'Cuadrado', 'Murillo', 'Davinson', 'Arias', 'Diaz', 'Lerma', 'Jhon', 'Carrascal', 'Caicedo', 'Campuzano', 'Moreno'],
  'ECU': ['Valencia', 'Ibarra', 'Castillo', 'Arboleda', 'Ramires', 'Mena', 'Moreno', 'Hinestroza', 'Chicaiza', 'Gualpa', 'Martinez', 'Reasco'],
  'CHI': ['Sanchez', 'Vargas', 'Vidal', 'Isla', 'Puente', 'Maripan', 'Medel', 'Gutierrez', 'Aranguiz', 'Nunez', 'Brereton', 'Munoz', 'Osorio'],
  'PER': ['Guerrero', 'Farfan', 'Pizarro', 'Ramos', 'Cueva', 'Advincuta', 'Zambrano', 'Acevedo', 'Santa Maria', 'Flores', 'Yotun', 'Valera', 'Benavente', 'Quispe'],
  'PAR': ['Cardozo', 'Higuita', 'Santa Cruz', 'Gamarra', 'Caniza', 'Caseres', 'Ayoví', 'Nery', 'Alegre', 'Morales', 'Baez', 'Diaz', 'Acuña', 'Ferreira'],
  'VEN': ['Ronaldinho', 'Faryd', 'Maldonado', 'Penaloza', 'Viafara', 'Seijas', 'Morales', 'Arismendi', 'Rosales', 'Herrera', 'Fariña', 'Murillo'],
  'ENG': ['Sterling', 'Kane', 'Mount', 'Rice', 'Foden', 'Grealish', 'Stones', 'Pickford', 'Maguire', 'Shaw', 'Henderson', 'Rashford', 'Saka', 'Bellingham', 'Wilson', 'Watkins', 'Solanke'],
  'FRA': ['Mbappe', 'Griezmann', 'Benzema', 'Henry', 'Desailly', 'Vieira', 'Zidane', 'Thuram', 'Platini', 'Pastore', 'Kante', 'Pogba', 'Mendy', 'Upamecano', 'Pavard', 'Tolisso', 'Nzonzi'],
  'ESP': ['Busquets', 'Iniesta', 'Xavi', 'Puyol', 'Ramos', 'Casillas', 'Silva', 'Fabregas', 'Torres', 'Villa', 'Alonso', 'Pique', 'Valdes', 'Gago'],
  'GER': ['Muller', 'Kroos', 'Neuer', 'Reus', 'Kruse', 'Gomez', 'Ballack', 'Schweinsteiger', 'Klose', 'Hummels', 'Boateng', 'Ozil', 'Podolski', 'Tah', 'Woltemade', 'Wirtz', 'Musiala'],
  'POR': ['Ronaldo', 'Nani', 'Quaresma', 'Pauleta', 'Figo', 'Coentrao', 'Patricio', 'Joao', 'Bruno', 'Pepe', 'Rui', 'Pinto', 'Beto', 'Horta', 'Dalot'],
  'NED': ['Van Dijk', 'De Vrij', 'Dumfries', 'Cruyff', 'Gullit', 'Van Basten', 'Bergkamp', 'Seedorf', 'Kluivert', 'Robben', 'Sneijder', 'Gakpo', 'Noppert', 'Akanji'],
  'ITA': ['Insigne', 'Pellegrini', 'Barella', 'Immobile', 'Verratti', 'Chiellini', 'Buffon', 'Totti', 'Baggio', 'Pirlo', 'Cannavaro', 'Nesta', 'Maldini', 'Donnarumma'],
  'BEL': ['Hazard', 'De Bruyne', 'Lukaku', 'Chadli', 'Kompany', 'Van der Elst', 'Desmet', 'Tielemans', 'Mertens', 'Vertonghen', 'Alderweireld', 'Denayer', 'Boyata'],
  'CRO': ['Modric', 'Rakitic', 'Lovren', 'Vida', 'Perisic', 'Corluka', 'Mandzukic', 'Rebic', 'Juranovic', 'Vrsaljko', 'Bradaric', 'Halilovic', 'Kramaric'],
  'SUI': ['Xhaka', 'Shaqiri', 'Seferovic', 'Rodriguez', 'Lichtsteiner', 'Behrami', 'Inler', 'Drmic', 'Fernandes', 'Akanji', 'Stojkovic', 'Djourou'],
  'DEN': ['Eriksen', 'Poulsen', 'Braithwaite', 'Kjaer', 'Delaney', 'Christiansen', 'Schmeichel', 'Jensen', 'Vestergaard', 'Dalsgaard', 'Norgaard', 'Wind'],
  'SWE': ['Ibrahimovic', 'Larsson', 'Svensson', 'Ljungberg', 'Kallstrom', 'Jonsson', 'Mellberg', 'Elmander', 'Holmberg', 'Ekdal', 'Granqvist', 'Isaksson'],
  'NOR': ['Ødegaard', 'Aasen', 'Aleesami', 'Johnsen', 'Valgren', 'Elabdellaoui', 'Nyland', 'Risa', 'Osnes', 'Solbakken', 'Sorloth', 'Haaland'],
  'POL': ['Lewandowski', 'Milik', 'Zielinski', 'Klich', 'Glik', 'Pazdan', 'Szczesny', 'Salamon', 'Krol', 'Skorupski', 'Dawidowicz', 'Glushkov'],
  'SRB': ['Mitrovic', 'Tadic', 'Vlahovic', 'Ivanovic', 'Vidic', 'Matic', 'Kostic', 'Kolarov', 'Markovic', 'Antic', 'Jovetic', 'Maksimovic'],
  'AUT': ['Alaba', 'Arnautovic', 'Sabitzer', 'Schaub', 'Lazaro', 'Frieser', 'Grillitsch', 'Bachmann', 'Onisiwo', 'Wober', 'Siebenhandl', 'Drazan'],
  'TUR': ['Yilmaz', 'Ozil', 'Calhanoglu', 'Tosun', 'Tufan', 'Tatar', 'Toprak', 'Soyuncu', 'Belozoglu', 'Guzelbey', 'Altintop', 'Erkin'],
  'UKR': ['Shevchenko', 'Yarmolenko', 'Konoplyanka', 'Milevskiy', 'Zinchenko', 'Bezuhov', 'Tymchenko', 'Nazarenko', 'Bondarenko', 'Kovalenko', 'Dovbyk', 'Malinovskyi'],
  'MAR': ['Ziyech', 'Boufal', 'Bissouma', 'Noussair', 'Aguerd', 'Bono', 'Kudus', 'Saiss', 'Hakimi', 'Attiyat', 'El Kaddouri', 'Amallah', 'En-Nesyri'],
  'SEN': ['Mane', 'Sarr', 'Koulibaly', 'Seck', 'Pape', 'Wague', 'Gueye', 'Niang', 'Kouyate', 'Mendy', 'Sadio', 'Thiam', 'Ndiaye'],
  'NGA': ['Iwobi', 'Osimhen', 'Kanu', 'Mikel', 'Obi', 'Ekong', 'Uzoho', 'Iheanacho', 'Ajayi', 'Bassey', 'Ejuke', 'Omeruo', 'Sanda'],
  'GHA': ['Ayew', 'Gyan', 'Partey', 'Mensah', 'Adomah', 'Amoah', 'Dede', 'Bah', 'Takyi', 'Addo', 'Dzigbordi', 'Appiah'],
  'CMR': ['Eto', 'Mboma', 'Foe', 'Songo', 'Njitap', 'Makoun', 'Keosela', 'Olinga', 'Wowo', 'Simo', 'Momo', 'Emana', 'Ngadeu'],
  'TUN': ['Ben Youssef', 'Mathlouthi', 'Kharja', 'Tebily', 'Ben Younes', 'Jeridi', 'Dziri', 'Boualem', 'Tiba', 'Hadji', 'Ayouni', 'Msakni'],
  'ALG': ['Mahrez', 'Slimani', 'Bentaleb', 'Baku', 'Mandi', 'Bedimo', 'Guechi', 'Bolaji', 'Benazouz', 'Brahimi', 'Ghezzal', 'Benrabia'],
  'EGY': ['Salah', 'Amr', 'Hegazi', 'Gabaski', 'Emam', 'Soliman', 'Rayan', 'Maher', 'Halim', 'Fathy', 'Said', 'Elsayed', 'Abdel-Shafy'],
  'JPN': ['Honda', 'Nagatomo', 'Makino', 'Hasebe', 'Shibasaki', 'Kagawa', 'Matsuda', 'Obi', 'Kamada', 'Minamino', 'Ito', 'Sugimoto', 'Tanaka'],
  'KOR': ['Son', 'Kim', 'Lee', 'Kwon', 'Koo', 'Park', 'Oh', 'Jung', 'Hwang', 'Paik', 'Lim', 'Na', 'Choi'],
  'AUS': ['Leckie', 'Behich', 'Devlin', 'Karacic', 'Cahill', 'Brebner', 'Vidmar', 'Neill', 'Postiga', 'Duke', 'Reddy', 'Mooy', 'Hrustci'],
  'IRN': ['Taremi', 'Azmoun', 'Jahanbakhsh', 'Pouraliganji', 'Cheshmi', 'Rezaeian', 'Hosseini', 'Shojaei', 'Karimi', 'Ansarifard', 'Niazmand', 'Hajsafi'],
  'KSA': ['Al-Dosari', 'Al-Khaibari', 'Al-Muwallad', 'Al-Johani', 'Al-Nemer', 'Al-Motairi', 'Al-Bulayhi', 'Al-Bishi', 'Al-Harbi', 'Al-Faraj', 'Abdulhamid'],
  'QAT': ['Almoez', 'Akram', 'Al-Rawi', 'Al-Marri', 'Al-Duhail', 'Haydos', 'Khoukh', 'Zubair', 'Al-Kubaisi', 'Alaaeldin', 'Ali'],
  'IRQ': ['Khudairi', 'Al-Ghannam', 'Rasheed', 'Al-Maliki', 'Al-Rawi', 'Al-Karawi', 'Al-Dulaimi', 'Hameed', 'Al-Bayati', 'Al-Haaj'],
  'UAE': ['Trezeguet', 'Afif', 'Mabkhout', 'Al-Shamsi', 'Ahmed', 'Al-Junaibi', 'Al-Fahim', 'Khaled', 'Fayez', 'Al-Kubaisi'],
  'NZL': ['Wood', 'Soctland', 'Bosnich', 'Neill', 'Vidmar', 'Cahill', 'Maran', 'Toffoli', 'Postiga', 'Duke', 'Sinclair'],
  'CRC': ['Navas', 'Rónald', 'Bolanos', 'Herrera', 'Calvo', 'González', 'Mejía', 'Duarte', 'Madrigal', 'Fonseca', 'Campbell'],
  'HON': ['Chavez', 'Galas', 'Reyna', 'Motamedi', 'Flores', 'Almendares', 'Delgado', 'Hernandez', 'Vazquez', 'Williams'],
  'JAM': ['Bailey', 'Sinclair', 'Johnson', 'Lawrence', 'Lyttle', 'Morrison', 'Powell', 'Grant', 'Dawkins', 'Campbell'],
  'PAN': ['Torres', 'Quintero', 'Cummings', 'Godoy', 'Velez', 'Miller', 'Gordon', 'Barcenas', 'Murillo', 'Prescott'],
};

// Read and parse the OCR log
console.log('📖 Reading OCR analysis log...');
const logPath = path.join(ROOT, 'ocr-analysis.log');
const logContent = await fs.readFile(logPath, 'utf8');
const lines = logContent.split('\n');

// Parse sticker entries
const results = [];
for (const line of lines) {
  // Match pattern: [0001] ???? | PLAYER NAME
  const match = line.match(/\[(\d{4})\]\s+(\?{4}|[A-Z]{3})\s+\|\s*(.+?)(?:\s+[=@]?\s*)?$/);
  if (match) {
    const index = parseInt(match[1]);
    const country = match[2];
    const playerName = match[3].trim().toUpperCase();
    
    results.push({ index, country, playerName });
  }
}

console.log(`✅ Parsed ${results.length} stickers\n`);

// Try to identify unknown countries by player name
const final = [];
let identified = 0;
let stillUnknown = 0;

for (const result of results) {
  if (result.country !== '????') {
    // Already identified
    final.push(result);
    identified++;
    continue;
  }

  // Try to match player name
  let foundCountry = null;
  const playerWords = result.playerName.split(/\s+/);

  for (const word of playerWords) {
    if (word.length < 3) continue; // Skip short words
    
    for (const [countryCode, players] of Object.entries(PLAYERS_BY_COUNTRY)) {
      for (const player of players) {
        if (word === player.toUpperCase() || player.toUpperCase().includes(word)) {
          foundCountry = countryCode;
          break;
        }
      }
      if (foundCountry) break;
    }
    if (foundCountry) break;
  }

  if (foundCountry) {
    result.country = foundCountry;
    final.push(result);
    identified++;
  } else {
    final.push(result);
    stillUnknown++;
  }
}

console.log(`✅ Identified by player name: ${identified}`);
console.log(`⚠️  Still unknown: ${stillUnknown}\n`);

// Distribution
const distribution = {};
for (const result of final) {
  distribution[result.country] = (distribution[result.country] || 0) + 1;
}

console.log('📊 Country distribution:');
const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
for (const [country, count] of sorted) {
  const label = country === '????' ? '⚠️  UNKNOWN' : country;
  console.log(`  ${label}: ${count}`);
}

// Save results
const mappingPath = path.join(ROOT, 'sticker-corrected-mapping.json');
await fs.writeFile(mappingPath, JSON.stringify(final, null, 2), 'utf8');
console.log(`\n✅ Saved mapping to: sticker-corrected-mapping.json`);

// Show unknowns sample
const unknownStickers = final.filter(s => s.country === '????');
if (unknownStickers.length > 0) {
  console.log(`\n⚠️  Sample of ${unknownStickers.length} unknown stickers:`);
  unknownStickers.slice(0, 20).forEach(s => {
    console.log(`  [${String(s.index).padStart(4, '0')}] ${s.playerName}`);
  });
}
