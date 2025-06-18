<script lang="ts">
    import { houseColors, houseNames } from "$lib";
    import type { House } from "$lib/types";
    import { elasticOut } from "svelte/easing";
    import { fly, scale } from "svelte/transition";
    interface SpecialMessageProps {
        finalHouse: House
    }

    const { finalHouse }: SpecialMessageProps = $props();
    const content = `Welcome to ${houseNames[finalHouse]}!`;
</script>


<!--
@component
The last message.
-->
<div
    class={[
        "card p-6 rounded-4xl w-fit bg-gradient-to-br",
        houseColors[finalHouse],
        "text-white rounded-tl-none shadow-lg"
    ]}
    in:fly={{
        x: -30,
        y: -20, 
        duration: 600,
        delay: 200 
    }}
>
    <div
        in:scale={{ 
            duration: 800,
            start: 0.5,
            easing: elasticOut
        }}
    >
        <p class="text-lg font-bold">
            {content}
        </p>
    </div>
</div>