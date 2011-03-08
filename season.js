function displaySchedule() {  //update schedule with results and display in HTML
	var i, l; 
	for (i=0, l=schedule.length; i<l; i++) {	
		if (schedule[i].draw[0][0] !== undefined) { // make linkable if tournamenet has started
			$("#s" + i).html("<a href=\"#\" onclick=\"schedule[" + i + "].goTo(); return false;\">" + schedule[i].name + "</a>");
		}
		//slide down winner if exists
		if (schedule[i].winner !== undefined) {
		$("#w" + i).html(schedule[i].winner.lastName);
		$("#w" + i).slideDown("slow");

		}
	}
}

//rank players based on points field
//could possibly use Math.max() function
function rank() {	
	var i, j;
	var low; //floor comparison
	var nextBest; // store next highest players
	var wins; //number of match acts as tiebreaker in case of points equality
	var l=players.length; //array of all players entered
	var alreadyRanked = ""; // keep track of players already ranked
	
	//outer loop stores next highest in rankings array
	for (j=0; j<l; j+=1) {
		wins = 0; //resets number of wins
		low = -1; //reset floor before entering inner loop
		//inner loop iterates through players array to find next highest ranked
		for (i=0; i<l; i+=1) {
			//sentinel checks if player is already ranked
			if (alreadyRanked.indexOf(players[i].lastName) !== -1) {continue;}
			//in case of equal points
			if (players[i].points === low && players[i].winLoss[0] > wins) {
				nextBest = players[i];
				wins = players[i].winLoss[0];
				low = nextBest.points; //reset floor
			}
			// else look for next highest point total
 			if (players[i].points > low) {

				nextBest = players[i];
				wins = players[i].winLoss[0];
				low = nextBest.points; 
			}
		}
		rankings[j] = nextBest; // store player in rankings array
		nextBest.ranking = j+1; //store player ranking (adjust for array starting at 0)
		alreadyRanked = alreadyRanked + nextBest.lastName; //updates listed players
		ceiling = nextBest.points; //resets new ceiling before going through outer loop again
	}
}

//update rankings in html page
function displayRankings() {
	rank();
	//show rankings
	var i, l;
	for (i=0, l=rankings.length; i < l; i +=1) {
		document.getElementById("r" + i).innerHTML = rankings[i].lastName;
		document.getElementById("pts" + i).innerHTML = rankings[i].points;
	}
	//show when last updated
	var stamp = $("#rankUpdate");
		switch (whatRound()) {
		case 0: //start
			$(stamp).html("At Start");
			break;
		case 1: //round of 16
			$(stamp).html("At Start");
			break;
		case 2: //into quarters
			$(stamp).html("After R16");
			break;
		case 3: //into semi's
			$(stamp).html("After quarters");
			break;
		case 4: //into final
			$(stamp).html("After semi's");
			break;
		case 5: //winner
			$(stamp).html("After final");	
		}
	//JQuery effect to stretch text when rankings are updated
	$(stamp).animate({
 		letterSpacing: "0.4em"
 			}, 400).animate({
 			letterSpacing: "0.3em"	
 			}, 700);	
}
	
//show updated stats
function displayStats() {
	
	var txt = "<h5>Season Stats</h5>";
	var i=0, l = rankings.length;
	for (i; i<l;i++) {
		txt += "<b>" + (i+1) + ". " + rankings[i].firstName + " " + rankings[i].lastName + "</b> ";
		txt += "<ul>";
		txt += "<li>" + rankings[i].points + " points</li>";
		txt += "<li>" + rankings[i].winLoss[0] + "-" + rankings[i].winLoss[1] + " record</li>";
		txt += "<li>" + Math.round(rankings[i].winLoss[0] / (rankings[i].winLoss[0]+rankings[i].winLoss[1]) *100) + "% matches won</li>";
		txt += "<li>" + rankings[i].titles.length + " title(s):  ";
		for (var j=0, t=rankings[i].titles.length; j < t; j++) {txt += rankings[i].titles[j].name + " | ";}
		txt += "</li>";
		txt += "<li>Season results: ";
		for (var k=0, r=rankings[i].results.length; k < r; k++) {
			if (k==0 || k===6 || k===7 || k===10) {txt += "<b title=\"" + schedule[k].name + "\">" + rankings[i].results[k] + "</b> | ";} //bold Grand Slams
			else {txt += "<span title=\"" + schedule[k].name + "\">" + rankings[i].results[k] + "</span> | ";}
		}
		txt += "</li></ul>";
	}
	//display the stats with Jquery effect
	$("#court").slideUp();
	$("#stats").show();
	document.getElementById("stats").innerHTML = txt;
	setTheme();
	
	//reset buttons in play, should probably turn this into a function
	$("#backButton").show();
	$("#drawButton").css("display", "none");
	$("#tournieButton").css("display", "none");
	$("#matchButton").css("display", "none");
	$("#roundButton").css("display", "none");
	$("#nextButton").css("display", "none");
}

//determine next playable tournament if any
function nextToPlay() {
	var i, l;
	for (i=0, l=schedule.length; i < l; i+=1) {
		if (schedule[i].winner === undefined) {return schedule[i];}
	}	
}
 			
//latest update to display
function preview() {
	var msg; //will store message to display	
	var round = whatRound();
		switch (round) {
			case 0: //tournament not yet started
				msg = "Welcome to " + currentTournament.name + "!";	
				$("#drawButton").css("display", "block");
				$("#tournieButton").css("display", "block");
				$("#matchButton").css("display", "none");
				$("#roundButton").css("display", "none");
				$("#nextButton").css("display", "none");
				break;
			case 5: //tournament over
				resetDraw(); //reset style of draw, no match highlighted
				msg = "<p><b>" + currentTournament.draw[30][1] + currentTournament.draw[30][0].firstName + " ";
				msg += currentTournament.draw[30][0].lastName + "</b> ";
				if (currentTournament.name.indexOf("Open") !== -1) { //add "the" for certain tournaments
					msg += "WINS the " + currentTournament.name + "!";
				}
				else {
					msg += "WINS " + currentTournament.name + "!";
				}
				//determine next tournament to play, if any
				nextTournament = nextToPlay(); 
				if (nextTournament !== undefined) {  //a tournament exists!
					msg += "<p>Next is: <a href=\"#\" onclick=\"nextTournament.goTo(); return false;\">" + nextTournament.name  + "</a></p>";
					$("#nextButton").css("display", "block");
				}
				else { //it's the end of the season, old friend
					msg += "<p>End of Season!<br /><a href=\"#\" onclick=\"displayStats(); return false;\">View Stats</a></p>";
					$("#nextButton").css("display", "none");
					$("#startButton").show();
					
				}
				displaySchedule();
				$("#matchButton").css("display", "none");
				$("#roundButton").css("display", "none");
				$("#tournieButton").css("display", "none");
				break;
			default: //there is a playable match
				msg = currentTournament.previewMatch()
				$("#drawButton").css("display", "none");
				$("#matchButton").css("display", "block");
				$("#roundButton").css("display", "block");
				$("#tournieButton").css("display", "block");
				$("#nextButton").css("display", "none");
		}	
	
	fadeInMsg(msg);
	//show new rankings at end of a round
	var nextMatch = currentTournament.isMatch();  
	if (nextMatch === 2 || nextMatch === 24 || nextMatch === 28 || nextMatch === 30 || nextMatch === 31) {
		displayRankings();
	}
		
}

//what round are we in based on an array of 4 rounds
function whatRound() {
	var lastPlayed = currentTournament.isMatch(); //determine which match was just played in draw;
	if (lastPlayed < 16) { //set into R16
		return 0;
	}
	else if (lastPlayed < currentTournament.drawSize*3/2) { //into 1/4
		return 1;
	}
	else if (lastPlayed < currentTournament.drawSize*7/4) { //into 1/2
		return 2;
	}
	else if (lastPlayed < currentTournament.drawSize*15/8) { //into F
		return 3;
	}
	else if (lastPlayed === currentTournament.drawSize*15/8){ //winner
		return 4;
	}
	else {return 5;}
}

function backToTournament() {
	$("#court").slideDown("slow");
	$("#stats").hide();
	$("#backButton").hide(); // only see the back button when looking at stats
	preview();	
}
	
	
	

