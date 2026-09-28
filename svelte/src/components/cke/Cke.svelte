<script lang="ts">
	import type { Style } from '../form/Button.svelte';
	import Buttons from './Buttons.svelte';
	import Image from './Image.svelte';

	let { chunks, btnStyle }: { chunks: any[]; btnStyle?: Style } = $props();
</script>

{#each chunks as chunk}
	{#if chunk.html}
		<div class="html">{@html chunk.html}</div>
	{:else if chunk.image?.[0]?.url}
		<Image image={chunk.image[0]} />
	{:else if chunk.btns}
		<Buttons {...chunk} style={btnStyle} />
	{/if}
{/each}
