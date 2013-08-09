var gameEstimator = require('./resistanceEstimator');
var view = require('./view')();
var game;
var gameStarted = false;
var players = [];
var failsPlayed = 0;
var _ = require('underscore');

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
	if(chosenPlayers.length === requiredForMission){
		console.log("thesePlayers checked: "+JSON.stringify(chosenPlayers));
		var leader = unescape($('.leaderRadio').val());

		game.missionComplete( leader, chosenPlayers, failsPlayed );
		view.updateGameView( game );
	}else{
		var missionNo = missionNumber + 1;
		$('.modal-body').text("With "+game.players.length+" players, there are "+requiredForMission+" players required to go on mission #"+missionNo+".");
		$('#myModal').modal();
	}
});

$('#playerName').click(function(e){
	$('#playerName').val('');
})