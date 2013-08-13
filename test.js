var assert = require('assert');
var expect = require('expect.js');
var Browser = require("zombie");
var permute = require('./lib/spyPermutations');
var gameEstimator = require('./lib/resistanceEstimator');

describe('permutation generator', function(){

	it('should not mind two mis-ordered arrays', function(){
		expect(permute.isEqArrays([1,2,3], [3,1,2])).to.be.ok();
	});

})

var samplePlayers = [{name:"Dan", trust:true}, {name:"Alexa"}, {name:"Benny D"}, {name:"Harrold"}, {name:"Kumar"}];
var sampleTeam = [{name:"Dan"}, {name:"Alexa"}];
var sampleFailCount = 1;

describe('resistance estimator', function(){

  var game = gameEstimator(samplePlayers);

    game.missionComplete("Dan", sampleTeam, sampleFailCount);
  var rules = game.rules;

  it('should have players with string names', function(){

    game.players[0].trusted = true;
    expect(game.players[0].name).to.be.a('string');
  });

  it('should have ten possibilities', function(){
    expect(game.possibilities.length).to.be(10);
  });

  it('should return numerical odds', function(){
    expect(game.players[0].spyOdds <= 1).to.be.ok();
    expect(game.players[0].spyOdds >= 0).to.be.ok();
    expect(game.players[0].spyOdds).to.be.a('number');
  });


  it('should generate rules properly', function(){
    expect(rules).to.be.ok();
    expect(rules).to.be.an('object');
    // expect(rules.rounds).to.be.an('array');

  });

  it('should generate numeric rules', function(){
     expect(rules.spies).to.be.ok();
      expect(rules.rounds[1]).to.equal(3);
  });

  it('should rule out trusted players', function(){
    expect(game.players[0].spyOdds).to.be(0);
  })

});

// describe('Awful spies', function(){

//   var game = gameEstimator(samplePlayers);

//   game.missionComplete("Dan", sampleTeam, 2);
//   var rules = game.rules;

//   it('should complete the mission anyway', function(){
//     expect(game.missions.length).to.be(1);
//   });

// });

describe('front end', function(){
  it('should handle normal visitor behavior for a 5 person game', function(done){
    var browser = new Browser({ debug: true })
    browser.runScripts = false
    browser.visit('file:///Users/somniac/Projects/Resistance-Probability/site/index.html')
    // .then(function(){
    //   expect(browser.text('.hero-unit h1 span')).to.be('Resistance Probability Estimator');
    // })
    .then(function(){

      //Add players to game:
      browser.fill('.playerNameField', 'Dan');
      browser.pressButton('#newPlayerButton');
      browser.fill('.playerNameField', 'Alexa');
      browser.pressButton('#newPlayerButton');
      browser.fill('.playerNameField', 'Benny D');
      browser.pressButton('#newPlayerButton');
      browser.fill('.playerNameField', 'Nathan Fillion');
      browser.pressButton('#newPlayerButton');
      browser.fill('.playerNameField', 'Ralph');
      browser.pressButton('#newPlayerButton');

      expect(browser.text('#playerTable tr:first-child td:first-child')).to.be('Dan');

      console.log("Alexa and Benny D on a mission, Nathan Fillion is trusted");
      //Make selections:
      // browser.choose('tr.playerRow:first-child input[name="leaderRadio"]');
      // browser.check('tr.playerRow:nth-child(2) input.chosenCheckbox');
      // browser.check('tr.playerRow:nth-child(3) input.chosenCheckbox');
      // browser.check('tr.playerRow:nth-child(4) input.trustBox');
      // browser.pressButton('button.btn-danger[val="1"]');
      // browser.pressButton('button#recordMissionButton');

      // expect(parseFloat(browser.text('tr.playerRow:first-child td:nth-child(3)')) > 0).to.be.ok();
      done();
    })
    // .then(function(){

    // })
    .fail(function(error){
      console.log("Promise failed: "+error);
    })
  });
});
