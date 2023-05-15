"use strict";
//const ROT = require("rot");
/**
 * 
 * Unchangable configuration variables
 */
let room = 1;
let lastroom = 99;
let enemy_pos = [-1, -1, 9];

const c = Object.freeze({
    emptySpace: ' ',
    wall: '1',
    enemy: 'X',
    gateHorizontal: "\"",
    gateVertical: "=",
    boardWidth: 80,
    boardHeight: 24,
})
let EnemyInRoom = {
    first: "2",
    second: "3",
    third: "4",
    forth: "6"
}
/**
 * The state of the current game
 */
let GAME = {
    currentRoom: "",
    board: [],
    map: {},
    player: {}
}
let gates = {
    A: {
        gate_back: "no",
        gate: [[5, 41], [6, 41], [7, 41]]
    },
    B: {
        gate_back: [[5, 0], [6, 0], [7, 0]],
        gate: [[5, 41], [6, 41], [7, 41]]
    },
    C: {
        gate_back: [[0, 34], [6, 35], [7, 36]],
        gate: [[4, 0], [5, 0], [6, 0]]
    }
}
/**
 * Create a new player Object
 * 
 * @param {string} name name of the player
 * @param {string} race race of the player
 * @returns 
 */
function initPlayer(name, race) {
    let newRace = {
        x: 1,
        y: 1,
        name: name,
        icon: '@',
        race: race,
        health: 100,
        attack: 1,
        defense: 1,
        isPlayer: true,
        inventory: [],
    }

    if (race === "Elf") {
        newRace.health = 150;
        newRace.attack = 5;
        newRace.defense = 2
    }

    if (race === "Dwarf") {
        newRace.health = 150;
        newRace.attack = 10;
        newRace.defense = 5
    }

    return newRace

}

const ITEMS = {
    DAGGER: "d",
    SHIELD: "s",
    POTION: "p"
}

const ITEM_STATS = {
    [ITEMS.DAGGER]: { health: 0, attack: 5, defense: 0, icon: "D" },
    [ITEMS.SHIELD]: { health: 0, attack: 0, defense: 10, icon: "S" },
    [ITEMS.POTION]: { health: 20, attack: 0, defense: 0, icon: "L" },
}

/**
 * List of the 4 main directions
 */

const DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
]

const PLAYERDOM = {
    width: "16px",
    height: "16px",
    position: "relative"
}

/**
 * Icon of the enemies
 */

const ENEMY = {
    RAT: {//id=3
        NAME: "r",
        PATH: "pics/enemy/rat.png",
        STAT: {
            HEALTH: 10,
            ATTACK: 1,
            DEFENSE: 1,
            isBoss: false
        },
        DOM: {
            width: "16px",
            height: "16px",
            position: "relative"
        },
        POS: {
            x: 0,
            y: 0
        }
    },

    SKELETON: {//id=4
        NAME: "s",
        PATH: "pics/enemy/skeleton.png",
        STAT: {
            HEALTH: 10,
            ATTACK: 1,
            DEFENSE: 1,
            isBoss: false
        },
        DOM: {
            width: "16px",
            height: "16px",
            position: "relative"
        }, POS: {
            x: 0,
            y: 0
        }
    },

    OGRE: {//id=5
        NAME: "o",
        PATH: "pics/enemy/ogre.png",
        STAT: {
            HEALTH: 15,
            ATTACK: 2,
            DEFENSE: 2,
            isBoss: false
        },
        DOM: {
            width: "16px",
            height: "16px",
            position: "relative"
        }, POS: {
            x: 6,
            y: 10
        }
    },

    DRAGON: {//id=6
        NAME: "D",
        PATH: "pics/enemy/dragon_boss.png",
        STAT: {
            HEALTH: 50,
            ATTACK: 5,
            DEFENSE: 1,
            isBoss: true
        },
        DOM: {
            width: "64px",
            height: "64px",
            position: "relative"
        },
        POS: {
            x: 0,
            y: 0
        }
    },
}

function drawing(board, race) {
    var tbl = document.getElementById("gameboard");
    tbl.innerText = "";

    let rat = document.createElement("img");
    let ogre = document.createElement("img");
    let skeleton = document.createElement("img");
    let dragon = document.createElement("img");

    enemy_draw(rat, "r");
    enemy_draw(ogre, "o");
    enemy_draw(skeleton, "s");
    enemy_draw(dragon, "D");


    const result = document.getElementById("display");


    var tbdy = document.createElement('tbody');
    for (var i = 0; i < board.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < board[i].length; j++) {
            var td = document.createElement('td');

            if (board[i][j] !== c.emptySpace && board[i][j] !== "9") {
                let img = document.createElement("img");
                if (board[i][j] == 0) {//door
                    img.src = "pics/tile/door.png";
                    img.setAttribute("class", "surrounding");
                }
                else if (board[i][j] == 1) {//wall
                    img.src = "pics/tile/wall.png";
                    img.setAttribute("class", "surrounding");
                }
                else if (board[i][j] == 2) {//rat
                    img.src = "pics/enemy/rat.png";
                    img.setAttribute("class", "enemy");
                }
                else if (board[i][j] == 3) {//skeleton
                    img.src = "pics/enemy/skeleton.png";
                    img.setAttribute("class", "enemy");
                }
                else if (board[i][j] == 4) {//ogre
                    img.src = "pics/enemy/ogre.png";
                    img.setAttribute("class", "enemy");
                }
                else if (board[i][j] == 6) {//dragon
                    img.src = "pics/enemy/dragon_boss.png";
                    img.setAttribute("class", "dragon");
                    td.colspan = 3;
                    td.rowspan = 3;
                }
                else if (board[i][j] == "P") {
                    switch (race) {
                        case "Human": img.src = "/pics/player/human.png"; break;
                        case "Elf": img.src = "/pics/player/Elf.png"; break;
                        case "Dwarf": img.src = "/pics/player/Dwarf.png"; break;
                    }
                    img.setAttribute("class", "player");
                }
                td.appendChild(img);
            }

            tr.appendChild(td);

        }
        tbdy.appendChild(tr);

    }
    tbl.appendChild(tbdy);
    result.append(tbl);
}

/**
 * Initialize the play area with starting conditions
 */

function init() {
    GAME.currentRoom = room;
    GAME.map = generateMap()
    GAME.player = initPlayer(document.getElementById("playername"), document.getElementById("playerRace"))
    GAME.board = createBoard(c.boardWidth, c.boardHeight, c.emptySpace)

}

function player_draw(player, race) {
    player.src = "/pics/player/" + race + ".png";
    player.style.position = PLAYERDOM.position
    player.style.width = PLAYERDOM.width
    player.style.height = PLAYERDOM.height
}

function enemy_draw(enemy, name) {
    let enemy_string = "";
    switch (name) {
        case "r": enemy_string = "RAT"; break;
        case "s": enemy_string = "SKELETON"; break;
        case "o": enemy_string = "OGRE"; break;
        case "D": enemy_string = "DRAGON"; break;
    }
    enemy.src = ENEMY[enemy_string].PATH;
    enemy.style.position = ENEMY[enemy_string].DOM.position;
    enemy.style.width = ENEMY[enemy_string].DOM.width;
    enemy.style.height = ENEMY[enemy_string].DOM.height;
}

/**
 * Initialize the dungeon map and the items and enemies in it
 */
function generateMap() {
    return {
        [room]: {
            layout: [10, 10, 20, 20],
            gates: [
                // { to: ROOM.B, x: 20, y: 15, icon: c.gateVertical, playerStart: { x: 7, y: 15 } },
            ],
            enemies: [],
            items: []
        }
    }
}

/**
 * Display the board on the screen
 * @param {*} board the gameplay area
 */
function displayBoard(board) {
    let screen = "" // ...
    for (let i = 0; i < board.length; i++) {
        for (let item of board[i]) {
            screen += item
        }
        screen += "\n"
    }
    _displayBoard(screen)
}

/**
 * Draw the rectangular room, and show the items, enemies and the player on the screen, then print to the screen
 */
function drawScreen() {
    // ... reset the board with `createBoard`
    // ... use `drawRoom`
    // ... print entities with `addToBoard`
    //drawRoom();
    let race = document.getElementById("playerRace");
    drawing(GAME.board, race.value);
}

/**
 * Implement the turn based movement. Move the player, move the enemies, show the statistics and then print the new frame.
 * 
 * @param {*} yDiff 
 * @param {*} xDiff 
 * @returns 
 */
function moveAll(yDiff, xDiff) {
    // ... use `move` to move all entities
    // ... show statistics with `showStats`
    // ... reload screen with `drawScreen`
    move(GAME.player, yDiff, xDiff);
    GAME.board = createBoard(c.boardWidth, c.boardHeight, c.emptySpace);
    drawScreen();
}

/**
 * Implement the movement of an entity (enemy/player)
 * 
 * - Do not let the entity out of the screen.
 * - Do not let them mve through walls.
 * - Let them visit other rooms.
 * - Let them attack their enemies.
 * - Let them move to valid empty space.
 * 
 * @param {*} who entity that tried to move
 * @param {number} yDiff difference in Y coord
 * @param {number} xDiff difference in X coord
 * @returns 
 */
function move(who, yDiff, xDiff) {
    if (GAME.board[who.x + xDiff][who.y + yDiff] !== c.wall && (GAME.board[who.x + xDiff][who.y + yDiff] === c.emptySpace || GAME.board[who.x + xDiff][who.y + yDiff] === "9")) {
        who.x = who.x + xDiff;
        who.y = who.y + yDiff;
    }
    else if (GAME.board[who.x + xDiff][who.y + yDiff] == "0") {
        room++;
    }


    //drawing(createBoard(c.boardWidth, c.boardHeight, c.emptySpace), document.getElementById("playerRace").value);



    // ... check if move to empty space
    // ... check if hit a wall
    // ... check if move to new room (`removeFromBoard`, `addToBoard`)
    // ... check if attack enemy
    // ... check if attack player
    //     ... use `_gameOver()` if necessary
}

/**
 * Check if the entity found anything actionable.
 * 
 * @param {*} board the gameplay area
 * @param {*} y Y position on the board
 * @param {*} x X position on the board
 * @returns boolean if found anything relevant
 */
function hit(board, y, x) {
    // ...
}

/**
 * Add entity to the board
 * 
 * @param {*} board the gameplay area
 * @param {*} item anything with position data
 * @param {string} icon icon to print on the screen
 */
function addToBoard(board, item, icon) {
    // ...
}

/**
 * Remove entity from the board
 * 
 * @param {*} board the gameplay area
 * @param {*} item anything with position data
 */
function removeFromBoard(board, item) {
    // ...

    //<td><img></td>
}

/**
 * Create the gameplay area to print
 * 
 * @param {number} width width of the board
 * @param {number} height height of the board
 * @param {string} emptySpace icon to print as whitespace
 * @returns 
 */

function createBoard(width, height, emptySpace) {
    // ...

    let board = []
    for (let i = 0; i < height; i++) {
        board.push([]);
        for (let j = 0; j < width; j++) {
            if (!i || !j || i + 1 == height || j + 1 == width) {
                board[i].push("1");
            } else {
                board[i].push(emptySpace);
            }
        }
    }
    let board2 = drawRoom(board);
    return board2;
}

/**
 * Draw a rectangular room
 * 
 * @param {*} board the gameplay area to update with the room
 * @param {*} topY room's top position on Y axis
 * @param {*} leftX room's left position on X axis
 * @param {*} bottomY room's bottom position on Y axis
 * @param {*} rightX room's right position on X axis
 */
function rooming(board, firststart, firstend, secondstart, secondend) {
    let k = 0;
    let board2 = [];
    for (let i = firststart; i < firstend; i++) {
        board2.push([]);
        for (let j = secondstart; j < secondend; j++) {
            board2[k].push(board[i][j]);
        }
        k++;
    }
    let x = GAME.player.x;
    let y = GAME.player.y;

    board2[x][y] = "P";
    return board2;
}
function drawRoom(board, topY, leftX, bottomY, rightX) {
    let board2 = [];
    board[11] = ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0', '0', '0', '1', '1', '1'];
    for (let i = 0; i < board.length; i++) {
        switch (i) {
            case 5: case 6: case 7: case 15: case 16: case 17: board[i][40] = '0'; break;
            default: board[i][40] = '1'; break;
        }
    }

    for (let i = 12; i < 23; i++) {//bossroom
        for (let j = 1; j < 40; j++) {
            board[i][j] = "9";
        }
    }

    board[17][9] = 6;

    switch (room) {
        case 1: board2 = rooming(board, 0, 12, 0, 41); break;//first room
        case 2: board2 = rooming(board, 0, 12, 40, board[0].length); break;//second room
        case 3: board2 = rooming(board, 11, 24, 40, board[0].length); break;//third room
        case 4: return rooming(board, 11, 24, 0, 41);//Boss room
    }

    return enemypos(board2, room);
    // ...
}

function enemypos(board, room) {
    if (enemy_pos[0] == -1) {
        let x = Math.floor(Math.random() * board.length);
        let y = Math.floor(Math.random() * board[0].length);

        while (board[x][y] !== c.emptySpace || board[x][y] === "9" || board[x][y] === "1" || board[x][y] === "0" || board[x][y] === "P") {
            x = Math.floor(Math.random() * board.length);
            y = Math.floor(Math.random() * board[0].length);
        }
        let enemy = Math.floor((Math.random() * 3) + 2);
        while (enemy == 5) {
            enemy = Math.floor((Math.random() * 3) + 2);
        }
        EnemyInRoom[room] = enemy;
        board[x][y] = enemy;
        enemy_pos[0] = x;
        enemy_pos[1] = y;
        enemy_pos[2] = enemy;
        switch (enemy) {
            case 0: ENEMY.RAT.POS.x = x; ENEMY.RAT.POS.y = y; break;
            case 1: ENEMY.SKELETON.POS.x = x; ENEMY.SKELETON.POS.y = y; break;
            case 2: ENEMY.OGRE.POS.x = x; ENEMY.OGRE.POS.y = y; break;

        }
    }
    else {
        board[enemy_pos[0]][enemy_pos[1]] = enemy_pos[2];
    }
    return board;
}
/**
 * Print stats to the user
 * 
 * @param {*} player player info
 * @param {array} enemies info of all enemies in the current room
 */
function showStats(player, enemies) {
    const playerStats = "" // ...
    const enemyStats = "" // ... concatenate them with a newline
    _updateStats(playerStats, enemyStats)
}

/**
 * Update the gameplay area in the DOM
 * @param {*} board the gameplay area
 */
function _displayBoard(screen) {
    document.getElementById("screen").innerText = screen
}

/**
 * Update the gameplay stats in the DOM
 * 
 * @param {*} playerStatText stats of the player
 * @param {*} enemyStatText stats of the enemies
 */
function _updateStats(playerStatText, enemyStatText) {
    const playerStats = document.getElementById("playerStats")
    playerStats.innerText = playerStatText
    const enemyStats = document.getElementById("enemyStats")
    enemyStats.innerText = enemyStatText
}

/**
 * Keep a reference of the existing keypress listener, to be able to remove it later
 */
let _keypressListener = null

/**
 * Code to run after the player ddecided to start the game.
 * Register the movement handler, and make sure that the boxes are hidden.
 * 
 * @param {function} moveCB callback to handle movement of all entities in the room
 */

function _start(moveCB) {
    //drawing(createBoard(c.boardWidth, c.boardHeight, c.emptySpace), document.getElementById("playerRace").value);

    let attack = false;
    const msgBox = document.getElementById("startBox")
    const endBox = document.getElementById("endBox")
    endBox.classList.add("is-hidden")
    GAME.player.name = document.getElementById("playerName").value
    GAME.player.race = document.getElementById("playerRace").value


    msgBox.classList.toggle("is-hidden")
    _keypressListener = (e) => {
        let xDiff = 0
        let yDiff = 0
        switch (e.key.toLocaleLowerCase()) {
            case 'a': { yDiff = -1; xDiff = 0; break; }
            case 'd': { yDiff = 1; xDiff = 0; break; }
            case 'w': { yDiff = 0; xDiff = -1; break; }
            case 's': { yDiff = 0; xDiff = 1; break; }
            case 'space': { attack = true; break; }
            default: break;
        }
        if (xDiff !== 0 || yDiff !== 0) {

            moveCB(yDiff, xDiff);
        }

    }

    document.addEventListener("keypress", _keypressListener)

}

/**
 * Code to run when the player died.
 * 
 * Makes sure that the proper boxes are visible.
 */
function _gameOver() {
    const msgBox = document.getElementById("startBox")
    msgBox.classList.add("is-hidden")
    const endBox = document.getElementById("endBox")
    endBox.classList.remove("is-hidden")
    if (_keypressListener) {
        document.removeEventListener("keypress", _keypressListener)
    }
}

/**
 * Code to run when the player hits restart.
 * 
 * Makes sure that the proper boxes are visible.
 */
function _restart() {
    const msgBox = document.getElementById("startBox")
    msgBox.classList.remove("is-hidden")
    const endBox = document.getElementById("endBox")
    endBox.classList.add("is-hidden")
    init()
}

init()