;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var gameEstimator = require('./resistanceEstimator');
var view = require('./view')();

var gameStarted = false;
var players = [];

$('#newPlayerButton').click(function(e){
	console.log("New player button pressed.")
	var name = $('#playerName').val();
	players.push(name);
	view.renderNames(players);
});
},{"./resistanceEstimator":2,"./view":4}],2:[function(require,module,exports){
var players = [];
var spyPermutations = require('./spyPermutations');

function Player(playerName){
	this.name = playerName;
}

function Game( players ){

	this.players = players;
	this.playerCount = this.players.length;

	this.missions = [];
	this.rules = generateRules( players.length );

	this.spyCount = this.rules.spies.length;

	this.possibilities = spyPermutations.generate(this.players, this.spyCount);

	this.players.forEach(function(player){
		player.spyOdds = this.rules.spies / this.players.length;
	});

	this.possibilities = spyPermutations.generate(this.players, this.spyCount);
}

Game.prototype.updateOdds = function(){

	//Reset player odds
	this.players.forEach(function(player){
		player.spyOdds = 0;
	});

	var possibilityCounter = 0;

	//Add 1 to each player's spy odds for each scenerio in which they are a spy:
	this.possibilities.forEach(function(possibility){
		possibilityCounter += possibility.odds;

		possibility.spies.forEach(function(possibleSpy){
			possibleSpy.spyOdds += possibility.odds;
		});
	});

	//Normalize odds:
	this.players.forEach(function(player){
		player.spyOdds /= possibilityCounter;
	})

	return this.players;

}

function Mission ( selectedPlayers, failCount ){
	this.players = selectedPlayers;
	this.passed = failCount === 0;
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

Game.prototype.missionComplete = function( chosenOnes, failCount ){
	var mission = new Mission( chosenOnes, failCount );

	this.possibilities.forEach(function(possibility){
		if(!isPossible(possibility, mission, failCount)){
			possibility.odds = 0;
		}
	})
	missions.push( mission );
};

function isPossible( possibility, mission, failCount ){
	var inMissionCount = 0;
	var notInMissionCount = 0;

	possibility.spies.forEach(function(spy){
		if(inArray(spy, mission.players)){
			inMissionCount++;
		}else{
			notInMissionCount++;
		}
	})
	return inMissionCount >= failCount;
}

function inArray(o, arr){
	for (var i = 0, len = arr.length; 0 < len; i++){
		if(o === arr[i])
			return true;
	}
	return false;
}

module.exports = function newGame (playerNameArray){
	var players = [];
	playerNameArray.forEach(function(name){
		var player = new Player(name);
		players.push(player);
	})
	var game = new Game(players);
	return game;
}
},{"./spyPermutations":3}],3:[function(require,module,exports){
var generate = function generate(playerList, spyCount){

    var raw = exports.permuteRaw(playerList, spyCount);

    var reduced = reduceList(raw, spyCount);
    
    return reduced;
}
exports.generate = generate;

var reduceList = function (rawList, spyCount){
    var result = [];
    rawList.forEach(function(permutation){

        var spies = [];
        for(var i = 0; i < spyCount; i++){
            spies.push(permutation[i]);
        }

        var permutation = {
            odds: 1,
            spies: spies
        }
        result.push(permutation);
    })
    return result;
}
exports.reduceList = reduceList;

var permuteRaw = function permuteRaw(playerList, spyCount){
    var allArrangements = permute(playerList);
    var realArrangements = [];
    allArrangements.forEach(function(arrangement){
        if(!duplicates(arrangement, realArrangements, spyCount)){
            realArrangements.push(arrangement);
        }
    })
    return realArrangements;
}
exports.permuteRaw = permuteRaw;

var permArr = [], usedChars = [], chorePermutations = [], workshopPermutations=[];
var permute = function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
            permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
};
exports.permute = permute;

var duplicates = function duplicates(arrangement, existantLists, spyCount){
    var spies = [];
    for(var i = 0; i < spyCount; i++){
        spies.push(arrangement[i]);
    }
    for(var i = 0, listCount = existantLists.length; i < listCount; i++){
        var theseSpies = [];
        for(var x = 0; x < spyCount; x++){
            theseSpies.push(existantLists[i][x]);
        }
        if(exports.isEqArrays(spies, theseSpies)){
            return true;
        }
    }
    return false;
}
exports.duplicates = duplicates;

var isEqArrays = function isEqArrays(arr1, arr2) {
  if ( arr1.length !== arr2.length ) {
    return false;
  }
  for ( var i = arr1.length; i--; ) {
    if ( !inArray( arr2, arr1[i] ) ) {
      return false;
    }
  }
  return true;
}
exports.isEqArrays = isEqArrays;

function inArray(arr, b){
    for(var i = 0, len = arr.length; i < len; i++){
        if(arr[i] === b){
            return true;
        }
    }
    return false;
}
},{}],4:[function(require,module,exports){
function ViewUpdater (game){
	this.game = game;
	return this;
}

ViewUpdater.prototype.renderNames = function(players){
	var newHtml = '';
	players.forEach(function(player){
		newHtml+= '<tr><td>'+player;
		newHtml+='</td><td>0</td></td><td>N/A</td><td><input type="radio" name="leaderRadio" player="'+escape(player);
		newHtml+='"></td><td><input type="checkbox" player="'+escape(player)+'></td></tr>';
	})
	$('#playerTable').html(newHtml);
}

module.exports = function(){
	return new ViewUpdater();
}
},{}]},{},[1])
;