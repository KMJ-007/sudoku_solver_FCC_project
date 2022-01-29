const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

	 let validPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    let solvedPuzzleString = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

    let invalidPuzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.627711..9......1945....4.37.4.3..66.';

    let invalidPuzzleChars = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3aa6..';

    let invalidPuzzleLength = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..99';


    test("Solve a puzzle with valid puzzle string: POST request to /api/solve",(done)=>{
    	chai.request(server)
    	.post("/api/solve")
    	.send({puzzle:validPuzzleString})
    	.end((req,res)=>{
    		assert.equal(res.status,200);
    		assert.equal(res.type,"application/json");
    		assert.property(res.body,"solution");
    		assert.equal(res.body.solution,solvedPuzzleString);
    		done();
    	})
    })
    test("Solve a puzzle with missing puzzle string: POST request to /api/solve",(done)=>{
    	chai.request(server)
    	.post("/api/solve")
    	.send({})
    	.end((req,res)=>{
    		assert.equal(res.status,200);
    		assert.equal(res.type,"application/json");
    		assert.property(res.body,"error");
    		assert.equal(res.body.error,"Required field missing");
    		done();
    	})
    })
    test("Solve a puzzle with invalid characters: POST request to /api/solve",(done)=>{
    	chai.request(server)
    	.post("/api/solve")
    	.send({puzzle:invalidPuzzleChars})
    	.end((req,res)=>{
    		assert.equal(res.status,200);
    		assert.equal(res.type,"application/json");
    		assert.property(res.body,"error");
    		assert.equal(res.body.error,"Invalid characters in puzzle");
    		done();
    	})
    })
    test("Solve a puzzle with incorrect length: POST request to /api/solve",(done)=>{
    	chai.request(server)
    	.post("/api/solve")
    	.send({puzzle:invalidPuzzleLength})
    	.end((req,res)=>{
    		assert.equal(res.status,200);
    		assert.equal(res.type,"application/json");
    		assert.property(res.body,"error");
    		assert.equal(res.body.error,"Expected puzzle to be 81 characters long");
    		done();
    	})
    })
    test("Solve a puzzle that cannot be solved: POST request to /api/solve",(done)=>{
    	chai.request(server)
    	.post("/api/solve")
    	.send({puzzle:invalidPuzzleString})
    	.end((req,res)=>{
    		assert.equal(res.status,200);
    		assert.equal(res.type,"application/json");
    		assert.property(res.body,"error");
    		assert.equal(res.body.error,"Puzzle cannot be solved");
    		done();
    	})
    })
    test("Check a puzzle placement with all fields: POST request to /api/check",(done)=>{
    	chai.request(server)
    	.post("/api/check")
    	.send({
                puzzle:validPuzzleString,
                coordinate:'A1',
                value:7})
    	.end((req,res)=>{
    		assert.equal(res.status,200);
    		assert.equal(res.type,"application/json");
    		assert.property(res.body,"valid");
    		assert.equal(res.body.valid,true);
    		done();
    	})
    })
    test("Check a puzzle placement with single placement conflict: POST request to /api/check",(done)=>{
    	chai.request(server)
    	.post("/api/check")
    	.send({
                puzzle:validPuzzleString,
                coordinate:'A1',
                value:7})
    	.end((req,res)=>{
    		assert.equal(res.status,200);
    		assert.equal(res.type,"application/json");
    		assert.property(res.body,"valid");
    		assert.equal(res.body.valid,true);
    		done();
    	})
    })


    test('Check a puzzle placement with single placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A2',
          value: 3
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');

          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, false);

          assert.property(res.body, 'conflict');
          assert.lengthOf(res.body.conflict, 1);

          done();
        })
    })

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A2',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');

          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, false);

          assert.property(res.body, 'conflict');
          assert.lengthOf(res.body.conflict, 2);

          done();
        })
    })

    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A2',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');

          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, false);

          assert.property(res.body, 'conflict');
          assert.lengthOf(res.body.conflict, 2);

          done();
        })
    })

    test('Check a puzzle placement with missing required fields', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A4'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');

          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');

          done();
        })
    })

    test('Check a puzzle placement with invalid characters', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: invalidPuzzleChars,
          coordinate: 'A4',
          value: '3'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');

          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');

          done();
        })
    })

    test('Check a puzzle placement with incorrect length', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: invalidPuzzleLength,
          coordinate: 'A4',
          value: '3'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');

          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');

          done();
        })
    })

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'K4',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');

          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');

          done();
        })
    })

    test('Check a puzzle placement with invalid placement value', (done) => {
      chai
        .request(server)
        .post('/api/check')
        .send({
          puzzle: validPuzzleString,
          coordinate: 'A3',
          value: 'a'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');

          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');

          done();
        })
    })
});

