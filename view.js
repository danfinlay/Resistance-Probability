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
}

module.exports = function(){
	return new ViewUpdater();
}