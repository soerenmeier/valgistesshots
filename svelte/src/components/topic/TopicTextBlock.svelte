<script>
	import Richtext, { hasChunks } from '@/components/cke/Richtext.svelte';

	let { sectIntroCke, children } = $props();
</script>

<section class="block" class:with-text={hasChunks(sectIntroCke)}>
	<div class="media">
		{@render children()}
	</div>
	{#if hasChunks(sectIntroCke)}
		<div class="text">
			<Richtext chunks={sectIntroCke.chunks} />
		</div>
	{/if}
</section>

<style lang="scss">
	.block {
		display: grid;
		align-items: center;
		gap: clamp(2rem, 5vw, 5rem);
	}

	.media {
		min-width: 0;
	}

	.text {
		max-width: 38rem;
		line-height: 1.55;
	}

	@include desktop {
		.with-text {
			grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
		}
	}
</style>
