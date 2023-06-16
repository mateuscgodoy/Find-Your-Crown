const prompt = require('readline-sync');

const hat = ' 👑 ';
const hole = ' ⬛ ';
const fieldCharacter = ' 🟩 ';
const pathCharacter = ' 🔹 ';

const createRandomPos = (xSize, ySize) => {
    return {
        x: Math.floor(Math.random() * xSize),
        y: Math.floor(Math.random() * ySize)
    }
}

const clearConsoleAndPrintMessages = (messages) => {
    console.clear();
    for (const message of messages){
        console.log(message);
    }
}

class Tile {
    constructor(icon, xPos, yPos){
        this._icon = icon;
        this._xPos = xPos;
        this._yPos = yPos;
    }

    get icon(){
        return this._icon;
    }

    set icon(newIcon){
        this._icon = newIcon;
    }

    get xPos() {
        return this._xPos;
    }

    get yPos() {
        return this._yPos;
    }
}

class GameField {
    constructor(xSize, ySize, gameDifficulty){
        this._xSize = xSize;
        this._ySize = ySize;
        this._difficulty = gameDifficulty;
        this._board = this.initializeBoard();
        this._playerCurrentPos = null;
    }

    get xSize(){
        return this._xSize;
    }

    get ySize(){
        return this._ySize;
    }

    get board(){
        return this._board;
    }
    
    initializeBoard(){
        const board = [];
        for (let i = 0; i < this._ySize; i++) {
            const row = [];
            for (let j = 0; j < this._xSize; j++) {
                row.push(new Tile(fieldCharacter, j,i));
            }
            board.push(row);
        }

        return board;
    }

    generateHoles(){
        const percentage = this._difficulty === 'hard' ? 0.2 : this._difficulty === 'medium' ? 0.15 : 0.1;
        const numberOfHoles = Math.floor(this._xSize * this._ySize * percentage);
        this.generateValidTiles(numberOfHoles, hole);
    }

    generateValidTiles(amountOfTiles, icon) {
        let counter = 0;
        const output = [];
        while(counter < amountOfTiles){
            const newPos = createRandomPos(this._xSize, this._ySize);

            if(this._board[newPos.y][newPos.x].icon !== fieldCharacter){
                continue;
            } else {
                counter++;
                this._board[newPos.y][newPos.x].icon = icon;
                output.push(newPos);
            }
        }
        return output;
    }

    initializeFieldSpecialTiles() {
        this.generateValidTiles(1, hat);
        this._playerCurrentPos = this.generateValidTiles(1, pathCharacter)[0];
        this.generateHoles();
    }

    print() {
        let field = "";
        for(const row of this._board){
            for (const tile of row){
                field += tile.icon;
            }
            field += "\n";
        }
        console.log(field);
    }
    
    tryMovePlayer(direction){
        const newMovementPos = {
            x: direction === 'l' ? this._playerCurrentPos.x - 1 : 
            direction === 'r' ? this._playerCurrentPos.x + 1 : this._playerCurrentPos.x,
            y: direction === 'u' ? this._playerCurrentPos.y - 1 :
            direction === 'd' ? this._playerCurrentPos.y + 1 : this._playerCurrentPos.y,
        }

        if(newMovementPos.y >= this._ySize || newMovementPos.y < 0 || newMovementPos.x >= this._xSize || newMovementPos.x < 0){
            return -1;
        }

        const tileIcon = this._board[newMovementPos.y][newMovementPos.x].icon;
        if(tileIcon === hole){
            return -1;
        } else if(tileIcon === hat){
            return 1;
        } else {
            this._board[newMovementPos.y][newMovementPos.x].icon = pathCharacter;
            this._playerCurrentPos = newMovementPos;
            return 0;
        }
       
    }
}

const game = new GameField(10, 10, 'hard');
game.initializeFieldSpecialTiles();

let gameHasEnded = false;
while (!gameHasEnded) {
    console.clear();
    game.print();

    console.log("Where would you like to move?");
    const userOption = prompt.question("Options: U/u = UP\tD/d = DOWN\tL/l=LEFT\tR/r=RIGHT\tQ/q=QUIT\n\t>>");
    const userOptionToLower = userOption.toLowerCase();

    switch(userOptionToLower){
        case 'u':
        case 'd':
        case 'r':
        case 'l':
            const resultCode = game.tryMovePlayer(userOptionToLower);
            if(resultCode === 1){
                gameHasEnded = true;
                
                clearConsoleAndPrintMessages(["✨ WE HAVE A WINNER!! ✨", "✨ CONGRATULATIONS!! ✨"])
            } else if(resultCode === -1){
                gameHasEnded = true;

                clearConsoleAndPrintMessages([" ❗ ⚠️  GAME OVER  ⚠️ ❗ ", "Thank you for playing!"]);
            }
            break;
        case 'q':
            gameHasEnded = true;

            clearConsoleAndPrintMessages(["Bye Bye 👋", "See you soon!!"])
            break;
        default:
            console.log("That is not a valid option. Do try again.")
            break;
    }
}