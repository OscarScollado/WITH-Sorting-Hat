<script lang="ts">
    import { Switch } from "@skeletonlabs/skeleton-svelte";
    import IconMoon from "@lucide/svelte/icons/moon";
    import IconSun from "@lucide/svelte/icons/sun";
    interface LightSwitchProps {
        initialMode: boolean
    }

    const { initialMode }: LightSwitchProps = $props();
    let checked = $state<boolean>(initialMode);

    /**
     * Checked change handler.
     * @param event The event data.
     */
    const onCheckedChange = (event: { checked: boolean }) => {
        checked = event.checked;
        const mode = checked ? "dark" : "light";
        document.documentElement.setAttribute("data-mode", mode);
        localStorage.setItem("mode", mode);
    };

</script>


<!--
@component
The switch for switching light/dark mode.
-->
<Switch
    {checked}
    {onCheckedChange}
    controlActive="bg-surface-200 dark:invert"
    classes="w-fit md:scale-110"
>
    {#snippet inactiveChild()}<IconMoon size="14" />{/snippet}
    {#snippet activeChild()}<IconSun size="14" />{/snippet}
</Switch>