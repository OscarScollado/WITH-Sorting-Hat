import type { Answer, Scores, House } from "$lib/types";

/**
 * Helper class that manages the scores and the name of the player.
 */
export default class TestManager {
    #name: string
    #scores: Scores
    #questionScores: { [answerTitle: string]: Scores }

    constructor(name: string) {
        this.#name = name;
        this.#scores = {
            "g": 0,
            "r": 0,
            "h": 0,
            "s": 0
        };
        this.#questionScores = {};
    }

    /**
     * Returns the user's name.
     */
    get name(): string {
        return this.#name;
    }

    /**
     * Returns the house with the most points.
     */
    get result(): House {
        let finalHouse: House = "g";
        let maxScore: number = -1;
        for (const [house, score] of Object.entries(this.#scores)) {
            if (score > maxScore) {
                finalHouse = house as House;
                maxScore = score;
            }
        }
        return finalHouse
    }

    /**
     * Stores the question's scores for later calculation.
     * @param answer The selected answer from the question.
     */
    addQuestionScores({ title, scores }: Answer) {
        this.#questionScores[title] = scores;
    }

    /**
     * Adds up the scores of that question for each house.
     * @param answer The title of the selected answer from the question.
     */
    updateScores(answer: string) {
        const answerScores: Scores = this.#questionScores[answer];
        for (const [house, score] of Object.entries(answerScores)) {
            this.#scores[house as House] += score;
        }
    }
}