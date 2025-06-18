<script lang="ts">
    import { fly } from "svelte/transition";
    interface ChatMessageProps {
        content: string,
        isUser: boolean,
        onintroend: VoidFunction
    }

    const { content, isUser, onintroend }: ChatMessageProps = $props();
</script>


<!--
@component
A message of the chat.
-->
<div
    class={[
        "card p-4 rounded-4xl w-fit",
        isUser ?
            "preset-tonal-tertiary rounded-tr-none place-self-end" :
            "preset-tonal-secondary rounded-tl-none place-self-start"
    ]}
    in:fly={{
        x: isUser ? 30 : -30,
        y: -20,
        duration: 400
    }}
    {onintroend}
>
    <p>{content}</p>
</div>