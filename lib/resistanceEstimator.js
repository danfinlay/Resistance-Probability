var players = [];
var spyPermutations = require('./spyPermutations');
var _ = require('underscore');

module.exports = function newGame (players){
	var game = new Game(players);
	return game;
}

function Player(playerName){
	this.name = playerName;
	this.trust = 0;
}

function Game( players ){

	this.players = players;
	this.playerCount = this.players.length;

	this.missions = [];
	this.rules = generateRules( players.length );

	var spyCount = this.rules.spies;
	this.spyCount = spyCount;

	for(var i = 0, len = players.length; i < len; i++){
		this.players[i].spyOdds = spyCount / len;
	}

	this.possibilities = spyPermutations.generate(players, this.spyCount);
	console.log("New game has "+this.possibilities.length+" possibilities.");

}

Game.prototype.updateOdds = function(){

	//Reset player odds
	this.players.forEach(function(player){
		player.spyOdds = 0;
	});

	var possibilityCounter = 0;

	//Add 1 to each player's spy odds for each scenerio in which they are a spy:
	for(var y = 0; y < this.possibilities.length; y++){

		this.possibilities[y].odds = 1;
		if(!isPossible(this.possibilities[y])){
			possibilityCounter += this.possibilities[y].odds;
			this.possibilities[y].odds = 0;
		}
		for( var x = 0, length = this.possibilities[y].spies.length; x < length; x++){
			//Find that spy in the main array to update them b/c silly JS pass by reference is shallow.
			for(var i = 0, len = this.playerCount; i < len; i++){
				if(this.players[i].name === this.possibilities[y].spies[x].name){
					this.players[i].spyOdds += this.possibilities[y].odds;
				}
			}
		}
	}

	//Normalize odds:
	this.players.forEach(function(player){
		player.spyOdds /= possibilityCounter;
	})

	return this.players;
}

function Mission ( leader, selectedPlayers, failCount, maxFails ){
	this.leader = leader;
	this.players = selectedPlayers.slice(0);
	this.failCount = failCount;
	this.passed = (failCount < maxFails);
	this.votesAgainst = failCount;
}

Mission.prototype.wasIn = function( playerName ){
	this.players.forEach( function( player ){
		if( player.name === playerName ){
			return true;
		}
	})
	return false;
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
	var maxFails = this.rules.rounds[this.playerCount][this.missions.length+1] % 1 === 0 ? 1 : 2;
	var mission = new Mission( leader, chosenOnes, failCount, maxFails );
	console.log("New mission made");

	this.updateOdds(mission);
	
	console.log("About to push the mission...");
	this.missions.push( mission );
};

function isPossible( possibility ){
	this.missions.forEach(function(mission){
		var inMissionCount = 0;
		var notInMissionCount = 0;
		// console.log("Is possible? "+JSON.stringify(possibility));
		possibility.spies.forEach(function(spy){
			//console.log("For thsi spiy...");
			console.log("Checking if "+spy.name+" is in "+JSON.stringify(mission.players));
			if(inArray(spy.name, mission.players)){
				//console.log("Mission count plus!");
				inMissionCount++;
			}else{
				//console.log("Mission count minus!");
				notInMissionCount++;
			}
		})

		var trustedPlayerPresent = false;
		possibility.spies.forEach(function(possibleSpy){
			if(possibleSpy.trust){
				trustedPlayerPresent = true;
			}
		});

		console.log("Is the proposed "+inMissionCount+" spies less than "+failCount+"?");
		if((inMissionCount >= failCount) && !trustedPlayerPresent){
			console.log("Impossible!")
			return false;
		}else{
			console.log("Possible.");
			return true;
		}
	});
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
	console.log("Considering the possibilities... "+this.possibilities.length);
	for(var i = 0, len = this.possibilities.length; i < len; i++){
		console.log("Possibility: "+JSON.stringify(this.possibilities[i]));
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