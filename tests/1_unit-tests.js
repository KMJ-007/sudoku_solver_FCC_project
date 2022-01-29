const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {

    let validPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    let solvedPuzzleString = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

    let invalidPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.627711..9......1945....4.37.4.3..66.';

    let invalidPuzzleChars = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3aa6..';

    let invalidPuzzleLength = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..99';



    test("Logic handles a valid puzzle string of 81 characters", (done) => {
    	let valid = solver.validate(validPuzzleString);
    	assert.equal(valid,true);
        done();
    })
	test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
    	let valid = solver.validate(invalidPuzzleChars);
    	assert.property(valid, "error");
    	assert.equal(valid.error,"Invalid characters in puzzle");
        done();
    })
	test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    	let valid = solver.validate(invalidPuzzleLength);
    	assert.property(valid, "error");
    	assert.equal(valid.error,"Expected puzzle to be 81 characters long");
        done();
    })
	test("Logic handles a valid row placement", (done) => {
    	let checkRowPlacement = solver.checkRowPlacement(validPuzzleString,1,2,6);
    	assert.equal(checkRowPlacement, true);
        done();
    })
	test("Logic handles a invalid row placement", (done) => {
    	let checkRowPlacement = solver.checkRowPlacement(validPuzzleString,1,2,1);
    	assert.equal(checkRowPlacement, false);
        done();
    })
	test("Logic handles a valid column placement", (done) => {
    	let checkColPlacement = solver.checkColPlacement(validPuzzleString,1,2,6);
    	assert.equal(checkColPlacement, true);
        done();
    })
	test("Logic handles a invalid column placement", (done) => {
    	let checkColPlacement = solver.checkColPlacement(validPuzzleString,1,2,9);
    	assert.equal(checkColPlacement, false);
        done();
    })
	test("Logic handles a valid region (3x3 grid) placement", (done) => {
    	let checkRegionPlacement = solver.checkRegionPlacement(validPuzzleString,1,2,6);
    	assert.equal(checkRegionPlacement, true);
        done();
    })
	test("Logic handles a invalid region (3x3 grid) placement", (done) => {
    	let checkRegionPlacement = solver.checkRegionPlacement(validPuzzleString,2,1,9);
    	assert.equal(checkRegionPlacement, false);
        done();
    })
	test("Valid puzzle strings pass the solver", (done) => {
    	let solvedSudoku = solver.solve(validPuzzleString);
    	assert.equal(solvedSudoku, solvedPuzzleString);
        done();
    })
	test("invalid puzzle strings pass the solver", (done) => {
    	let solvedSudoku = solver.solve(invalidPuzzleString);
    	assert.equal(solvedSudoku, false);
        done();
    })
	test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    	let solvedSudoku = solver.solve(validPuzzleString);
    	assert.equal(solvedSudoku, solvedPuzzleString);
        done();
    })
});