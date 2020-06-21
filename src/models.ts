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

export interface Quiz {
    id: number;
    intro: string;
}
