<script lang="ts">
    import type { Attachment } from "svelte/attachments";
    import { fade } from "svelte/transition";
    interface ChatAnswersProps {
        answers: string[],
        onSelect: (selected: string) => void
    }

    const { answers, onSelect }: ChatAnswersProps = $props();
    /** The selected answer. */
    let selected = $state<string>("");
    // The buttons' contents won"t change, so no need for $state.
    /** Stores whether the answer is overflowing its container. */
    const overflows: Record<string, boolean> = {};

    /**
     * Sets the selected answer.
     * It also unsets the answer if the user deselected it.
     */
    function setSelected(selectedAnswer: string) {
        if (selectedAnswer === selected) {
            selected = "";
        }
        else {
            selected = selectedAnswer;
        }
        onSelect(selected);
    }

    /**
     * Mouse hover start handler.
     * @param e The event.
     */
    function handleMouseEnter(e: MouseEvent) {
        const target = e.target as HTMLButtonElement;
        if (target.textContent && overflows[target.textContent]) {
            target.classList.add("sm:h-[4em]");
            target.classList.add("!whitespace-normal");
        }
    }

    /**
     * Mouse hover end handler.
     * @param e The event.
     * @param targetSelected Whether the hovered answer was the one selected.
     */
    function handleMouseLeave(e: MouseEvent, targetSelected: boolean) {
        const target = e.target as HTMLButtonElement;
        // CSS can't interpolate between h-[value]/max-h-[value] and h-fit/max-h-fit
        //  nor transition when whitespace-[mode] changes, so I have to specify the height myself.
        if (!targetSelected) {
            target.classList.remove("sm:h-[4em]");
            target.classList.remove("!whitespace-normal");
        }
    }

    /** Registers the answers that overflow their own container. */
    const overflowRegistry: Attachment = (element) => {
        if (!element.textContent) {
            return;
        }

        const doesOverflow = element.scrollWidth > element.clientWidth;
        overflows[element.textContent] = doesOverflow;
    }
</script>


<!--
@component
The options of each question.
-->
<div class="flex flex-col gap-4 my-4">
    {#each answers as answer (answer)}
        <button
            {@attach overflowRegistry}
            in:fade={{ duration: 300 }}
            onmouseenter={e => handleMouseEnter(e)}
            onmouseleave={e => handleMouseLeave(e, selected === answer)}
            class={[
                "card py-4 px-6 border-2 rounded-2xl transition-allowed active:scale-[0.98]",
                "transition-all duration-200 overflow-hidden overflow-ellipsis box-content",
                "lg:text-sm sm:whitespace-nowrap sm:h-[2em] hover:shadow-lg",
                selected === answer
                    ? [
                        "preset-filled-primary border-primary-300 !whitespace-normal",
                        { "sm:h-[4em]": overflows[selected] }
                    ]
                    : [
                        "preset-tonal border-surface-200-800 hover:border-primary-200"
                    ]
            ]}
            onclick={() => setSelected(answer)}
        >
            <span>{answer}</span>
        </button>
    {/each}
</div>