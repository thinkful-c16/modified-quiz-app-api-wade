'use strict';

// *********************************************************
// constants for path
// variables to hold pieces of overall query string

const BASE_URL = 'https://opentdb.com';
const MAIN_PATH_SEARCH = '/api.php?';
const RETRIEVE_TOKEN_PATH = '/api_token.php?command=request';
const RETRIEVE_CATEGORIES = '/api_category.php';

// **********************************************************

// In-memory database of categories, fetched from API
const CATEGORIES = [];

// In-memory database of questions, answers, and correct answer

const QUESTIONS = [
  {
    question: 'Who is the supreme lord and most powerful archdevil of the Nine Hells?',
    answers: ['Asmodeus', 'Richard Greenhill', 'Mephistopheles'],
    correctAnswer: 'Asmodeus'
  },
  {
    question: 'How many layers are there in the Nine Hells?',
    answers: ['Several thousand', 'Only one', 'Nine'],
    correctAnswer: 'Nine'
  },
  {
    question: 'What is the arrival point for any visitors to the Nine Hells?',
    answers: ['the stench-ridden bog of Minauros', 'the rocky wastes of Avernus', 'the dark pits of Nessus'],
    correctAnswer: 'the rocky wastes of Avernus'
  },
  {
    question: 'What is the largest metropolis in the Nine Hells?',
    answers: ['the Iron City of Dis', 'the Clockwork Nirvana of Mechanus', 'Abriymoch, the Obsidian Fortress'],
    correctAnswer: 'the Iron City of Dis'
  },
  {
    question: 'Where does the infernal court of Asmodeus reside?',
    answers: ['the River Styx', 'the citadel-spire of Malsheem', 'the City of Brass'],
    correctAnswer: 'the citadel-spire of Malsheem'
  }
];

// *************************
// Create your initial store
// *************************
// ********************************
// & Function for resetting the STORE
// ********************************

const getInitialStore = function() {
  return {
    // Current Question Index
    currentQuestion: 0,
    // Current Question counter
    currentCounter: 1,
    // User's answer choice(s)
    userAnswer: '',
    // Current view
    // Score? Anything else?
    score: 0
  };
};

let STORE = getInitialStore();

// ************************
// Build URL functions
// ************************

function buildBaseUrl() {}
function buildTokenUrl() {}

// ************************
// API Data Fetch Functions
// ************************

function fetchToken() {}
function fetchQuestions() {}
function fetchCategories() {}

// ***************************
// Decorate Response Functions
// ***************************

function decorateQuestion() {}

// **************************
// Add questions to QUESTIONS
// **************************

function addQuestion() {}

// *******************
// Template generators
// *******************

function generateAnswerView() {
  let questionIndex = STORE.currentQuestion;  //********** change all keys to camelCasing (no spaces) */
  let answers = QUESTIONS[questionIndex].answers;

  
  return `<div>
      <h1>Infernal Plane Quiz</h1>
      <div class= 'questions-answered'>
          <p>Question ${STORE.currentCounter}/5</p>
      </div>
      <form>
          <h3>${QUESTIONS[STORE.currentQuestion].question}</h3>
          <div>
              <input type="radio" id="${answers[0]}"
              name="answer" value="${answers[0]}">
              <label for="${answers[0]}">${answers[0]}</label>
              <br>
              <input type="radio" id="${answers[1]}"
              name="answer" value="${answers[1]}">
              <label for="${answers[1]}">${answers[1]}</label>
              <br>
              <input type="radio" id="${answers[2]}"
              name="answer" value="${answers[2]}">
              <label for="${answers[2]}">${answers[2]}</label>
              <br>
              <input type="radio" id="${answers[3]}"
              name="answer" value="${answers[3]}">
              <label for="${answers[3]}">${answers[3]}</label>
              <br>
              <input type="radio" id="${answers[4]}"
              name="answer" value="${answers[4]}">
              <label for="${answers[4]}">${answers[4]}</label>
          </div>
          <div class="user-input">
              <button name= "submit-button" id= "answer-submit-button" class= "input-button" type= "submit" >Submit Answer</button>
          </div>
          <div class= "current-score">
              <p>Current score: ${STORE.score}/5</p>
          </div>
      </form>
    </div>`
  ;
}

function generateAnswerFeedback() {
  // conditionals for feedback specific to whether user answer is correct
  if (STORE.userAnswer === QUESTIONS[STORE.currentQuestion].correctAnswer) {
    return `<div>
    <h1>Infernal Plane Quiz</h1>
    <div class= 'questions-answered'>
      <p>Question ${STORE.currentCounter}/5</p>
    </div>
    <h3>Your answer is correct!</h3>
    <div class= 'user-answer'>Your answer: ${STORE.userAnswer}
    </div>
    <div class= 'correct-answer'>Correct answer: ${QUESTIONS[STORE.currentQuestion].correctAnswer}
    </div>
    <div class="user-input">
    <button name= "submit-button" id= "next-question-button" class= "input-button" type= "submit" >Next question</button>
    </div>
    <div class= "current-score">
      <p>Current score: ${STORE.score}/5</p>
    </div>
    </div>`;
  }

  else {
    return `<div>
    <h1>Infernal Plane Quiz</h1>
    <div class= 'questions-answered'>
      <p>Question ${STORE.currentCounter}/5</p>
    </div>
    <h3>Your answer is incorrect!</h3>
    <div class= 'user-answer'>Your answer: ${STORE.userAnswer}
    </div>
    <div class= 'correct-answer'>Correct answer: ${QUESTIONS[STORE.currentQuestion].correctAnswer}
    </div>
    <div class="user-input">
    <button name= "submit-button" id= "next-question-button" class= "input-button" type= "submit" >Next question</button>
    </div>
    <div class= "current-score">
      <p>Current score: ${STORE.score}/5</p>
    </div>
    </div>`;
  }
}

function generateFinalFeedback() {
  if (STORE.userAnswer === QUESTIONS[STORE.currentQuestion].correctAnswer) {
    return `<div>
    <h1>Infernal Plane Quiz</h1>
    <div class= 'questions-answered'>
      <p>Question ${STORE.currentCounter}/5</p>
    </div>
    <h3>Your answer is correct!</h3>
    <div class= 'user-answer'>Your answer: ${STORE.userAnswer}
    </div>
    <div class= 'correct-answer'>Correct answer: ${QUESTIONS[STORE.currentQuestion].correctAnswer}
    </div>
    <div class="user-input">
    <button name= "submit-button" id= "final-question-button" class= "input-button" type= "submit" >See your results!</button>
    </div>
    <div class= "current-score">
      <p>Current score: ${STORE.score}/5</p>
    </div>
    </div>`;
  }

  else {
    return `<div>
    <h1>Infernal Plane Quiz</h1>
    <div class= 'questions-answered'>
      <p>Question ${STORE.currentCounter}/5</p>
    </div>
    <h3>Your answer is incorrect!</h3>
    <div class= 'user-answer'>Your answer: ${STORE.userAnswer}
    </div>
    <div class= 'correct-answer'>Correct answer: ${QUESTIONS[STORE.currentQuestion].correctAnswer}
    </div>
    <div class="user-input">
    <button name= "submit-button" id= "final-question-button" class= "input-button" type= "submit" >See your results!</button>
    </div>
    <div class= "current-score">
      <p>Current score: ${STORE.score}/5</p>
    </div>
    </div>`;
  }
}

function generateResultsView() {
  if (STORE.score === 0) {
    return `<div>
    <h1>Infernal Plane Quiz Results</h1>
    <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
    <p>Pitiful! You know nothing of archdevils, fiends, and their ilk! You would surely perish in the Nine Hells!</p>
    </div>
    <div class="user-input">
      <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
    </div>`;
  }
  else if (STORE.score === 1) {
    return `<div>
    <h1>Infernal Plane Quiz Results</h1>
    <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
    <p>Wow. You basically know nothing about the Nine Hells. That's probably a good thing.</p>
    </div>
    <div class="user-input">
      <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
    </div>`;
  }
  else if (STORE.score === 2) {
    return `<div>
    <h1>Infernal Plane Quiz Results</h1>
    <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
    <p>Time to hit the tomes! You don't know very much about the Nine Hells. Study up, consult the infernal Sages, and try again.</p>
    </div>
    <div class="user-input">
      <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
    </div>`;    
  }
  else if (STORE.score === 3) {
    return `<div>
    <h1>Infernal Plane Quiz Results</h1>
    <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
    <p>So you know a bit about the Nine Hells. You're a middling scholar of fiendish lore. Congratulations.</p>
    </div>
    <div class="user-input">
      <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
    </div>`;
  }
  else if (STORE.score === 4) {
    return `<div>
    <h1>Infernal Plane Quiz Results</h1>
    <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
    <p>Ah, we've got an infernal loremaster on our hands. You stand to learn more, but your knowledge of the Nine Hells is sound.</p>
    </div>
    <div class="user-input">
      <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
    </div>`;
  }
  else if (STORE.score === 5) {
    return `<div>
    <h1>Infernal Plane Quiz Results</h1>
    <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
    <p>Excellent work! Your knowledge of the Nine Hells is impressive indeed! Perhaps you have traversed the planes and visited the Nine Hells yourself...</p>
    </div>
    <div class="user-input">
      <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
    </div>`;
  }
}

// *******************
// Rendering functions
// *******************

function renderQuizOptions() {
  CATEGORIES.push(fetchCategories().trivia_categories);
  console.log(CATEGORIES);
}

function renderQuestionView() {
  // declaration of variable for answer view generation
  let questionAnswers = generateAnswerView();
  // inserting Question Template into the DOM
  $('.container').html(questionAnswers);
}

function renderAnswerFeedback() {
  // declaration of variable for feedback generation
  // insertion answer feedback into the DOM
  if (STORE.currentQuestion < (QUESTIONS.length - 1)) {
    let answerFeedback = generateAnswerFeedback();
    $('.container').html(answerFeedback);
  }
  else {
    let answerFeedback = generateFinalFeedback();
    $('.container').html(answerFeedback);
  }
}
function renderResultsView() {
  let results = generateResultsView();
  $('.container').html(results);
}

// **************
// Event handlers
// **************

function handleUserInputs() {
  // listener for begin button to trigger rendering of first question
  $('#quiz-start-button').on('click', event => {
    STORE = getInitialStore();
    renderQuizOptions();
    // renderQuestionView();
  });
  // listener for answer submit button
  $('.container').on('click', '#answer-submit-button', event => {
    event.preventDefault();
    // updates userAnswer in store to reflect user answer selection
    STORE.userAnswer = $('input[type=radio][name=answer]:checked').val();
    // Perform check to prevent user from not selecting any option
    if (!$('input[name=\'answer\']').is(':checked')) { 
      alert('Please select an answer from the list.');
    }
    // Perform check to determine if user answer is correct
    else if (STORE.userAnswer === QUESTIONS[STORE.currentQuestion].correctAnswer) {
      STORE.score++;
      renderAnswerFeedback();
    }

    else {
      renderAnswerFeedback();
    }
  });

  $('.container').on('click', '#next-question-button', event => {
    event.preventDefault();
    STORE.currentQuestion++;
    STORE.currentCounter++;
    renderQuestionView();
  });

  $('.container').on('click', '#final-question-button', event => {
    event.preventDefault();
    renderResultsView();
  });

  $('.container').on('click', '#reset-button', event => {
    location.reload(true);
  });
}

// ******************
// DOM ready function
// ******************

$(function main() {
  handleUserInputs();
});