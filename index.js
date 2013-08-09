var gameEstimator = require('./lib/resistanceEstimator');
var view = require('./lib/view')();
var game;
var gameStarted = false;
var players = [];
var failsPlayed = 0;
var _ = require('underscore');

$('#newGameButton').click(function(e){
	e.preventDefault();
	gameStarted = false;
	view.renderNames(["None"]);
});

$('#newPlayerButton').click(function(e){
	var name = $('#playerName').val();
	players.push(name);
	view.renderNames(players);
	$('#playerName').val('');
});

$('.failCardButtons button').on('click', function(e){
	e.preventDefault();
	$('.failCardButtons button').removeClass('active');
	failsPlayed = parseInt($(this).attr('val'));
	$(this).addClass('active');
})

$('#recordMissionButton').click(function(e){

	console.log("Record mission pressed.");
	if(!gameStarted){
		gameStarted = true;
		game = gameEstimator(players);
	}

	var chosenPlayers = [];
	playerEls = $('.chosenCheckbox:checked');
	for(var i = 0, len = playerEls.length; i < len; i++){
		chosenPlayers.push(unescape($(playerEls[i]).attr('player')));
	}

	var missionNumber = game.missions.length;
	var requiredForMission = game.rules.rounds[missionNumber];
	var rightPlayerNumber = (chosenPlayers.length === requiredForMission);
	if(rightPlayerNumber && (failsPlayed < chosenPlayers.length)){

		var leader = unescape($('input:radio[name=leaderRadio]').val());

		console.log("Leader Selected: "+JSON.stringify(chosenPlayers));

		game.missionComplete( leader, chosenPlayers, failsPlayed );
		view.updateGameView( game );
	}else{
		var missionNo = missionNumber + 1;
		var failOverflow = (failsPlayed > len);
		var newHtml = '';

		if(!rightPlayerNumber){
			newHtml+= "With "+game.players.length+" players, there are "+requiredForMission+" players required to go on mission #"+missionNo+".";
		}
		if(!rightPlayerNumber && failOverflow){
			newHtml+='<br><em>Furthermore:</em><br>';
		}
		if(failOverflow){
			newHtml+='You cannot have more fail cards than there are spies.  You may have mis-clicked.';
		}
		$('.modal-body').text(newHtml);
		$('#myModal').modal();
	}
});

$('#playerName').click(function(e){
	$('#playerName').val('');
})