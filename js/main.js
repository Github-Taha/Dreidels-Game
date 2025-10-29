const gameBoardEl = document.querySelector(".gameboard");
const transitionScreenEl = document.querySelector(".transitionScreen");
const titleScreen = document.querySelector(".titleScreen");
const winScreen = document.querySelector(".winScreen");
const loseScreen = document.querySelector(".loseScreen");
const mainDreidelEl = document.querySelector("#game-dreidel");
const rollBttn = document.querySelector(".roll-button");
const descriptionEl = document.querySelector(".description");

const transitionAnimSpeed = 1;
const coinAnimationSpeed = 0.7;
document.body.style.setProperty("--transition-anim-speed--", `${transitionAnimSpeed}s`);
document.body.style.setProperty("--coin-animation-speed--", `${coinAnimationSpeed}s`);

let dreidelRolling = false;
let titleDreidelID = 0;
let coinsInPot = [];
let mainDreidelID = 0;
let turn = 1;
let canPressButton = true;
let playerWin = 0;

let player1 = {
    "coins": [0, 1, 2, 3, 4],
};

let player2 = {
    "coins": [5, 6, 7, 8, 9]
};

document.body.style.setProperty("--player-1-coins--", player1["coins"].length);
for (let i = 0; i < player1["coins"].length; i++) {
    const coinImg = document.createElement("img");
    coinImg.classList.add("coin-img");
    coinImg.id = "coin" + player1["coins"][i];
    coinImg.src = "assets/coin.png";

    gameBoardEl.appendChild(coinImg);
}

document.body.style.setProperty("--player-2-coins--", player2["coins"].length);
for (let i = 0; i < player2["coins"].length; i++) {
    const coinImg = document.createElement("img");
    coinImg.classList.add("coin-img");
    coinImg.id = "coin" + player2["coins"][i];
    coinImg.src = "assets/coin.png";

    gameBoardEl.appendChild(coinImg);
}

setCoinPositions();

window.setInterval(
    () => {
        if (getComputedStyle(document.querySelector(".titleScreen")).getPropertyValue("display") == "block") {
            document.querySelector("#title-dreidel").src = `assets/dreidel/dreidel-frame${titleDreidelID % 36}.png`;
            titleDreidelID ++;
        }
    },
    300
);

document
    .querySelector(".start-button")
    .addEventListener(
        "mousedown",
        () => {
            document.querySelector(".start-button").src = "assets/buttons/startButtonPressed.png"
        }
    );

document
    .querySelectorAll(".reset-button")
	.forEach(
		(el) => {
		    el.addEventListener(
		        "mousedown",
		        () => {
		            el.src = "assets/buttons/playagainPressed.png"
		        }
		    );
		}
	);

document
    .querySelectorAll(".reset-button")
	.forEach(
		(el) => {
		    el.addEventListener(
		        "mouseup",
		        () => {
		            el.src = "assets/buttons/playagain.png"
					window.setTimeout(
						() => {
							location.reload();
						},
						300
					);
		        }
		    );
		}
	);

document
    .querySelector(".start-button")
    .addEventListener(
        "mouseup",
        () => {
            document.querySelector(".start-button").src = "assets/buttons/startButton.png"

            transitionScreenEl.style.display = "block";
            transitionScreenEl.style.animation = "transitionAnim var(--transition-anim-speed--) ease-in-out";

            window.setTimeout(
                () => {
                    titleScreen.style.display = "none";
                    gameBoardEl.style.display = "block";
                },
                transitionAnimSpeed / 2 * 1000
            );

            window.setTimeout(
                () => {
                    transitionScreenEl.style.animation = "";
                    transitionScreenEl.style.display = "none";
                    startGame();
                },
                transitionAnimSpeed * 1000
            );
        }
    );

rollBttn.addEventListener(
    "mousedown",
    () => {
        if (!dreidelRolling && canPressButton) {
            rollBttn.src = "assets/buttons/rollButtonPressed.png";
        }
    }
);

rollBttn.addEventListener(
    "mouseup",
    function () {

        if (!dreidelRolling && canPressButton) {
            rollBttn.src = "assets/buttons/rollButtonDisabled.png";
            descriptionEl.src = "assets/descrip/descripEmpty.png";
            canPressButton = false;
    
            spinDreidle(
                async () => {

                    switch (mainDreidelID) {
                        case 35:
                        case 0:
                            // Put one in
                            descriptionEl.src = "assets/descrip/descrip0.png";
                            break;
                        case 8:
                            // Take half
                            descriptionEl.src = "assets/descrip/descrip1.png";
                            break;
                        case 17:
                            // Take all
                            descriptionEl.src = "assets/descrip/descrip2.png";
                            break;
                        case 26:
                            // Do nothing
                            descriptionEl.src = "assets/descrip/descrip3.png";
                            break;
                        default:
                            console.log(mainDreidelID);
                            break;
                    }

                    await wait (400);

                    execStep();
                    setCoinPositions();

                    await wait (coinAnimationSpeed * 1000 + 300)
                    
                    if (execAfterMath()) {
                        setCoinPositions();
                        await wait (coinAnimationSpeed * 1000);
                    }

					if (playerWin != 0)
						return;
                    
                    // Bot Turn
                    turn = 2;
                    descriptionEl.src = "assets/descrip/descripEmpty.png"

                    spinDreidle(
                        async () => {
                            switch (mainDreidelID) {
                                case 35:
                                case 0:
                                    // Put one in
                                    descriptionEl.src = "assets/descrip/descrip0.png";
                                    break;
                                case 8:
                                    // Take half
                                    descriptionEl.src = "assets/descrip/descrip1.png";
                                    break;
                                case 17:
                                    // Take all
                                    descriptionEl.src = "assets/descrip/descrip2.png";
                                    break;
                                case 26:
                                    // Do nothing
                                    descriptionEl.src = "assets/descrip/descrip3.png";
                                    break;
                                default:
                                    console.log(mainDreidelID);
                                    break;
                            }

                            execStep();
                            setCoinPositions();

                            await wait (coinAnimationSpeed * 1000 + 300)
                            
                            if (execAfterMath()) {
                                setCoinPositions();
                                await wait (coinAnimationSpeed * 1000);
                            }

                            await wait (300);

                            canPressButton = true;
                            rollBttn.src = "assets/buttons/rollButton.png";
                            turn = 1;
                        }
                    );
                    
                }
            );
        }
    }
);

function startGame() {
    window.setTimeout(
        () => {
            const token1 = player1["coins"].splice(0, 1);
            const token2 = player2["coins"].splice(0, 1);
            coinsInPot = [...token1, ...token2];

            setCoinPositions();
        },
        500
    );
}

function setCoinPositions () {
    let player1Set = 0;
    let player2Set = 0;
    let coinPotSet = 0;

    for (let i = 0; i < gameBoardEl.querySelectorAll(".coin-img").length; i++) {
        const gbe = gameBoardEl.querySelectorAll(".coin-img")[i];
    
        if (player1["coins"].includes(parseInt(gbe.id.substring(4)))) {
            gbe.style.left = `calc(50% - ${player1["coins"].length} / 2 * 60px + ${player1Set * 60}px)`;
            gbe.style.top = "85%";
            player1Set ++;
        }
    
        else if (player2["coins"].includes(parseInt(gbe.id.substring(4)))) {
            gbe.style.left = `calc(50% - ${player2["coins"].length} / 2 * 60px + ${player2Set * 60}px)`;
            gbe.style.top = "15%";
            player2Set ++;
        }
    
        else if (coinsInPot.includes(parseInt(gbe.id.substring(4)))) {
            gbe.style.left = `calc(50% - ${coinsInPot.length} / 2 * 60px + ${coinPotSet * 60}px)`;
            gbe.style.top = "50%";
            coinPotSet ++;
        }
    
    }
}

function spinDreidle (res) {
    dreidelRolling = true;
    let chosenSide = Math.floor(Math.random() * 4) * 9 + 18;

    let movements = 0;
    let spinDreidelInterval = window.setInterval(
        () => {
            if (movements == chosenSide - 1) {
                window.clearInterval(spinDreidelInterval);

                dreidelRolling = false;

                res();
            }

            mainDreidelID = (mainDreidelID + 1) % 36;
            mainDreidelEl.src = `assets/dreidel/dreidel-frame${mainDreidelID}.png`;
            
            movements ++;
        },
        50
    );
}

function execStep() {
    let tokens;
    console.log(mainDreidelID);
    switch (mainDreidelID) {
        case 35:
        case 0:
            // Put one in

            switch (turn) {
                case 1:
                    tokens = player1["coins"].splice(0, 1);
                    break;
                case 2:
                    tokens = player2["coins"].splice(0, 1);
                    break;
            }

            coinsInPot.push(...tokens);
            break;
        case 8:
        case 9:
            // Take half
            tokens = coinsInPot.splice(0, Math.ceil(coinsInPot.length / 2));
            console.log(tokens);

            switch (turn) {
                case 1:
                    player1["coins"].push(...tokens);
                    break;
                case 2:
                    player2["coins"].push(...tokens);
                    break;
            }

            break;
        case 17:
        case 18:
            // Take all
            tokens = coinsInPot.splice(0);

            switch (turn) {
                case 1:
                    player1["coins"].push(...tokens);
                    break;
                case 2:
                    player2["coins"].push(...tokens);
                    break;
            }

            break;
        case 26:
        case 27:
            // Do nothing
            break;
    }
}

function execAfterMath() {
    let action = false;

    if (player1["coins"].length == 0) {
        loseGame();
		playerWin = 2;
    }
    else if (player2["coins"].length == 0) {
        winGame();
		playerWin = 1;
    }

    if (coinsInPot.length == 0) {
        const token1 = player1["coins"].splice(0, 1);
        const token2 = player2["coins"].splice(0, 1);

        coinsInPot.push(...token1);
        coinsInPot.push(...token2);

        action = true;
    }

    if (player1["coins"].length == 0) {
        loseGame();
		playerWin = 2;
    }
    else if (player2["coins"].length == 0) {
        winGame();
		playerWin = 1;
    }

    return action;
}

function wait (ms) {
    return new Promise((res) => window.setTimeout(res, ms));
}

function winGame () {
    canPressButton = false;
    window.setTimeout(
        () => {
            winScreen.style.display = "block";
            winScreen.style.animation = "endAnimationScreen 500ms ease-in-out forwards";
            winScreen.querySelector(".screenBlock").style.animation = "endAnimationImg 400ms ease-in-out forwards";
        },
        coinAnimationSpeed * 1000 + 500
    );
}

function loseGame () {
    canPressButton = false;
    window.setTimeout(
        () => {
            loseScreen.style.display = "block";
            loseScreen.style.animation = "endAnimationScreen 500ms ease-in-out forwards";
            loseScreen.querySelector(".screenBlock").style.animation = "endAnimationImg 400ms ease-in-out forwards";
        },
        coinAnimationSpeed * 1000 + 500
    );
}

