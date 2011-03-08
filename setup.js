//global variables
var nextTournament;
var nextMatch; //store next match on schedule
var lastWinner;
var rankings = []; //array to hold rankings

//create tournaments
var australianOpen = new Tournament ("Australian Open", "slam", "Hard");
var indianWells= new Tournament ("Indian Wells", "masters", "Hard");
var miami= new Tournament ("Miami", "masters", "Hard");
var monaco= new Tournament ("Monaco", "masters", "Clay");
var rome= new Tournament ("Rome", "masters", "Clay");
var madrid= new Tournament ("Madrid", "masters", "Clay");
var frenchOpen = new Tournament ("Roland Garros", "slam", "Clay");
var wimbledon = new Tournament ("Wimbledon", "slam", "Grass");
var toronto= new Tournament ("Toronto", "masters", "Hard");
var cincinnati= new Tournament ("Cincinnati", "masters", "Hard");
var usOpen = new Tournament ("US Open", "slam", "Hard");
var shanghai= new Tournament ("Shanghai", "masters", "Hard");
var paris= new Tournament ("Paris", "masters", "Hard");

//schedule
var schedule = [australianOpen, indianWells, miami, monaco, rome, madrid, frenchOpen, wimbledon, toronto, cincinnati, usOpen, shanghai, paris];
//var schedule = [australianOpen, paris];
var currentTournament = schedule[0]; //tournament initiated at first on schedule

//PLAYERS AND RANKINGS
//create players
var federer = new Player ("Roger", "Federer", 83);
var nadal = new Player ("Rafael", "Nadal", 75);
var djokovic = new Player ("Novak", "Djokovic", 74);
var murray = new Player ("Andy", "Murray", 71);
var delPotro = new Player ("Juan Martin", "Del Potro", 69);
var davydenko = new Player ("Nikolay", "Davydenko", 68);
var roddick = new Player ("Andy", "Roddick", 64);
var soderling = new Player ("Robin", "Sorderling", 57);
var verdasco = new Player ("Fernando", "Verdasco", 58);
var tsonga = new Player ("Jo-Wilfried", "Tsonga", 56);
var gonzalez = new Player ("Fernando", "Gonzalez", 55);
var hewitt = new Player ("Lleyton", "Hewitt", 52);
var monfils = new Player ("Gael", "Monfils", 50);
var cilic = new Player ("Marin", "Cilic", 58);
var simon = new Player ("Gilles", "Simon", 46);
var wawrinka = new Player ("Stanlisas", "Wawrinka", 49);

//entry list of players to start season
var players = [federer, nadal, djokovic, murray, delPotro, davydenko, roddick, soderling, verdasco, tsonga, gonzalez, hewitt, monfils, cilic, simon, wawrinka];
var rankings = [federer, nadal, djokovic, murray, delPotro, davydenko, roddick, soderling, verdasco, tsonga, gonzalez, hewitt, monfils, cilic, simon, wawrinka];

//initialize h2h field with 0 wins according to players entered
var i, l;
for (i=0, l=players.length; i < l; i+=1) {  //outer loop iterate through players entered
	for (var j=0; j < l; j+=1) { //inner loop assign each opponent to h2h array with 0 wins
		players[i].h2h[j] = [players[j], 0];
	}	
}

//specifics ability for player based on surface 
djokovic.ability[0] += 3;  //hard
murray.ability[0] += 2; 
nadal.ability[1] += 18; //clay
gonzalez.ability[1] += 3;  
murray.ability[1] -= 2;
tsonga.ability[1] -= 4;  
roddick.ability[1] -= 16; 
hewitt.ability[1] -= 4;
federer.ability[2] += 8;  //grass
verdasco.ability[2] -= 4; 
gonzalez.ability[2] -= 2; 
davydenko.ability[4] -= 5; 