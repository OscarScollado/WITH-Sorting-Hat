<script lang="ts">
	import "../app.css";
    import LightSwitch from "$lib/components/LightSwitch.svelte";
	
	let { children, data } = $props();
</script>

<!--
Styles and layout. (main + aside).
These viewport units aren't set willy-nilly.
-->
<aside class="absolute bottom-[2vh] lg:bottom-auto">
    <LightSwitch {...data}/>
</aside>
<main class="w-full h-full flex flex-col justify-center items-center mb-[40vw]">
    {@render children()}
</main>