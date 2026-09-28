<script lang="ts">
	import Richtext, { hasChunks } from '../cke/Richtext.svelte';

	let { aboutCke }: { aboutCke?: { chunks?: any[] } | null } = $props();
</script>

{#if hasChunks(aboutCke)}
	<section class="about" id="about" aria-label="About">
		<div class="content">
			<Richtext chunks={aboutCke?.chunks ?? []} />
		</div>
	</section>
{/if}

<style lang="scss">
	.about {
		position: relative;
		min-height: 100vh;
		min-height: 100svh;
		padding: clamp(9rem, 16vh, 12rem) 1.5rem clamp(7rem, 12vh, 10rem);
		background: #f7f6f2;
		color: #171717;
	}

	.content {
		max-width: 52rem;
		margin-inline: auto;
	}

	.content :global(.rt .html h2) {
		font-family: var(--font-serif);
		font-size: clamp(3rem, 6vw, 5rem);
		font-weight: 400;
		line-height: 1.1;
	}

	.content :global(.rt .image) {
		margin-block: 0.75rem 2rem;
	}

	.content :global(.rt .image img) {
		width: 100%;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		filter: grayscale(1);
	}

	.content :global(.rt .html p) {
		line-height: 1.55;
	}

	@media (max-width: 600px) {
		.content :global(.rt .image img) {
			aspect-ratio: 4 / 3;
		}
	}
</style>
