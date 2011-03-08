//PLAYER CLASS

//CONSTRUCTOR
function Player(firstName, lastName, ability) {
	//FIELDS
	this.firstName = firstName;
	this.lastName = lastName;
	this.ability = [ability, ability, ability];  //hard, clay, grass
	this.confidence = 0;
	this.points = 0;
	this.ranking = 0;
	this.titles = [];
	this.results = []; //assume player plays every tournament
	this.winLoss = [0, 0]; //win-loss record for season
	this.winPercentage; //calculate at end of season for final scoreboard
	this.h2h = [[], []]; //head-to-head record [opponent, number of wins]
	
	//FUNCTIONS
	//player plays an opponent
	this.play = function(opponent) {
		var surface; //determine surface
		switch (currentTournament.surface) {
			case "Hard":
				surface = 0; break;
			case "Clay":
				surface = 1; break;
			case "Grass":
				surface = 2; break;	
		}
		//determine handicap
		var handicap = this.ability[surface] + this.confidence - opponent.ability[surface] - opponent.confidence;  
		//determine chance
		var random =  Math.round(Math.random() * 100); 
		random += handicap;
		if (random<50 ){
			this.winLoss[1] += 1; //add loss to this player win-loss record
			opponent.winLoss[0] += 1; // add win to opponent's win-loss record
			for (var i=0, l=opponent.h2h.length; i<l; i+=1) {  //assign win to head-to-head record
				if (opponent.h2h[i][0] === this) {
					opponent.h2h[i][1] += 1; 
				}
			}
			return opponent; //return winner to function
		}
		for (var i=0, l=this.h2h.length; i<l; i+=1) {  //assign win to head-to-head record
			if (this.h2h[i][0] === opponent) {
				this.h2h[i][1] += 1; 
			}
		}
		this.winLoss[0] += 1; //add loss to this player
		opponent.winLoss[1] += 1; // add win to opponent
		return this;
	}
	
	//allocate results and points to last match played, + title if final
	this.addPoints = function() {
		var played = currentTournament.draw.length - 1; //determine which match was just played in draw
		if (played < currentTournament.drawSize*3/2) { //into quarters
			this.points += currentTournament.points[1];
			this.results[this.results.length-1] = "1/4"; // add updated result to player
		}
		else if (played < currentTournament.drawSize*7/4) { //into semis
			this.points += currentTournament.points[2];
			this.results[this.results.length-1] = "1/2"; 
		}
		else if (played < currentTournament.drawSize*15/8) { // into final
			this.points += currentTournament.points[3]; 
			this.results[this.results.length-1] = "F"; 
			if (this.ability[0] + this.confidence < 70) {this.confidence += 2;} //add confidence to low-ability player if he reaches final
		}
		else { //winner
			this.points += currentTournament.points[4];
			this.results[this.results.length-1] = "W"; // 
			this.titles.push(currentTournament); // add title to player
			currentTournament.winner = this; //update tournament with winner
			if (this.ability[0] + this.confidence < 75) {this.confidence += 4;} //add confidence to low-ability player if he wins tournament
			else {this.confidence += 2;}
		}
	}
		
	
	//determine h2h with another player
	this.getH2h = function(opponent) {
		var h2h; // will store return
		var l=this.h2h.length; //loop variable
		for (var i=0; i < l; i +=1) {
			if (this.h2h[i][0] === opponent) {
				h2h = this.h2h[i][1] + "-";
				break;	
			}
		}		
		for (var i=0; i < l; i +=1) {
			if (opponent.h2h[i][0] === this) {
				h2h += opponent.h2h[i][1];
				break;	
			}
		}
		return h2h;
	}
	
}

