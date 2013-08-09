var assert = require('assert');
var expect = require('expect');
var permute = require('../spyPermutations');

describe('permutation generator', function(){

	it('should not mind two mis-ordered arrays', function(){
		expect(permute.isEqArrays([1,2,3], [3,1,2])).to.be.ok();
	});




	it('should work with numbers', function(){
		var permutations = permute([1,2,3], 2);

	});
})