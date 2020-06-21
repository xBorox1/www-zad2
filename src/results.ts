import {getAnswers, getQuestions, getUserAnswers, getBest} from "./db";


export async function countResult(quiz_id, answers, times) {
    const correctAnswers = await getAnswers(quiz_id);
    const questions = await getQuestions(quiz_id);
    let results = [];

    for(let i = 0; i < answers.length; i++) {
        times[i] = Number(times[i]);
        answers[i] = Number(answers[i]);
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
        }
        report += ", czas : " + userAnswers[i].time + '<br>';
        sum += userAnswers[i].time;
    }

    sum = Math.round(sum * 10) / 10;

    report += "Łączny czas : " + sum + '<br>';
    report += "Poprawnych odpowiedzi : " + cntCorrect + '<br>';
    return report;
}

export async function getBestResults(quiz_id) {
    const best = [];
    const bestUsers = await getBest(quiz_id);
    for(const user of bestUsers) {
        user[1] = Math.round(user[1] * 10) / 10;
        const userAnswers = await getUserAnswers(quiz_id, user[0]);
        best.push([user[0], user[1], userAnswers]);
    }
    return best;
}

export async function isSolved(quiz_id, username) {
    const userAnswers = await getUserAnswers(quiz_id, username);
    return userAnswers.length != 0;
}


