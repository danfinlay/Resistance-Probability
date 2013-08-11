var _ = require('underscore');

function ViewUpdater (game){
	this.game = game;
	return this;
}

ViewUpdater.prototype.renderNames = function(players){
	var newHtml = '';
	players.forEach(function(player){
		newHtml+= '<tr class="playerRow" player = "'+escape(player.name)+'"><td>'+player.name+'</td><td>0</td><td>N/A</td><td>';
		newHtml+='<input type="radio" name="leaderRadio" value="'+escape(player.name);
		newHtml+='"></td><td><input type="checkbox" class="chosenCheckbox" player="'+escape(player.name)+'"></td>';
		newHtml+='<td><input type="checkbox" class="trustBox" player="'+escape(player.name)+'"></td></tr>';
	})
	$('#playerTable').html(newHtml);
}

ViewUpdater.prototype.updateGameView = function( game ){

	//Update missions:
	var newHtml = '';
	for(var i = 0, len = game.missions.length; i < len; i++){
		var color = game.missions[i].passed ? 'success' : 'warning';
		newHtml+='<tr class="'+color+'"><td>'+(i+1)+'</td><td>'+game.missions[i].leader+'</td><td>';
		newHtml+= _.map(game.missions[i].players, function(a){return a.name;}).join(', ')+'</td><td>';
		newHtml+=game.missions[i].votesAgainst+'</td></tr>';
	}
	$('#missionTable').html(newHtml);

	//Update possibilities:
	$('#possibilityTable').html(game.generatePossibilityView());

	//Update players:
	var newHtml = '';
	console.log("Going to display players: "+JSON.stringify(game.players));
	for(var i = 0, len = game.players.length;  i < len; i++){
		var missionCount = 0;
		for(var x=0; x < game.missions.length; x++){
			if(inArray(game.players[i].name, game.missions[x].players))
				missionCount++;
		}
		console.log("Going to display player: "+JSON.stringify(game.players[i]));
		var name = game.players[i].name;
		newHtml+='<tr><td>'+name+'</td><td>'+missionCount;
		newHtml+='</td><td>'+game.players[i].spyOdds+'</td><td>';
		newHtml+='<input type="radio" name="leaderRadio" value="'+escape(name);
		newHtml+='"></td><td><input type="checkbox" class="chosenCheckbox" player="'+escape(name)+'"></td>';

		//Trust checkbox:
		newHtml+='<td><input type="checkbox"';
		newHtml+= game.players[i].trust ? ' checked ' : ' ';
		newHtml+= 'class="trustBox" player="'+escape(name)+'"></td></tr>';

	}
	$('#playerTable').html(newHtml);

}

function inArray(o, arr){
	for (var i = 0, len = arr.length; i < len; i++){
		if(o === arr[i]){
			return true;
		}
	}
	return false;
}

module.exports = function(){
	return new ViewUpdater();
}