import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/svelte";
import ChatAnswers from "./ChatAnswers.svelte";

describe("Chat Answers", () => {
    it("should emit the value of the selected answer", async () => {
        const mockOnSelect = vi.fn();

        render(ChatAnswers, {
            props: {
                answers: ["A", "B"],
                onSelect: mockOnSelect
            }
        });

        const AButton = screen.getByText("A", { exact: true });
        const BButton = screen.getByText("B", { exact: true });

        await fireEvent.click(AButton);
        expect(mockOnSelect).toHaveBeenCalledWith("A");

        await fireEvent.click(BButton);
        expect(mockOnSelect).toHaveBeenCalledWith("B");
        
        await fireEvent.click(BButton);
        await fireEvent.click(AButton);
        await fireEvent.click(AButton);
        await fireEvent.click(BButton);
        await fireEvent.click(BButton);
        await fireEvent.click(BButton);
        expect(mockOnSelect).toHaveBeenCalledWith("B");
    });

    it("should emit an empty string when an option is deselected", async () => {
        const mockOnSelect = vi.fn();

        render(ChatAnswers, {
            props: {
                answers: ["A", "B"],
                onSelect: mockOnSelect
            }
        });

        expect(mockOnSelect).not.toHaveBeenCalled();

        const AButton = screen.getByText("A", { exact: true });
        await fireEvent.click(AButton);
        await fireEvent.click(AButton);

        expect(mockOnSelect).toHaveBeenCalledWith("");
    });

    it("should highlight the button the user clicks", async () => {
        render(ChatAnswers, {
            props: {
                answers: ["A", "B"],
                onSelect: () => {}
            }
        });

        const AButton = screen.getByText("A", { exact: true }).parentElement!;
        expect(AButton).toHaveClass("preset-tonal");
        await fireEvent.click(AButton);
        expect(AButton).toHaveClass("preset-filled-primary");
    });

    it("should wrap whitespace when the answer has been hovered and/or clicked", async () => {
        Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
            get() { return 300; }
        });
        Object.defineProperty(HTMLElement.prototype, "clientWidth", {
            get() { return 200; }
        });
        render(ChatAnswers, {
            props: {
                answers: ["A", "B"],
                onSelect: () => {}
            }
        });

        const AButton = screen.getByText("A", { exact: true }).parentElement!;
        await fireEvent.mouseEnter(AButton);
        expect(AButton).toHaveClass("!whitespace-normal");
        await fireEvent.click(AButton);
        expect(AButton).toHaveClass("!whitespace-normal");
        await fireEvent.mouseLeave(AButton);
        expect(AButton).toHaveClass("!whitespace-normal");

        const BButton = screen.getByText("B", { exact: true }).parentElement!;
        await fireEvent.mouseEnter(BButton);
        expect(AButton).toHaveClass("!whitespace-normal");
        expect(BButton).toHaveClass("!whitespace-normal");
        await fireEvent.click(BButton);
        expect(AButton).not.toHaveClass("!whitespace-normal");
        expect(BButton).toHaveClass("!whitespace-normal");
        await fireEvent.mouseLeave(BButton);
        expect(AButton).not.toHaveClass("!whitespace-normal");
        expect(BButton).toHaveClass("!whitespace-normal");

        await fireEvent.mouseEnter(BButton);
        expect(BButton).toHaveClass("!whitespace-normal");
        await fireEvent.click(BButton);
        expect(BButton).not.toHaveClass("!whitespace-normal");
        await fireEvent.mouseLeave(BButton);
        expect(BButton).not.toHaveClass("!whitespace-normal");
    });


    it("should have the buttons remain the same when just hovered over them", async () => {
        render(ChatAnswers, {
            props: {
                answers: ["A", "B", "C", "D"],
                onSelect: () => {}
            }
        });

        const AButton = screen.getByText("A", { exact: true });
        const BButton = screen.getByText("B", { exact: true });
        const CButton = screen.getByText("C", { exact: true });
        const DButton = screen.getByText("D", { exact: true });

        expect(AButton).not.toHaveClass("!whitespace-normal");
        expect(BButton).not.toHaveClass("!whitespace-normal");
        expect(CButton).not.toHaveClass("!whitespace-normal");
        expect(DButton).not.toHaveClass("!whitespace-normal");

        await fireEvent.mouseEnter(AButton);
        await fireEvent.mouseLeave(AButton);
        await fireEvent.mouseEnter(BButton);
        await fireEvent.mouseLeave(BButton);
        await fireEvent.mouseEnter(CButton);
        await fireEvent.mouseLeave(CButton);
        await fireEvent.mouseEnter(DButton);
        await fireEvent.mouseLeave(DButton);

        expect(AButton).not.toHaveClass("!whitespace-normal");
        expect(BButton).not.toHaveClass("!whitespace-normal");
        expect(CButton).not.toHaveClass("!whitespace-normal");
        expect(DButton).not.toHaveClass("!whitespace-normal");
    });
});