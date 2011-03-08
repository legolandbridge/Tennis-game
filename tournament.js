//TOURNAMENT CLASS
//CONSTRUCTOR
function Tournament(name, type, surface) {
	
	//FIELDS
	this.name = name;
	if (type === "slam") {
		this.drawSize = 16;
		this.points = [0, 20, 30, 50, 100];
		this.type = "Grand Slam";
	} 
	else if (type === "masters") {
		this.drawSize = 16;
		this.points = [0, 10, 15, 25, 50];
		this.type = "Masters";
	}
	this.surface = surface;
	this.numberMatches = this.drawSize - 1;  //assume direct knockout no bye's system
	this.entryList = [];
	this.draw = [[], []]; // two dimensional array represents [player, seeding]
	this.winner;

	//FUNCTIONS
	
	//determine next empty spot in the draw
	this.isMatch = function () {
		return this.draw.length; 
	}
	
	//create random draw based on tournament entry list and tennis seeding system
	this.createDraw = function() {
		rank(); //obtain latest rankings
		//clone current rankings as tournament entryList, then consequently remove elements that are drawn using splice() function
		for (var i=0, l=rankings.length; i < l; i++) {
			this.entryList[i] = rankings[i];
			this.entryList[i].results.push("1/8"); // add lowest possible result to player results when entering tournament
		}
		//set seeds 1-2
		this.draw[0] = [this.entryList[0], "(1)"]; //#1 seed
		this.draw[15] = [this.entryList[1], "(2)"]; //#2 seed
		//set seeds 3-4
		var random =  Math.round(Math.random() * 100); 
		if (random < 50) {this.draw[7] = [this.entryList[2], "(3)"]; this.draw[8] = [this.entryList[3], "(4)"]; }
		else {this.draw[7] = [this.entryList[3], "(4)"]; this.draw[8] = [this.entryList[2], "(3)"]; }
		this.entryList.splice(0,4); // remove players already drawn from array
		//set seeds 5-8
		var seeds = ["(5)","(6)","(7)","(8)"]; //keep track of seeds and assign to second dimension of draw array
		random =  Math.round(Math.random() * 100);
		if (random < 25) {
			this.draw[3] = [this.entryList[0], seeds[0]]; 
			this.entryList.splice(0,1); 
			seeds.splice(0,1);}
		else if (random < 50) {
			this.draw[3] = [this.entryList[1], seeds[1]]; 
			this.entryList.splice(1,1); 
			seeds.splice(1,1);} 
		else if (random < 75) {
			this.draw[3] = [this.entryList[2], seeds[2]]; 
			this.entryList.splice(2,1); 
			seeds.splice(2,1);} 
		else {
			this.draw[3] = [this.entryList[3], seeds[3]]; 
			this.entryList.splice(3,1); 
			seeds.splice(3,1);} 
		random =  Math.round(Math.random() * 75);
		if (random < 25) {
			this.draw[4] = [this.entryList[0], seeds[0]]; 
			this.entryList.splice(0,1); 
			seeds.splice(0,1);}
		else if (random < 50) {
			this.draw[4] = [this.entryList[1], seeds[1]]; 
			this.entryList.splice(1,1); 
			seeds.splice(1,1);} 
		else {
			this.draw[4] = [this.entryList[2], seeds[2]]; 
			this.entryList.splice(2,1); seeds.splice(2,1);}
		random =  Math.round(Math.random() * 50);
		if (random < 25) {
			this.draw[11] = [this.entryList[0], seeds[0]]; 
			this.entryList.splice(0,1); 
			seeds.splice(0,1);}
		else {
			this.draw[11] = [this.entryList[1], seeds[1]]; 
			this.entryList.splice(1,1); 
			seeds.splice(1,1);} 
		this.draw[12] = [this.entryList[0], seeds[0]]; 
		this.entryList.splice(0,1);
		//set unseeded players 9-16
		var unseededSpots = [1, 2, 5, 6, 9, 10, 13, 14]; //empty spots left in draw
		var i=0;
		var startList = unseededSpots.length;
		while (i < startList) {
			var spot = unseededSpots[i]; // next spot to fill
			drawn = Math.round(Math.random() * (this.entryList.length - 1)); //draw random number from players left
			this.draw[spot] = [this.entryList[drawn], " "];
			this.entryList.splice(drawn,1);
			i++;
		}
		this.displayDraw();
	}
	
	//display draw in html
	this.displayDraw = function() {
	
		for (var i=0; i<=this.numberMatches*2;i++) { // reset drawsheet to empty
			document.getElementById("p" + i).innerHTML = ("______");
		}
		
		if (this.draw[0][0] !== undefined) { //if draw exists
			for (var i=0, l=this.draw.length; i<l;i++) { // show draw up to last match played	
				fadeInDraw("#p" + i, this.draw[i][0], this.draw[i][1]);			
			} 
		}
	preview();//show the next match in draw, or winner
	}


	//play next match
	this.playNext = function() { 
		var nextMatch = this.isMatch(); //determine next empty spot in draw
		var b = nextMatch - this.drawSize; //to determine which bracket corresponds to match
		this.draw[nextMatch] = [this.draw[b*2][0].play(this.draw[b*2+1][0]), "tbd"]; //play actual match and return winner with seed
		//assign seed to second dimension of draw array
		for (var i=0, l=this.drawSize; i < l; i++){
			if (this.draw[nextMatch][0].lastName === this.draw[i][0].lastName) {
				this.draw[nextMatch][1]	= this.draw[i][1]; break;
			}
		}	
		this.draw[nextMatch][0].addPoints(); //and title
		//fade in winner including seed
		fadeInWinner("#p" + nextMatch , this.draw[nextMatch][0], this.draw[nextMatch][1]);	
		preview();
	}
						
	//play rest of tournament in one go
	this.playTournament = function() {
		if (this.draw[0][0] === undefined) {this.createDraw();} // if not drawn yet
		nextMatch = this.isMatch(); //determine next empty spot in draw
		for (var i=nextMatch; i <= this.numberMatches*2; i++) {
			this.playNext();	
		}
	}
	
	//play entire round up to next one
	this.playRound = function() {
		nextMatch = this.isMatch(); // which match is next
		if(nextMatch <= 23) { //determine which round we're on
			for (var i=nextMatch; i <= 23; i+=1) {
				this.playNext();
			}
		}
		else if(nextMatch <= 27) {
			for (var i=nextMatch; i <= 27; i+=1) {
				this.playNext();
			}
		}
		else if(nextMatch <= 29) {
			for (var i=nextMatch; i <= 29; i+=1) {
				this.playNext();
			}
		}
		else {this.playNext();}	
	}
	
	//preview next match on schedule
	this.previewMatch = function() {
		if (this.isMatch() !== -1) {
			var b = this.isMatch() - this.drawSize; //determine which bracket to preview
			var b1 = b*2; //first player in bracket
			var b2 = b1 + 1; //second player in bracket
			var h2h = this.draw[b1][0].getH2h(this.draw[b2][0]);
			h2h = "<br /><small>h2h: " + h2h + "</small>";
			resetDraw(); //clear any previous highlight
			//highlight match in the draw	
			$("#p" + b1).css("color", "red");
			$("#p" + b2).css("color", "red");
			//determine round
			var r = whatRound();
			var stage; //will store output
			switch (r) {
				case 0:
					stage = "No draw";
					break;
				case 1:
					stage = "Round of 16";
					break;
				case 2:
					stage = "Quarter final";
					break;
				case 3:
					stage = "Semi final";
					break;
				case 4:
					stage = "Final";
					break;				
			}
			
			return "<p>" + stage + "</p>" + this.draw[b1][1] + this.draw[b1][0].lastName + " vs. " + this.draw[b2][1] + this.draw[b2][0].lastName + h2h;
		}
		else {return "No match to preview";}
	}	
	
	//display stat details of tournament (surface and points distribution)
	//could make a loop here when the fancy strikes
	this.displaySpecs = function() {
		var txt = currentTournament.type + ". ";
		txt += currentTournament.surface + "<br />";
		txt += "Points: ";
		var totalPoints = currentTournament.points[4] + currentTournament.points[3] + currentTournament.points[2] + currentTournament.points[1];
		txt += totalPoints + ", ";
		totalPoints = totalPoints - currentTournament.points[4];
		txt += totalPoints + ", ";
		totalPoints = totalPoints - currentTournament.points[3];
		txt += totalPoints + ", ";
		totalPoints = totalPoints - currentTournament.points[2];
		txt += totalPoints + ", ";
		totalPoints = totalPoints - currentTournament.points[1];
		txt += (totalPoints);
		$("#details").html(txt);
	}
	
	
	//go to tournament 
	this.goTo = function () { 
		currentTournament = this;
		setTheme();
		document.getElementById("headline").innerHTML = this.name;
		this.displaySpecs();
		this.displayDraw();
		//displayRankings();
		$("#court").show();
		$("#stats").hide();
		$("#backButton").hide();
	}
	
	
	

}
