export interface User {
    id: number;
    username: string;
    password: string;
}

export interface Question {
    quiz_id: number;
    num: number;
    text: string;
    answer: number;
    penalty: number;
}

export interface PartQuestion {
    text: string;
    penalty: number;
}

export interface Quiz {
    id: number;
    intro: string;
}

export interface Answer {
    username: string;
    quiz_id: number;
    num: number;
    correct: boolean;
    answer: number;
    time: number;
}
