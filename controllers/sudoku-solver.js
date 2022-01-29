class SudokuSolver {

    //so let's first validate our inputs
    validate(puzzleString) {
        //input length should not be greater then 81 becaus there are only 81(9*9) box
        if (puzzleString.length !== 81) {
            return {
                error: "Expected puzzle to be 81 characters long"
            };
        }
        //input character should only be numbers and dot not other than that
        if (/[^0-9.]/g.test(puzzleString)) {
            return {
                error: "Invalid characters in puzzle"
            }
        }
        return true;
    }
    isFilled(puzzleString, row, col, value) {
        let grid = this.transform(puzzleString);
        if (value == grid[row - 1][col - 1]) {
            return true;
        }
        return false;
    }

    checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);

    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      if (grid[row - 1][i] == value) {
        return false;
      }
    }
    return true;
  }

    checkColPlacement(puzzleString, row, column, value) {
        let grid = this.transform(puzzleString);

        if (grid[row - 1][column - 1] !== 0) {
            return false;
        }

        for (let i = 0; i < 9; i++) {
            if (grid[i][column - 1] == value) {
                return false;
            }
        }
        return true;
    }




    checkRegionPlacement(puzzleString, row, column, value,num) {
            let grid = this.transform(puzzleString);

            if (grid[row - 1][column - 1] !== 0) {
                return false;
            }

            let startRow = row - (row % 3),
                startCol = column - (column % 3);
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[i + startRow][j + startCol] == num) {
                        return false;
                    }
                }
            }
            return true;
        }
        //let's first transform our coming input string in to the grid that we can understand better and can work better with it.
    transform(puzzleString) {
        //we have total 9 row and 9 column
        //basic grid:-
        let grid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        //why -1 because when it reaches 8th row it is finale row so it dont have to add more row 
        let row = -1;
        let col = 0;

        //so we have 2 task first is to fill the place in the grid and replace the . with 0 in string
        //so coming input is long string that is left to right so we have to tell our grid that next row is starting from this so keep in that in mind fill the grid accordingly

        for (let i = 0; i < puzzleString.length; i++) {
            //for new row
            if (i % 9 == 0) {
                row++
            }
            //for new col means if the row is gone to the 9 the column so it has to start filling the column from 0
            if (col % 9 == 0) {
                col = 0;
            }
            // console.log("this is row "+row+" this is column "+
            //   col+"this is puzzleString "+ puzzleString[i]);

            grid[row][col] = (puzzleString[i] === "." ? 0 : puzzleString[i]);
            col++;
            // console.log(" this is grid "+grid[row][col])
            // }
        }
        return grid;

    }

    //we have to transform back our solved grid to string 
    transformBack(grid) {
            //flat for making all subarrays to one array
            return grid.flat().join("");
        }
        //let's solve sudoku
        //we have to use any kind of recursive function that can check the number is already existing in row,column or in region
    solveSudoku(grid, row, col) {

        if (col == 9) {
            if (row == 8) {
                //if our recurssion is completed for all row and col then it should return the grid
                return grid;
            }
            //if it reached col then it should start with new col and new row
            row++;
            col = 0;
        }

        if (grid[row][col] != 0) {
            return this.solveSudoku(grid, row, col + 1);
        }

        for (let num = 1; num <= 9; num++) {
            //we have to first check is this number already there in row col or not so we can place this number
            if (this.isSafe(grid, row, col, num)) {
                //if number is safe than assign it 
                grid[row][col] = num;
                // then start the the next iteration in recursion 
                if (this.solveSudoku(grid, row, col + 1)) {
                    //if sudoku is solved then return the grid 
                    return grid;
                }
            }
            grid[row][col] = 0;

        }
        return false;
    }

    //function for checking is number safe or not 
    //input will be whole grid,row,col,and the num

    isSafe(grid, row, col, num) {
        // console.log(row,col);
        //for row
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] == num) {
                return false;
            }
        }
        //for col
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] == num) {
                return false;
            }
        }
        //for region

        let startRow = row - (row % 3);
        let startCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] == num) {
                    return false;
                }
            }
        }
        return true;
    }

    solve(puzzleString) {
        let grid = this.transform(puzzleString);
        grid = this.solveSudoku(grid, 0, 0);
        // console.log(grid);
        if (!grid) {
            return false;
        }
        //we have to give back input as string :)
        let solvedPuzzle = this.transformBack(grid);
        console.log(solvedPuzzle);
        return solvedPuzzle;
    }

}

module.exports = SudokuSolver;