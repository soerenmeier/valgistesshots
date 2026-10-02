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
		width: 80%;
		margin: 4vw auto;
		font-family: var(--font-sans);
	}

	.media {
		min-width: 0;
	}

	.text {
		max-width: 38rem;
		line-height: 1.55;
		font-size: clamp(0.875rem, 1.1vw, 1.0625rem);
	}

	@include tablet {
		.with-text {
			grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
		}
	}

	@media (max-width: 767px) {
		.block {
			width: auto;
			margin: 1.5rem var(--frame-inset);
		}
	}
</style>
