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
	game = null;
	players = [];
	$('#newPlayerDiv').show(0);
	$('#playerListDiv').removeClass('span12').addClass('span9');
	view.renderNames(["None"]);
});

$('#newPlayerButton').click(function(e){
	var name = $('#playerName').val();
	var newPlayer = {
		name: name,
		trust:false,
		leader:false,
		teamMember:false
	};
	players.push(newPlayer);
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
		$('#newPlayerDiv').hide(0);
		$('#playerListDiv').removeClass('span9').addClass('span12');
	}

	var chosenPlayers = [];
	playerEls = $('.chosenCheckbox:checked');
	for(var i = 0, len = players.length; i < len; i++){
		players[i].trust = ($('.playerRow[player='+escape(players[i].name)+'] .trustBox:checked').length === 1);
		if($('.playerRow[player='+players[i].name+'] .chosenCheckbox:checked').length > 0){
			players[i].teamMember = true;
			chosenPlayers.push(players[i]);
		}
	}
	console.log("Chose players: "+chosenPlayers.length);

	var missionNumber = game.missions.length;
	var requiredForMission = Math.floor(game.rules.rounds[missionNumber]);
	var rightPlayerNumber = (chosenPlayers.length === requiredForMission);
	if(rightPlayerNumber && (failsPlayed < chosenPlayers.length)){

		var leader = unescape($('input:radio[name=leaderRadio]:checked').val());

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
});

$('input.trustBox').on('click', function(e){console.log("Test worked.")});

$('input.trustBox').on('click', function(e){
	var playerName = unescape($(this).attr('player'));
	var selectedPlayer;
	players.forEach(function(player){
		if(player.name === playerName){
			player.trust = !player.trust;
			console.log("Player "+player.name+" is trusted now? "+player.trust);
		}
	});
	if(game){
		//game.updateGameView();
	}
});

$('#trustHeading').tooltip({
	html:"Degree you trust a player, between 0 and 1.  Default is 0.  Set yourself to 1."
})