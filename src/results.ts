import {getAnswers, getQuestions, getUserAnswers} from "./db";


export async function countResult(quiz_id, answers, times) {
    const correctAnswers = await getAnswers(quiz_id);
    const questions = await getQuestions(quiz_id);
    let results = [];

    for(let i = 0; i < answers.length; i++) {
        if(answers[i] === correctAnswers[i]) {
            results.push([true, times[i], answers[i]]);
        }
        else {
            results.push([false, times[i] + questions[i].penalty, answers[i]]);
        }
    }
    return results;
}

export async function getReport(quiz_id, username) {
    let report = "";
    const correctAnswers = await getAnswers(quiz_id);
    const questions = await getQuestions(quiz_id);
    const userAnswers = await getUserAnswers(quiz_id, username);
    let sum = 0;
    let cntCorrect = 0;

    if(userAnswers.length === 0) {
        return "Nie rozwiązywałeś jeszcze tego quizu.";
    }

    for(let i = 0; i < questions.length; i++) {
        report += "Pytanie " + (i + 1) + ": ";
        report += "Udzielona odpowiedź : " + userAnswers[i].answer + " ";
        if(userAnswers[i].correct) {
            report += '<span class="correct"> poprawna </span>';
            cntCorrect++;
        }
        else {
            report += '<span class="incorrect"> niepoprawna </span>, prawidłowa : ' + correctAnswers[i];
            report += ', kara : ' + questions[i].penalty + "s";
            report += ", czas : " + userAnswers[i].time + '<br>';
        }
        sum += userAnswers[i].time;
    }

    report += "Łączny czas : " + sum + '<br>';
    report += "Poprawnych odpowiedzi : " + cntCorrect + '<br>';
    return report;
}

