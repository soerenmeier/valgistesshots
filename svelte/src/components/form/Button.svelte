<script module lang="ts">
	export type Style = 'primary' | 'secondary';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type {
		HTMLAnchorAttributes,
		HTMLButtonAttributes,
	} from 'svelte/elements';

	let {
		children,
		href = undefined,
		style = 'primary',
		...rest
	}: {
		children: Snippet;
		href?: string;
		style?: Style;
	} & (HTMLAnchorAttributes | HTMLButtonAttributes) = $props();
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	class="button style-{style}"
	{href}
	{...rest}
>
	{@render children()}
</svelte:element>

<style lang="scss">
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5625rem;
	}

	.style-primary {
		background-color: var(--accent, #333);
		color: var(--text-white, white);
		border: 1px solid var(--accent, #333);
		border-radius: 2rem;
	}

	.style-secondary {
		border-radius: 2rem;
		border: 1px solid var(--accent, #333);
		background-color: var(--bg-btn-secondary, transparent);
	}
</style>
