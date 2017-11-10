'use strict';

// *********************************************************
// constants for path
// variables to hold pieces of overall query string

const BASE_URL = 'https://opentdb.com';
const MAIN_PATH_SEARCH = '/api.php?';
const RETRIEVE_TOKEN_PATH = '/api_token.php?command=request';
const RETRIEVE_CATEGORIES = '/api_category.php';

// **********************************************************

// Data store of token
let TOKEN = {};

// In-memory database of categories, fetched from API
let CATEGORIES = [];

// In-memory database of questions, answers, and correct answer
let DECORATEDQUESTIONS = [];
let QUESTIONS = [];
// *************************
// Create your initial store
// *************************
// ********************************
// & Function for resetting the STORE
// ********************************

const getInitialStore = function() {
  return {
    categorySelection: '',
    categorySelectionId: null,
    quizLengthSelection: null,
    // Current Question Index
    currentQuestion: 0,
    // Current Question counter
    currentCounter: 1,
    // User's answer choice(s)
    userAnswer: '',
    // Current view
    // Score? Anything else?
    questionNumber: 0,
    score: 0
  };
};

let STORE = getInitialStore();

// ************************
// Build URL functions
// ************************

function buildQueryUrl() {
  let query = BASE_URL + MAIN_PATH_SEARCH + 'amount=' + STORE.quizLengthSelection + '&category=' + STORE.categorySelectionId + '&type=multiple&token=' + TOKEN.token;
  console.log(query);
  fetchQuestions(query);
}

// ************************
// API Data Fetch Functions
// ************************

function fetchToken() {
  let tokenFetchURL = BASE_URL + RETRIEVE_TOKEN_PATH;
  $.getJSON(tokenFetchURL, function (token) {
    TOKEN = token;
    console.log(TOKEN);
    buildQueryUrl();
  });
}

function fetchQuestions(query) {
  $.getJSON(query, function (questions) {
    console.log('questions.results', questions.results);
    QUESTIONS = questions.results;
    return decorateQuestion(QUESTIONS);
  });
}

function fetchCategories() {
  let categoryFetchURL = BASE_URL + RETRIEVE_CATEGORIES;
  $.getJSON(categoryFetchURL, function (data) {
    CATEGORIES = data.trivia_categories;
    // let fetchedCategories = fetchCategories().trivia_categories;
    // CATEGORIES.push(fetchedCategories);
    renderQuizOptions();
    console.log(CATEGORIES);
  });
}

// ***************************
// Decorate Response Functions
// ***************************

function decorateQuestion(QUESTIONS) {
  DECORATEDQUESTIONS = QUESTIONS.map(function(questionObject) {
    return {
      question: questionObject.question,
      answers: [(questionObject.correct_answer + ',' + questionObject.incorrect_answers).split(',')],
      correctAnswer: questionObject.correct_answer
    };
  });
  renderQuestionView();
}

// *******************
// Template generators
// *******************

function generateQuizOptionsView() {
  return `
    <div>
      <h1>Select your Trivia Quiz options!</h1>
      <form>
        <h3>Choose quiz category</h3>
        <select name="categories" id= "quiz-category-options" class= "quiz-category-options">
        </select>
        <h3>Choose number of questions</h3>
        <div class="quiz-length">
          <input id="quiz-length-input" type"=number">
        </div>
        <p>please select a number between 1 - 50</p>
        <div class="user-input">
          <button name= "submit-button" id= "quiz-begin-button" class= "input-button" type= "submit" >Begin quiz!</button>
        </div>
      </form>
    </div>
  `;
}

function generateQuizCategoryOptions(category) {
  return `
  <option value="${category.name}">${category.name}</option>
  `;
}

function generateAnswerView() {
  let questionIndex = STORE.currentQuestion;
  let answers = DECORATEDQUESTIONS[questionIndex].answers[0];

  
  return `<div>
      <h1>Trivia Quiz</h1>
      <div class= 'questions-answered'>
          <p>Question ${STORE.currentCounter}/${STORE.quizLengthSelection}</p>
      </div>
      <form>
          <h3>${DECORATEDQUESTIONS[STORE.currentQuestion].question}</h3>
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
          </div>
          <div class="user-input">
              <button name= "submit-button" id= "answer-submit-button" class= "input-button" type= "submit" >Submit Answer</button>
          </div>
          <div class= "current-score">
              <p>Current score: ${STORE.score}/${STORE.quizLengthSelection}</p>
          </div>
      </form>
    </div>`
  ;
}

function generateAnswerFeedback() {
  // conditionals for feedback specific to whether user answer is correct
  if (STORE.userAnswer === DECORATEDQUESTIONS[STORE.currentQuestion].correctAnswer) {
    return `<div>
    <h1>Trivia Quiz</h1>
    <div class= 'questions-answered'>
      <p>Question ${STORE.currentCounter}/${STORE.quizLengthSelection}</p>
    </div>
    <h3>Your answer is correct!</h3>
    <div class= 'user-answer'>Your answer: ${STORE.userAnswer}
    </div>
    <div class= 'correct-answer'>Correct answer: ${DECORATEDQUESTIONS[STORE.currentQuestion].correctAnswer}
    </div>
    <div class="user-input">
    <button name= "submit-button" id= "next-question-button" class= "input-button" type= "submit" >Next question</button>
    </div>
    <div class= "current-score">
      <p>Current score: ${STORE.score}/${STORE.quizLengthSelection}</p>
    </div>
    </div>`;
  }

  else {
    return `<div>
    <h1>Trivia Quiz</h1>
    <div class= 'questions-answered'>
      <p>Question ${STORE.currentCounter}/${STORE.quizLengthSelection}</p>
    </div>
    <h3>Your answer is incorrect!</h3>
    <div class= 'user-answer'>Your answer: ${STORE.userAnswer}
    </div>
    <div class= 'correct-answer'>Correct answer: ${DECORATEDQUESTIONS[STORE.currentQuestion].correctAnswer}
    </div>
    <div class="user-input">
    <button name= "submit-button" id= "next-question-button" class= "input-button" type= "submit" >Next question</button>
    </div>
    <div class= "current-score">
      <p>Current score: ${STORE.score}/${STORE.quizLengthSelection}</p>
    </div>
    </div>`;
  }
}

function generateFinalFeedback() {
  if (STORE.userAnswer === DECORATEDQUESTIONS[STORE.currentQuestion].correctAnswer) {
    return `<div>
    <h1>Trivia Quiz</h1>
    <div class= 'questions-answered'>
      <p>Question ${STORE.currentCounter}/${STORE.quizLengthSelection}</p>
    </div>
    <h3>Your answer is correct!</h3>
    <div class= 'user-answer'>Your answer: ${STORE.userAnswer}
    </div>
    <div class= 'correct-answer'>Correct answer: ${DECORATEDQUESTIONS[STORE.currentQuestion].correctAnswer}
    </div>
    <div class="user-input">
    <button name= "submit-button" id= "final-question-button" class= "input-button" type= "submit" >See your results!</button>
    </div>
    <div class= "current-score">
      <p>Current score: ${STORE.score}/${STORE.quizLengthSelection}</p>
    </div>
    </div>`;
  }

  else {
    return `<div>
    <h1>Trivia Quiz</h1>
    <div class= 'questions-answered'>
      <p>Question ${STORE.currentCounter}/${STORE.quizLengthSelection}</p>
    </div>
    <h3>Your answer is incorrect!</h3>
    <div class= 'user-answer'>Your answer: ${STORE.userAnswer}
    </div>
    <div class= 'correct-answer'>Correct answer: ${DECORATEDQUESTIONS[STORE.currentQuestion].correctAnswer}
    </div>
    <div class="user-input">
    <button name= "submit-button" id= "final-question-button" class= "input-button" type= "submit" >See your results!</button>
    </div>
    <div class= "current-score">
      <p>Current score: ${STORE.score}/${STORE.quizLengthSelection}</p>
    </div>
    </div>`;
  }
}

function generateResultsView() {
  return `<div>
    <h1>Trivia Quiz</h1>
    <h3>You answered ${STORE.score} out of ${STORE.quizLengthSelection} questions correctly</h3>
    <p>Click below to take another quiz!</p>
    <div class="user-input">
      <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
    </div>`;
  // if (STORE.score === 0) {
  //   return `<div>
  //   <h1>Infernal Plane Quiz Results</h1>
  //   <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
  //   <p>Pitiful! You know nothing of archdevils, fiends, and their ilk! You would surely perish in the Nine Hells!</p>
  //   </div>
  //   <div class="user-input">
  //     <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
  //   </div>`;
  // }
  // else if (STORE.score === 1) {
  //   return `<div>
  //   <h1>Infernal Plane Quiz Results</h1>
  //   <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
  //   <p>Wow. You basically know nothing about the Nine Hells. That's probably a good thing.</p>
  //   </div>
  //   <div class="user-input">
  //     <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
  //   </div>`;
  // }
  // else if (STORE.score === 2) {
  //   return `<div>
  //   <h1>Infernal Plane Quiz Results</h1>
  //   <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
  //   <p>Time to hit the tomes! You don't know very much about the Nine Hells. Study up, consult the infernal Sages, and try again.</p>
  //   </div>
  //   <div class="user-input">
  //     <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
  //   </div>`;    
  // }
  // else if (STORE.score === 3) {
  //   return `<div>
  //   <h1>Infernal Plane Quiz Results</h1>
  //   <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
  //   <p>So you know a bit about the Nine Hells. You're a middling scholar of fiendish lore. Congratulations.</p>
  //   </div>
  //   <div class="user-input">
  //     <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
  //   </div>`;
  // }
  // else if (STORE.score === 4) {
  //   return `<div>
  //   <h1>Infernal Plane Quiz Results</h1>
  //   <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
  //   <p>Ah, we've got an infernal loremaster on our hands. You stand to learn more, but your knowledge of the Nine Hells is sound.</p>
  //   </div>
  //   <div class="user-input">
  //     <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
  //   </div>`;
  // }
  // else if (STORE.score === 5) {
  //   return `<div>
  //   <h1>Infernal Plane Quiz Results</h1>
  //   <h3>You answered ${STORE.score} out of 5 questions correctly</h3>
  //   <p>Excellent work! Your knowledge of the Nine Hells is impressive indeed! Perhaps you have traversed the planes and visited the Nine Hells yourself...</p>
  //   </div>
  //   <div class="user-input">
  //     <button name= "submit-button" id= "reset-button" class= "input-button" type= "submit" >Take quiz again</button>
  //   </div>`;
  // }
}

// *******************
// Rendering functions
// *******************

function renderQuizOptions() {
  let quizOptionsView = generateQuizOptionsView();
  let quizCategoryOptions = CATEGORIES.map(function(category) {
    return generateQuizCategoryOptions(category);
  }).join('');
  // $('.container').html(quizOptionsView);
  $('.container').html(quizOptionsView);
  $('.quiz-category-options').html(quizCategoryOptions);
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
  if (STORE.currentCounter < STORE.quizLengthSelection) {
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
  // listener for start page button to trigger rendering of question options view
  $('#good-luck-button').on('click', event => {
    event.preventDefault();
    STORE = getInitialStore();
    fetchCategories();
    // renderQuizOptions();
  });

  // listener for quiz begin button
  $('.container').on('click', '#quiz-begin-button', event => {
    event.preventDefault();
    STORE.categorySelection = $(event.currentTarget).closest('form').find('.quiz-category-options').val();
    for (let i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].name === STORE.categorySelection) {
        STORE.categorySelectionId = CATEGORIES[i].id;
      }
    }
    STORE.quizLengthSelection = $(event.currentTarget).closest('form').find('#quiz-length-input').val();
    if (STORE.quizLengthSelection > 0 && STORE.quizLengthSelection <= 50) {
      fetchToken();
    }
    else {
      throw new RangeError('Quiz length must be between 0 and 50');
    }
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
    else if (STORE.userAnswer === DECORATEDQUESTIONS[STORE.currentQuestion].correctAnswer) {
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
    event.preventDefault();
    // location.reload(true);
    event.preventDefault();
    QUESTIONS = [],
    DECORATEDQUESTIONS = [],
    STORE = getInitialStore();
    renderQuizOptions();
  });
}

// ******************
// DOM ready function
// ******************

$(function main() {
  handleUserInputs();
});