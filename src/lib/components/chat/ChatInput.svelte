<script lang="ts">
    import IconSend from "@lucide/svelte/icons/send-horizontal";
    interface ChatInputProps {
        inputValue: string,
        onSend: (value: string) => void,
        nameMode: boolean,
        quizEnded: boolean
    }

    const { inputValue, onSend, nameMode, quizEnded }: ChatInputProps = $props();
    let nameValue = $state<string>("");
</script>

<!--
@component
The place where the user will submit the selected answer.
-->
<div class="border-t-[1px] border-surface-200-800 p-4">
    <div class="input-group flex divide-surface-200-800 rounded-container">
        {#if !nameMode}
            <textarea
                class="bg-transparent lg-input grow ring-0 cursor-not-allowed resize-none"
                placeholder={!quizEnded ? "Please select an answer..." : ""}
                rows={3}
                readonly
            >{inputValue}</textarea>
        {:else}
            <textarea
                class="textarea grow resize-none ring-0"
                bind:value={nameValue}
                rows={1}
                onkeydown={e => {
                    if (e.key == "Enter") {
                        e.preventDefault();
                        onSend(nameValue);
                    }
                }}
            ></textarea>
        {/if}
        <button
            class="btn-lg border-none"
            disabled={!(nameMode && nameValue || !nameMode && inputValue)}
            onclick={() => onSend(nameMode ? nameValue : inputValue)}
        >
            <IconSend />
        </button>
    </div>
</div>