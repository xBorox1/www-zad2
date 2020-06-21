var jsonString = "{\n\t\"intro\": \"Liczy\u0107 ka\u017Cdy mo\u017Ce.\",\n\t\"questions\": [\n\t\t{ \"text\": \"1 + 2 = ?\", \"answer\":3, \"penalty\":8 },\n\t\t{ \"text\": \"8 + 4 = ?\", \"answer\":12, \"penalty\":10 },\n\t\t{ \"text\": \"7 - 2 = ?\", \"answer\":5, \"penalty\":7 },\n\t\t{ \"text\": \"21 * 37 = ?\", \"answer\":777, \"penalty\":5 }\n\t]\n}";
var quiz = JSON.parse(jsonString);
var curNum = 0;
var maxNum = quiz.questions.length;
var answers = new Array(maxNum);
var times = new Array(maxNum);
var curTime = 0;
var lastTime = 0;
var interval;
function showQuestion(id) {
    var questionElement = document.getElementById("question");
    var answerElement = document.getElementById("answer");
    var footerElement = document.getElementById("footer");
    questionElement.innerHTML = quiz.questions[id].text;
    answerElement.value = answers[id];
    footerElement.innerHTML = "Pytanie : " + (curNum + 1) + " / " + maxNum + "<br>Kara za złą odpowiedź : " + quiz.questions[curNum].penalty + " sekund(y)";
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
function getResult(id) {
    var report = (id + 1) + " : udzielona odpowiedź : " + answers[id];
    ans = Number(answers[id]);
    if (ans === quiz.questions[id].answer) {
        report += '<span class="correct"> poprawna </span>';
    }
    else {
        report += '<span class="incorrect"> niepoprawna </span>, prawidłowa : ' + quiz.questions[id].answer;
        report += ', kara : ' + quiz.questions[id].penalty + "s";
        times[id] += quiz.questions[id].penalty;
    }
    times[id] = Math.round(times[id] * 10) / 10;
    report += ", czas : " + times[id];
    report += "s.<br>";
    return report;
}
function endQuiz() {
    actTime(curNum);
    clearInterval(interval);
    document.getElementById("quiz").style.display = 'none';
    document.getElementById("chbox").checked = false;
    var report = "Wyniki : <br>";
    for (var i = 0; i < maxNum; i++) {
        report += getResult(i);
    }
    result = 0;
    for (var i = 0; i < maxNum; i++)
        result += times[i];
    result = Math.round(10 * result) / 10;
    report += "Wynik końcowy : " + result + "s.";
    document.getElementById("question").innerHTML = report;
    document.getElementById("save").style.display = 'inline';
    document.getElementById("stats").style.display = 'inline';
}
function initQuiz() {
    curNum = 0;
    for (var i = 0; i < maxNum; i++) {
        answers[i] = "";
        times[i] = 0;
    }
    document.getElementById("quiz").style.display = 'inline';
    document.getElementById("start").style.display = 'none';
    document.getElementById("storage").style.display = 'none';
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
function getResultFromString(str) {
    var i = 0;
    while (str[i] !== 's')
        i++;
    return Number(str.substring(0, i));
}
function everyLoad() {
    document.getElementById("quiz").style.display = 'none';
    document.getElementById("stats").style.display = 'none';
    document.getElementById("storage").style.display = 'inline';
    var descriptionElement = document.getElementById("question");
    descriptionElement.innerHTML = "Liczba pytań : " + maxNum + ".<br>Kary czasowe : ";
    for (var i = 0; i < maxNum; i++) {
        descriptionElement.innerHTML += quiz.questions[i].penalty + " ";
    }
    var results = new Array();
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem("res" + i) === null)
            break;
        results[i] = [getResultFromString(localStorage.getItem("res" + i)), "res" + i];
    }
    results = results.sort(function (x, y) { return x[0] - y[0]; });
    var listElement = document.getElementById("storage-list");
    listElement.innerHTML = "";
    for (var i = 0; i < Math.min(results.length, 5); i++) {
        listElement.innerHTML += "<li> " + localStorage[results[i][1]] + "</li>";
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
    document.getElementById("save").onclick = saveResult;
}
function cancelQuiz() {
    clearInterval(interval);
    document.getElementById("start").style.display = 'inline';
    everyLoad();
}
function saveResult() {
    document.getElementById("start").style.display = 'inline';
    var saved = String(result) + "s";
    if (document.getElementById("chbox").checked) {
        saved += " : ";
        for (var i = 0; i < maxNum; i++) {
            saved += String((i + 1) + " - " + String(times[i]) + "s, ");
        }
    }
    var ind = 0;
    while (localStorage.getItem("res" + ind) !== null)
        ind++;
    localStorage.setItem("res" + ind, saved);
    everyLoad();
}
document.addEventListener("DOMContentLoaded", loadWindow);
