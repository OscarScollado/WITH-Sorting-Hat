type House = "g" | "r" | "h" | "s";

type Scores = {
    [H in House]: number
};

interface Answer {
    title: string,
    scores: Scores
}

/** Each question from the test. */
interface Question {
    title: string,
    answers: Answer[]
}

/** Data from each message. */
interface Message {
    isUser: boolean;
    content: string;
}

export {
    type House,
    type Scores,
    type Answer,
    type Question,
    type Message
}