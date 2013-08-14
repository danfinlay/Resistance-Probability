var players = [];
var spyPermutations = require('./spyPermutations');
var _ = require('underscore');

module.exports = function newGame (players, cb){
	var game = new Game(players, cb);
	return game;
}

function Player(playerName){
	this.name = playerName;
	this.trust = 0;
}

function Game( players, cb ){

	console.log("Making a new game with "+players.length);
	this.players = players;
	this.playerCount = this.players.length;

	this.missions = [];
	this.generateRules = generateRules;
	this.rules = generateRules( players.length );
	 console.log("Rules generated: "+JSON.stringify(this.rules));

	var spyCount = this.rules.spies;
	this.spyCount = spyCount;

	for(var i = 0, len = players.length; i < len; i++){
		this.players[i].spyOdds = spyCount / len;
	}

	console.log("Here come the possibilities:");
	var game = this;
	this.possibilities = spyPermutations.generate(players, this.spyCount);
	return this;
}


Game.prototype.updateOdds = function(){

	var possibleOutcomes = 0;
	var game = this;
	this.possibilities.forEach(function(possibility){
		if(game.isPossible(possibility)){
			// console.log("Possible: "+JSON.stringify(possibility));
			possibleOutcomes++;
			possibility.odds = 1;
		}else{
			// console.log("Impossible: "+JSON.stringify(possibility));
			possibility.odds = 0;
		}
	});

	this.updatePlayerOdds(possibleOutcomes);
	// console.log("Updated odds to: "+JSON.stringify(this.possibilities));
	console.log("Players set to: "+JSON.stringify(this.players));

}

Game.prototype.updatePlayerOdds = function(possibleOutcomes){
	var game = this;
	this.players.forEach(function(player){
		player.spyOdds = 0;
		game.possibilities.forEach(function(possibility){
			if(_.contains( possibility.spies, player )){
				// console.log("Adding odds: "+possibility.odds);
				player.spyOdds += possibility.odds;
			}else{
				// console.log("No odds added");
			}
		});
		player.spyOdds /= possibleOutcomes;
	});

}

function Mission ( leader, selectedPlayers, failCount, maxFails ){
	this.leader = leader;
	this.players = selectedPlayers.slice(0);
	this.failCount = failCount;
	this.passed = (failCount < maxFails);
	this.votesAgainst = failCount;
}

function generateRules( numberOfPlayers ){
	var ruleData = { //Decimals represent rounds where two spies are required to fail a mission.
		5:[2, 3, 2, 3, 3],
		6:[2, 3, 4, 3, 4],
		7:[2, 3, 3, 4.5, 4],
		8:[3, 4, 4, 5.5, 5],
		9:[3, 4, 4, 5.5, 5],
		10:[3, 4, 4, 5.5, 5]
	};
	
	var spyCounts = {
		5: 2,
		6: 2, 
		7: 3,
		8: 3, 
		9: 3,
		10: 4
	};

	return {
		rounds: ruleData[ numberOfPlayers ],
		spies: spyCounts[ numberOfPlayers ]
	};
}

Game.prototype.missionComplete = function( leader, chosenOnes, failCount ){
	var maxFails = this.rules.rounds[this.missions.length] % 1 === 0 ? 1 : 2;
	var mission = new Mission( leader, chosenOnes, failCount, maxFails );
	console.log("New mission made");

	this.missions.push( mission );
	this.updateOdds(mission);
	
	console.log("About to push the mission...");
};

Game.prototype.isPossible = function( possibility ){
	// console.log("Is possible?");
	var game = this;

	if( this.containsTrustedSpy( possibility ) ){
		// console.log("Trusted player detected.");
		return false;
	}

	for(var m = 0, mLen = this.missions.length; m < mLen; m++){
		var mission = this.missions[m];

		//Test if more fails were thrown than this possibility proposes were on this mission:
		var spiesInMission = 0;
		var missionPlayerNames = _.map(mission.players, function(a){return a.name;});

		possibility.spies.forEach(function(spy){
			if(inArray(spy.name, missionPlayerNames)){
				spiesInMission++;
			}
		});

		// console.log("Is the proposed "+spiesInMission+" spies less than "+mission.failCount+"?");
		if(spiesInMission < mission.failCount){
			return false;
		}
	}
	return true;
}

Game.prototype.containsTrustedSpy = function( possibility ){

	var game = this;
	var trustedPlayers = this.trustedPlayerArray();

	for(var t=0, tLen = trustedPlayers.length; t < tLen; t++){
		if(_.contains(possibility.spies, trustedPlayers[t])){
			return true;
		}
	}
	return false;
}

Game.prototype.trustedPlayerArray = function(){
	var trustedPlayers = [];
	this.players.forEach(function(player){
		if(player.trust){
			trustedPlayers.push(player);
		}
	});
	return trustedPlayers;
}

function inArray(o, arr){
	for (var i = 0, len = arr.length; i < len; i++){
		if(o === arr[i]){
			return true;
		}
	}
	return false;
}

Game.prototype.generatePossibilityView = function(){
	var newHtml = '';
	// console.log("Considering the possibilities... "+this.possibilities.length);
	for(var i = 0, len = this.possibilities.length; i < len; i++){
		// console.log("Possibility: "+JSON.stringify(this.possibilities[i]));
		if(this.possibilities[i].odds > 0){
			newHtml+='<tr>';
			for(var x = 0, length = this.possibilities[i].spies.length; x < length; x++){
				newHtml+='<td>'+this.possibilities[i].spies[x].name+'</td>';
			}	
			newHtml+='</tr>';
		}
	}
	return newHtml;
}