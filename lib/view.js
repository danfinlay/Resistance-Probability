function ViewUpdater (game){
	this.game = game;
	return this;
}

ViewUpdater.prototype.renderNames = function(players){
	var newHtml = '';
	players.forEach(function(player){
		newHtml+= '<tr><td>'+player+'</td><td>0</td></td><td>N/A</td><td>';
		newHtml+='<input type="radio" name="leaderRadio" value="'+escape(player);
		newHtml+='"></td><td><input type="checkbox" class="chosenCheckbox" player="'+escape(player)+'"></td></tr>';
	})
	$('#playerTable').html(newHtml);
}

ViewUpdater.prototype.updateGameView = function( game ){

	//Update missions:
	var newHtml = '';
	for(var i = 0, len = game.missions.length; i < len; i++){
		var color = game.missions[i].passed ? 'success' : 'danger';
		newHtml+='<tr class="'+color+'"><td>'+(i+1)+'</td><td>'+game.missions[i].leader+'</td><td>';
		newHtml+=JSON.stringify(game.missions[i].players)+'</td><td>';
		newHtml+=game.missions[i].votesAgainst+'</td></tr>';
	}
	$('#missionTable').html(newHtml);

	//Update possibilities:
	// var newHtml = '';
	// console.log("Considering the possibilities... "+game.possibilities.length);
	// for(var i = 0, len = game.possibilities.length; i < len; i++){
	// 	console.log("Possibility: "+JSON.stringify(game.possibilities[i]));
	// 	if(game.possibilities.odds > 0){
	// 		newHtml+='<tr>';
	// 		for(var x = 0, length = game.possibilities[i].spies.length; x < length; x++){
	// 			newHtml+='<td>'+game.possibilities[i].spies[x].name+'</td>';
	// 		}	
	// 		newHtml+='</tr>';
	// 	}
	// }
	// console.log("Possibility table: "+newHtml);
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
		newHtml+='"></td><td><input type="checkbox" class="chosenCheckbox" player="'+escape(name)+'"></td></tr>';
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