'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

    let solver = new SudokuSolver();

    app.route('/api/check')
        .post((req, res) => {
            // console.log(req.body);
            // so we are geting input cordinate in the form of character+number like A1; the value is number 
            let {
                puzzle,
                coordinate,
                value
            } = req.body;
            // console.log(cordinate,value,puzzle);
            if (!coordinate || !value) {
                res.send({
                    error: "Required field(s) missing"
                });
            } else {
                //let's first validate the given puzzle string
                let validate = solver.validate(puzzle);
                //now let's get our column and row from given data
                let row = coordinate.split("")[0];
                let col = coordinate.split("")[1];

                //now we convert character to number for row
                row = row.toUpperCase();
                row= row.charCodeAt(0);
                row = row - "A".charCodeAt(0) + 1;

                col = parseInt(col);
                value = parseInt(value);
                console.log(row, col, value);

                if (validate.hasOwnProperty("error")) {
                    res.json({
                        error: validate.error
                    });
                } else if (coordinate.length !== 2 || !(col >= 1 && col <= 9) || !(row >= 1 && row <= 9)) {
                    res.send({
                        error: "Invalid coordinate"
                    });
                } else if (isNaN(value) || !(value >= 1 && value <= 9)) {
                    res.send({
                        error: "Invalid value"
                    });
                } else {
                    let alreadyPresent = solver.isFilled(puzzle, row, col, value);
                    // console.log(alreadyPresent+"i am present");
                    if (alreadyPresent) {
                        res.json({
                            valid: true
                        });
                    }

                    let checkRow = solver.checkRowPlacement(puzzle, row, col, value);
                    let checkCol = solver.checkColPlacement(puzzle, row, col, value);
                    let checkRegion = solver.checkRegionPlacement(puzzle, row, col, value);
                    console.log(checkRow,checkCol,checkRegion);
                    if (checkRow && checkCol && checkRegion) {
                        res.send({
                            valid: true
                        });
                    } else {
                        let conflicts = [];
                        if (!checkRow) {
                            conflicts.push("row");
                        }
                        if (!checkCol) {
                            conflicts.push("column");
                        }
                        if (!checkRegion) {
                            conflicts.push("region");
                        }
                        res.json({
                            valid: false,
                            conflict: conflicts
                        });
                    }
                }
            }
        });

    app.route('/api/solve')
        .post((req, res) => {
            const puzzle = req.body.puzzle;
            console.log(puzzle);
            if (!puzzle) {
                res.json({
                    error: "Required field missing"
                })
            } else {
                let validate = solver.validate(puzzle);
                if (validate.hasOwnProperty("error")) {
                    res.json({
                        error: validate.error
                    });
                } else {
                    let solved = solver.solve(puzzle);
                    if (!solved) {
                        res.json({
                            error: "Puzzle cannot be solved"
                        })
                    } else {
                        res.json({
                            solution: solved
                        });
                    }
                }
            }
        });
};