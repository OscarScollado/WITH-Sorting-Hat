import questionsJson from "./data/sorting_hat.json";
import type { Question } from "./types";

/** The typed questions for the test. */
const questions = questionsJson satisfies Question[];

/** Complete names of the houses. */
const houseNames = {
    "g": "Gryffindor",
    "r": "Ravenclaw",
    "h": "Hufflepuff",
    "s": "Slytherin"
};

/** Background color of the final message depending on the house. */
const houseColors = {
    "g": "from-red-600 to-yellow-600",
    "r": "from-blue-600 to-bronze-600",
    "h": "from-yellow-500 to-black",
    "s": "from-green-600 to-silver"
};

export {
    questions,
    houseNames,
    houseColors
}