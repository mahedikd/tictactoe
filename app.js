const statusDisplay = document.querySelector(".txt");
const grids = document.querySelectorAll(".grid-element");
const playerWins = document.querySelector(".playerWins");
const computerWins = document.querySelector(".computerWins");
const gridContainer = document.querySelector("#grid");

window.addEventListener("resize", changeHeight);
window.onload = changeHeight();

function changeHeight() {
	const Cwidth = gridContainer.offsetWidth;
	const Ewidth = grids[0].offsetWidth;
	gridContainer.style.height = `${Cwidth}px`;
	grids.forEach((grid) => {
		grid.style.height = `${Ewidth}px`;
		grid.style.fontSize = `${(Ewidth - 100) / 10 + 4}rem`;
	});
}

let playerScore = 0,
	computerScore = 0;

let gameActive = true;

let currentPlayer = "O";

let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const msg = (() => {
	const winningMessage = () => {
			let player;
			currentPlayer == "O" ? (player = "You") : (player = "Computer");
			return `${player} win!`;
		},
		drawMessage = () => `Game ended in a draw!`,
		currentPlayerTurn = () => {
			let player;
			currentPlayer == "X" ? (player = "Computer's") : (player = "Your");
			return `It's ${player} turn`;
		};

	return {
		winningMessage,
		drawMessage,
		currentPlayerTurn,
	};
})();
///
const dom = (() => {
	function disableClick(e) {
		if (e.target.firstChild) {
			e.target.style.pointerEvents = "none";
		}
	}

	function disableClicks() {
		document
			.querySelectorAll(".grid-element")
			.forEach((elem) => (elem.style.pointerEvents = "none"));
	}

	function updateScore() {
		playerWins.innerText = playerScore;
		computerWins.innerText = computerScore;
	}

	return {
		disableClick,
		disableClicks,
		updateScore,
	};
})();
///
const core = (() => {
	function handleCellClick(clickedCellEvent) {
		const clickedCell = clickedCellEvent.target;

		const clickedCellIndex = parseInt(clickedCell.dataset.id);

		if (gameState[clickedCellIndex] !== "" || !gameActive) {
			return;
		}

		handleCellPlayed(clickedCell, clickedCellIndex);
		handleResultValidation();
	}

	function handleCellPlayed(clickedCell, clickedCellIndex) {
		gameState[clickedCellIndex] = currentPlayer;

		let icon = "";
		if (currentPlayer != "O") {
			icon = '<i id="computerSign" class="fa fa-times" aria-hidden="true"></i>';
		} else {
			icon = '<i id="playerSign" class="fa fa-circle-thin" aria-hidden="true"></i>';
		}
		clickedCell.innerHTML = icon;
	}

	function handleResultValidation() {
		let roundWon = false;
		for (let i = 0; i <= 7; i++) {
			const winCondition = winningConditions[i];
			let a = gameState[winCondition[0]];
			let b = gameState[winCondition[1]];
			let c = gameState[winCondition[2]];
			if (a === "" || b === "" || c === "") {
				continue;
			}
			if (a === b && b === c) {
				roundWon = true;
				break;
			}
		}
		if (roundWon) {
			statusDisplay.innerHTML = msg.winningMessage();
			gameActive = false;

			document.querySelector(".play-again").style.display = "block";

			dom.disableClicks();

			if (currentPlayer == "X") {
				computerScore++;
			} else {
				playerScore++;
			}
			dom.updateScore();
			return;
		}

		let roundDraw = !gameState.includes("");
		if (roundDraw) {
			statusDisplay.innerHTML = msg.drawMessage();
			gameActive = false;

			document.querySelector(".play-again").style.display = "block";

			dom.disableClicks();
			return;
		}

		handlePlayerChange();
	}

	function handlePlayerChange() {
		currentPlayer = currentPlayer === "X" ? "O" : "X";
		// statusDisplay.innerHTML = msg.currentPlayerTurn();
		computerPlay();
	}

	function handleRestartGame() {
		gameActive = true;
		currentPlayer = "O";
		gameState = ["", "", "", "", "", "", "", "", ""];
		statusDisplay.innerHTML = ""; //msg.currentPlayerTurn();
		document.querySelectorAll(".grid-element").forEach((elem) => (elem.innerHTML = ""));

		document
			.querySelectorAll(".grid-element")
			.forEach((elem) => (elem.style.pointerEvents = "unset"));

		document.querySelector(".play-again").style.display = "none";
	}
	function computerPlay() {
		if (currentPlayer == "X") {
			const ra = Math.floor(Math.random() * 9);

			if (grids[ra].firstChild) {
				computerPlay();
			} else {
				grids[ra].click();
			}
		}
	}
	return {
		handleCellClick,
		handleRestartGame,
	};
})();

// statusDisplay.innerHTML = msg.currentPlayerTurn();
//
grids.forEach((elem) => elem.addEventListener("click", core.handleCellClick));
grids.forEach((elem) => elem.addEventListener("click", dom.disableClick));
document.querySelector(".play-again").addEventListener("click", core.handleRestartGame);
