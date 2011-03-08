$(document).ready(function(){
	
 	//prompt next action when clicking on draw
	$("#draw").click(function(){
   		var round;
   		round = whatRound();
   		switch (round) {
   			case 0: //not started yet
   				currentTournament.createDraw();
   				break;
   			case 5: //over
   				var next = nextToPlay();
  				if (next !== undefined) {
   					next.goTo();
  				}
  				else {
  					displayStats();
  					$("#backButton").hide();	
  				}
   				break;
   			default: //in course
   				currentTournament.playNext();
   		}
   	});
   	
   	//toggle sidebar divs
   	$("h5").click(function() {
   		$(this).next("div").slideToggle("slow");
   	});

 	//highlight player in rankings
 	$("#rankings tr").hover(function() {
 		$(this).addClass("highlight");
 		//also show deficit to #1 on hover
 		var pos = $(this).children(".position").html();
 		pos -=1;
 		var deficit = rankings[pos].points - rankings[0].points;
 		$(this).children(".points").html(deficit);
 		}, function() {
 			$(this).removeClass("highlight");
 			var pos = $(this).children(".position").html();
 			pos -=1;
 			$(this).children(".points").html(rankings[pos].points);
 	});
 	
 /*	
 	//show details of tournament on header hover
 	$("#header").hover(function() {
 		$("#details").css("visibility", "visible");
 	});
 	
 */
 	
//set draw automatically with mouse enters draw
 	 $("#draw").mouseenter(function() {
 	 	if (currentTournament.draw[0][0] === undefined){
 		currentTournament.createDraw();
 	 	}
 	});


   	
  	//show details bigger on hover
 	$("#details").hover(function() {
 		$("#details").css("font-weight", "bold");},
 		function() {
 			$("#details").css("font-weight", "normal");
 	});
 	

 	
 });
 
 

	//fade in message with Jquery action	
function fadeInMsg(msg) {
	//fade in message with Jquery action	
	$("#preview p:first").css("opacity", 0);
	$("#preview p:first").delay(400);
 	$("#preview p:first").html(msg);
 	$("#preview p:first").animate({
 		opacity: 1
 			}, 400);	
 	$("#directions").hide();
 			
}

//fade in draw
function fadeInDraw(spot, player, seed) {
	//bold if seed 1-4
	var show;
	if (seed === "(1)" || seed === "(2)" || seed === "(3)" || seed === "(4)") {
		show = "<b>" + player.lastName + seed + "</b>";	
	}
	else {
 		show = player.lastName + seed;	
 	} 	
 	//to delay part of draw
 	var foo = Math.random() * 75;
 	foo = Math.round(foo);
 	var delay;
 	if (foo < 25){
 		delay = 1500;
 	}
 	else if (foo < 50) {
 		delay = 1000;
 	}
 	else {
 		delay = 500;	
 	}
 		
 	$(spot).css("opacity", 0);
 	$(spot).html(show)
 	$(spot).animate({
 		opacity: 1
 	}, delay);			 		
}

//fade in winner
function fadeInWinner(spot, player, seed) {
	//bold if seed 1-4
	var show;
	if (seed === "(1)" || seed === "(2)" || seed === "(3)" || seed === "(4)") {
		show = "<b>" + player.lastName + seed + "</b>";	
	}
	else {
 		show = player.lastName + seed;	
 	} 
 	
  	$(spot).css("opacity", 0);
 	$(spot).html(show);
 	$(spot).animate({
 		opacity: 1
 	}, 800);	
 	
}

//change color scheme 
function setTheme() {
	var selectors = "#preview, #play > a, h5, #footer, #play li"; //where to change colors
	if (currentTournament === australianOpen){
	$(selectors).css("background-color", "##009EDC");
	}
	else if (currentTournament === indianWells){
	$(selectors).css("background-color", "#4C6A9F");
	$("#headline").css("text-shadow", "#4C6A9F 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === miami){
	$(selectors).css("background-color", "#067672");
	$("#headline").css("text-shadow", "#067672 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === monaco){
	$(selectors).css("background-color", "#C1643D");
	$("#headline").css("text-shadow", "#C1643D 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === rome){
	$(selectors).css("background-color", "#E07101");
	$("#headline").css("text-shadow", "#E07101 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === madrid){
	$(selectors).css("background-color", "#CA7322");
	$("#headline").css("text-shadow", "#CA7322 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === frenchOpen){
	$(selectors).css("background-color", "#993300");
	$("#headline").css("text-shadow", "#993300 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === wimbledon){
	$(selectors).css("background-color", "#336633");
	$("#headline").css("text-shadow", "#336633 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === toronto){
	$(selectors).css("background-color", "#D40839");
	$("#headline").css("text-shadow", "#D40839 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === cincinnati){
	$(selectors).css("background-color", "#1A5F6E");
	$("#headline").css("text-shadow", "#1A5F6E 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === usOpen){
	$(selectors).css("background-color", "#004B85");
	$("#headline").css("text-shadow", "#004B85 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === shanghai){
	$(selectors).css("background-color", "#00235F");
	$("#headline").css("text-shadow", "#00235F 0.2em 0.1em 0.2em");
	}
	else if (currentTournament === paris){
	$(selectors).css("background-color", "#006600");
	$("#headline").css("text-shadow", "#006600 0.2em 0.1em 0.2em");
	}
}

  
//reset draw layout (highlight no match)
function resetDraw() {
	for (var i=0; i<=currentTournament.numberMatches*2;i++) { 
			$("#p" + i).css("color", "#000");
		}
	}

