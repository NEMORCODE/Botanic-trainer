/*** INITIALIZATION ***/

// Arrays of phrases in both languages
// Initialize them here to keep them global for the entire file
var german = new Array();
var polish = new Array();

changeTopic();

function loadFile(fileName)
{
	german = new Array();
	polish = new Array();

	fetch("topics/" + fileName)
		.then(response => response.text())
		.then(text => { parseFile(text); pickQuestion()})
		.catch((error) => console.error(error));
}
	
function parseFile(text)
{
	const phrases = text.split('\r\n'); // Divide the text file into lines
	// Divide lines into languages
	for (let i = 0; i < phrases.length; i++)
	{
		let line = phrases[i].split(',');
		german.push(line[0]);
		polish.push(line[1]);
	}
}


//*** QUIZ ***/

var mode = "0";
var currentQuestionIndex; // Used only in modes 2 and 3
var correctAnswer;

var button = document.getElementById("checkButton");

function changeTopic()
{
	let fileName = document.getElementById("topic").value;
	currentQuestionIndex = 0;
	loadFile(fileName);
}

function changeMode()
{
	mode = document.getElementById("mode").value;
	pickQuestion();
}

function pickQuestion()
{
	// Pick integer and language
	let index = 0;
	let questionLang = 0;
	if (mode == "0")
	{
		index = getRandomInt(polish.length);
		questionLang = getRandomInt(2);
	}
	else // Modes which increment through phrases
	{
		index = currentQuestionIndex;
		currentQuestionIndex = currentQuestionIndex + 1 < polish.length ? currentQuestionIndex + 1 : 0;
		
		questionLang = parseInt(mode) - 1;
	}
	
	// Set appropriate values
	let question = document.getElementById("question"); // <p> tag
	if (questionLang == 0)
	{
		question.innerHTML = german[index];
		correctAnswer = polish[index];
	}
	else
	{
		question.innerHTML = polish[index];
		correctAnswer = german[index];
	}
	
	// Change button
	button.innerHTML = "SPRAWDŹ";
	button.removeEventListener("click", pickQuestion);
	button.addEventListener("click", checkAnswer);
	
	document.getElementById("input").value = "";
	document.getElementById("feedback").innerHTML = "";
}

function checkAnswer()
{
	let userInput = document.getElementById("input").value;
	let feedback = document.getElementById("feedback");
	
	if (userInput.toLowerCase() == correctAnswer.toLowerCase())
		feedback.innerHTML = "Świetnie! Poprawna odpowiedź."
	else
		feedback.innerHTML = "Niestety, poprawna odpowiedź to " + correctAnswer;
	
	// Change button
	button.innerHTML = "NASTĘPNE";
	button.removeEventListener("click", checkAnswer);
	button.addEventListener("click", pickQuestion);
}

function addCharacter(character)
{
	document.getElementById("input").value += character;
}

function getRandomInt(max) // Exclusive
{
	return Math.floor(Math.random() * max);
}