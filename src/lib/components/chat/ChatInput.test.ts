import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/svelte";
import ChatInput from "./ChatInput.svelte";

describe("Chat Input", () => {
    it("should hide its placeholder when the quiz ends", async () => {
        const { rerender } = render(ChatInput, {
            props: {
                inputValue: "Test",
                onSend: () => {},
                nameMode: false,
                quizEnded: false
            }
        });
        let textarea = screen.queryByPlaceholderText(
            "Please select an answer...",
            { exact: true }
        );
        expect(textarea).toBeInTheDocument();

        await rerender({ quizEnded: true });        
        textarea = screen.queryByPlaceholderText(
            "Please select an answer...",
            { exact: true }
        );
        expect(textarea).toBeNull();
    });

    it("should be readonly when not in name mode", () => {
        render(ChatInput, {
            props: {
                inputValue: "Test",
                onSend: () => {},
                nameMode: false,
                quizEnded: false
            }
        });
        const textarea = screen.getByRole("textbox")
        expect(textarea).toHaveAttribute("readonly");
    });

    it("should have the button disabled when there is no value", async () => {
        const { rerender } = render(ChatInput, {
            props: {
                inputValue: "",
                onSend: () => {},
                nameMode: false,
                quizEnded: false
            }
        });
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();

        await rerender({
            inputValue: "Test",
            nameMode: true
        })
        expect(button).toBeDisabled();
    });

    it("should return exactly inputValue's value", async () => {
        const mockOnSend = vi.fn();
        render(ChatInput, {
            props: {
                inputValue: "Test",
                onSend: mockOnSend,
                nameMode: false,
                quizEnded: false
            }
        });
        const button = screen.getByRole("button");
        await fireEvent.click(button);
        expect(mockOnSend).toHaveBeenCalledWith("Test");
    });

    it("should return whatever the user put in the textarea in name mode", async () => {
        const mockOnSend = vi.fn();
        render(ChatInput, {
            props: {
                inputValue: "Test",
                onSend: mockOnSend,
                nameMode: true,
                quizEnded: false
            }
        });
        const textarea = screen.getByRole("textbox");
        await fireEvent.input(textarea, {
            target: { value: "Name" }
        });
        const button = screen.getByRole("button");
        await fireEvent.click(button);
        expect(mockOnSend).toHaveBeenCalledWith("Name");
    });
});