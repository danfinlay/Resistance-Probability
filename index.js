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
	$('#newPlayerDiv').show(0);
	$('#deleteHeading').show(0);	
	$('#playerListDiv').removeClass('span12').addClass('span9');
	view.renderNames(players);
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

$('#playerTable').on('click', '.deletePlayerButton', function(e){
	var index = $(this).closest('.playerRow').data('player-index');
	players.splice(index, 1);
	view.renderNames(players);
});

$('.failCardButtons button').on('click', function(e){
	e.preventDefault();
	$('.failCardButtons button').removeClass('active');
	failsPlayed = parseInt($(this).attr('val'));
	$(this).addClass('active');
})

$('#recordMissionButton').click(function(e){

	e.preventDefault();
	if(players.length < 5 || players.length > 10) return;

	console.log("Record mission pressed.");
	if(!gameStarted){
		gameStarted = true;
		game = gameEstimator(players);
		$('#newPlayerDiv').hide(0);
		$('#deleteHeading').hide(0);	
		$('#playerListDiv').removeClass('span9').addClass('span12');
		recordMissionOnExistantGame()
	}else{
		recordMissionOnExistantGame();
	}
});

function recordMissionOnExistantGame(){
	var chosenPlayers = [];
	playerEls = $('.chosenCheckbox:checked');
	// console.log("Chose players1: "+playerEls.length);

	for(var i = 0, len = game.players.length; i < len; i++){
		game.players[i].trust = ($('.trustBox[player='+escape(game.players[i].name)+']:checked').length === 1);
		if($('.chosenCheckbox[player="'+game.players[i].name+'"]:checked').length > 0){
			game.players[i].teamMember = true;
			chosenPlayers.push(players[i]);
		}
	}
	console.log("Chose players: "+chosenPlayers.length);

	var missionNumber = game.missions.length;
	var requiredForMission = Math.floor(game.rules.rounds[missionNumber]);
	var rightPlayerNumber = (chosenPlayers.length === requiredForMission);
	console.log("Right player number: "+rightPlayerNumber);
	var maxFails = game.rules.rounds[game.missions.length];
	console.log("Max fails: "+maxFails);
	failsPlayed = parseInt($('div.failCardButtons .active').attr('val'));
	console.log("Fails played: "+failsPlayed);


	if(rightPlayerNumber && (failsPlayed <= chosenPlayers.length)){

		var leader = unescape($('input:radio[name=leaderRadio]:checked').val());

		console.log("Leader Selected: "+JSON.stringify(chosenPlayers));

		game.missionComplete( leader, chosenPlayers, failsPlayed );
		view.updateGameView( game );
	}else{
		console.log("maxfails, fails: "+maxFails+" "+failsPlayed);
		var missionNo = missionNumber + 1;
		var failOverflow = (failsPlayed > maxFails);
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
		$('div.failCardButtons[val="'+failsPlayed+'"]').addClass('active');
	}
}

$('#playerName').click(function(e){
	$('#playerName').val('');
});

// $('input.trustBox').on('click', function(e){console.log("Test worked.")});

// $('input.trustBox').on('click', function(e){
// 	var playerName = unescape($(this).attr('player'));
// 	var selectedPlayer;
// 	players.forEach(function(player){
// 		if(player.name === playerName){
// 			player.trust = !player.trust;
// 			console.log("Player "+player.name+" is trusted now? "+player.trust);
// 		}
// 	});
// 	if(game){
// 		//game.updateGameView();
// 	}
// });

$('#undoMissionButton').click(function(e){
	e.preventDefault();
	if(game && game.missions.length > 0){
		game.missions.pop(game.missions.length-1);
		game.updateOdds();
		game.updateGameView();
	}
})

$('#trustHeading').tooltip({
	html:"Degree you trust a player, between 0 and 1.  Default is 0.  Set yourself to 1."
})
