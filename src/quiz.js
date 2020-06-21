var curNum = 0;
var curTime = 0;
var lastTime = 0;
var interval;
function showQuestion(id) {
    var questionElement = document.getElementById("question");
    var answerElement = document.getElementById("answer");
    var footerElement = document.getElementById("footer");
    questionElement.innerHTML = questions[id].text;
    answerElement.value = answers[id];
    footerElement.innerHTML = "Pytanie : " + (curNum + 1) + " / " + maxNum + "<br>Kara za złą odpowiedź : " + questions[curNum].penalty + " sekund(y)";
}
function disableButtons(id) {
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    if (id === 0) {
        prevButton.disabled = true;
    }
    else {
        prevButton.disabled = false;
    }
    if (id === maxNum - 1) {
        nextButton.disabled = true;
    }
    else {
        nextButton.disabled = false;
    }
}
function actTime(id) {
    times[id] += (curTime - lastTime);
    lastTime = curTime;
}
function nextQuestion() {
    actTime(curNum);
    curNum++;
    showQuestion(curNum);
    disableButtons(curNum);
}
function prevQuestion() {
    actTime(curNum);
    curNum--;
    showQuestion(curNum);
    disableButtons(curNum);
}
function checkAnswers() {
    for (var i = 0; i < maxNum; i++) {
        if (answers[i] === "")
            return false;
    }
    return true;
}
function changeAnswer() {
    var answerElement = document.getElementById("answer");
    answers[curNum] = answerElement.value;
    var stopButton = document.getElementById("stop");
    if (checkAnswers())
        stopButton.disabled = false;
    else
        stopButton.disabled = true;
}
function changeTimer() {
    curTime += 0.1;
    curTime = Math.round(curTime * 10) / 10;
    var timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Minęło " + curTime + " sekund.";
}
function endQuiz() {
    actTime(curNum);
    clearInterval(interval);
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = '/results/' + quiz.id;
    var hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "answers";
    hiddenField.value = answers.toString();
    form.appendChild(hiddenField);
    for (var i = 0; i < times.length; i++) {
        times[i] = Math.round(times[i] * 10) / 10;
    }
    var hiddenField2 = document.createElement('input');
    hiddenField2.type = 'hidden';
    hiddenField2.name = "times";
    hiddenField2.value = times.toString();
    form.appendChild(hiddenField2);
    document.body.appendChild(form);
    form.submit();
}
function initQuiz() {
    curNum = 0;
    for (var i = 0; i < maxNum; i++) {
        answers[i] = "";
        times[i] = 0;
    }
    document.getElementById("quiz").style.display = 'inline';
    document.getElementById("start").style.display = 'none';
    showQuestion(0);
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    var stopButton = document.getElementById("stop");
    prevButton.disabled = true;
    stopButton.disabled = true;
    nextButton.disabled = false;
    curTime = 0;
    lastTime = 0;
    var timerElement = document.getElementById("timer");
    timerElement.innerHTML = "Minęło " + curTime + " sekund.";
    interval = setInterval(changeTimer, 100);
}
function everyLoad() {
    document.getElementById("quiz").style.display = 'none';
    var descriptionElement = document.getElementById("question");
    descriptionElement.innerHTML = "Liczba pytań : " + maxNum + ".<br>Kary czasowe : ";
    for (var i = 0; i < maxNum; i++) {
        descriptionElement.innerHTML += questions[i].penalty + " ";
    }
}
function loadWindow() {
    everyLoad();
    var answerElement = document.getElementById("answer");
    var prevButton = document.getElementById("prev");
    var nextButton = document.getElementById("next");
    var stopButton = document.getElementById("stop");
    answerElement.onchange = changeAnswer;
    prevButton.onclick = prevQuestion;
    nextButton.onclick = nextQuestion;
    stopButton.onclick = endQuiz;
    var introElement = document.getElementById("intro");
    introElement.innerHTML = quiz.intro;
    document.getElementById("start").onclick = initQuiz;
    document.getElementById("cancel").onclick = cancelQuiz;
}
function cancelQuiz() {
    clearInterval(interval);
    document.getElementById("start").style.display = 'inline';
    everyLoad();
}
document.addEventListener("DOMContentLoaded", loadWindow);
