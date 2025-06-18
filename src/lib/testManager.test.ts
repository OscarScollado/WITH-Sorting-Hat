import { describe, it, expect, beforeEach, test } from "vitest";
import TestManager from "./testManager";
import type { Answer, Scores } from "./types";

describe("Test Manager", () => {
    let testManager: TestManager;

    function populateScores(g: number, r: number, h: number, s: number): Scores {
        return { g, r, h, s };
    }

    function makeAnswer(scores: Scores, name: string = "Test"): Answer {
        return { title: name, scores };
    }

    beforeEach(() => {
        testManager = new TestManager("Test");
    });

    it("should initialize correctly", () => {
        expect(testManager.name).toBe("Test");
    });

    it("should pick the house with the highest points", () => {
        const scores = populateScores(0, 100, 0, 0);
        const answer = makeAnswer(scores);
        testManager.addQuestionScores(answer);
        testManager.updateScores("Test");

        expect(testManager.result).toBe("r");
    });

    test.each([
        { rawScores: [0, 0, 100, 100], result: "h", extra: "" },
        { rawScores: [0, 0, 0, 0], result: "g", extra: " (default scores)" }
    ])("should pick the first house with the highest points when in a tie$extra", ({ rawScores, result }) => {
        const [g, r, h, s] = rawScores;
        const scores = populateScores(g, r, h, s);
        const answer = makeAnswer(scores);
        testManager.addQuestionScores(answer);
        testManager.updateScores("Test");

        expect(testManager.result).toBe(result);
    });

    it("should add up scores from different questions", () => {
        const q1scores = populateScores(100, 50, 25, 25);
        const q1answer = makeAnswer(q1scores, "Test1");
        testManager.addQuestionScores(q1answer);
        testManager.updateScores("Test1");

        const q2scores = populateScores(25, 100, 100, 50);
        const q2answer = makeAnswer(q2scores, "Test2");
        testManager.addQuestionScores(q2answer);
        testManager.updateScores("Test2");

        expect(testManager.result).toBe("r");
    });

    it("should update the scores from the answers the user chooses", () => {
        const q1dawnScores = populateScores(100, 100, 0, 0);
        const q1dawnAnswer = makeAnswer(q1dawnScores, "Dawn");
        const q1duskScores = populateScores(0, 0, 100, 100);
        const q1duskAnswer = makeAnswer(q1duskScores, "Dusk");
        const q2moonScores = populateScores(0, 100, 0, 100);
        const q2moonAnswer = makeAnswer(q2moonScores, "Moon");
        const q2starsScores = populateScores(100, 0, 100, 0);
        const q2starsAnswer = makeAnswer(q2starsScores, "Stars");
        testManager.addQuestionScores(q1dawnAnswer);
        testManager.addQuestionScores(q1duskAnswer);
        testManager.addQuestionScores(q2moonAnswer);
        testManager.addQuestionScores(q2starsAnswer);
        testManager.updateScores("Dusk");
        testManager.updateScores("Moon");

        expect(testManager.result).toBe("s");
    });
});
