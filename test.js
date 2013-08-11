var assert = require('assert');
var expect = require('expect.js');
var permute = require('./lib/spyPermutations');
var gameEstimator = require('./lib/resistanceEstimator');

describe('permutation generator', function(){

	it('should not mind two mis-ordered arrays', function(){
		expect(permute.isEqArrays([1,2,3], [3,1,2])).to.be.ok();
	});

})

var samplePlayers = [{name:"Dan"}, {name:"Alexa"}, {name:"Benny D"}, {name:"Harrold"}, {name:"Kumar"}];
var sampleTeam = [{name:"Dan"}, {name:"Alexa"}];
var sampleFailCount = 1;

describe('resistance estimator', function(){

  var game = gameEstimator([{name:"Dan"}, {name:"Alexa"}, {name:"Benny D"}, {name:"Harrold"}]);

  it('should have players with string names', function(){
    game.missionComplete("Dan", sampleTeam, sampleFailCount);
    expect(typeof game.players[0].name).to.be.a('string');
  });

  it('should return numerical odds', function(){
    expect(game.players[0].spyOdds).to.be.ok();
    expect(game.players[0].spyOdds < 1).to.be.ok();
    expect(game.players[0].spyOdds > 0).to.be.ok();
    expect(game.players[0].spyOdds).to.be.a('number');
  });

});