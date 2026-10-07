<script lang="ts">
	import Richtext, { hasChunks } from '../cke/Richtext.svelte';
	import Image from '../cke/Image.svelte';

	let {
		aboutTitle,
		aboutImage,
		aboutCke,
	}: {
		aboutTitle?: string | null;
		aboutImage?:
			| {
					url: string;
					alt?: string | null;
					width?: number | null;
					height?: number | null;
			  }[]
			| null;
		aboutCke?: { chunks?: any[] } | null;
	} = $props();

	let image = $derived(aboutImage?.[0]);
</script>

{#if aboutTitle?.trim() || image?.url || hasChunks(aboutCke)}
	<section class="about" id="about" aria-label="About">
		<div class="content">
			{#if aboutTitle?.trim() || image?.url}
				<div class="intro">
					{#if aboutTitle?.trim()}
						<h2>{aboutTitle}</h2>
					{/if}
					{#if image?.url}
						<Image {image} />
					{/if}
				</div>
			{/if}
			{#if hasChunks(aboutCke)}
				<div class="text">
					<Richtext chunks={aboutCke?.chunks ?? []} />
				</div>
			{/if}
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

	h2,
	.content :global(.rt .html h2) {
		font-family: var(--font-serif);
		font-size: clamp(3rem, 6vw, 5rem);
		font-weight: 400;
		line-height: 1.1;
	}

	.content :global(.image) {
		margin-block: 0.75rem 2rem;
	}

	.content :global(.image img) {
		width: 100%;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		filter: grayscale(1);
	}

	.content :global(.rt .html p) {
		line-height: 1.55;
	}

	@include tablet {
		.about {
			display: flex;
			flex-direction: column;
			padding-block: clamp(6rem, 12vh, 9rem);
		}

		.content {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: clamp(2rem, 6vw, 6rem);
			width: 100%;
			max-width: 80rem;
			margin-block: auto;
			flex-shrink: 0;
			align-items: start;
		}

		.intro :global(.image img) {
			aspect-ratio: 5 / 3;
		}

		.text {
			grid-column: 2;
			padding-top: clamp(4rem, 6.5vw, 6.5rem);
		}
	}

	@include desktop {
		.about {
			width: 100vw;
			height: 100svh;
			min-height: 0;
			flex: 0 0 100vw;
			overflow-x: hidden;
			overflow-y: auto;
		}
	}

	@media (max-width: 600px) {
		.content :global(.image img) {
			aspect-ratio: 4 / 3;
		}
	}
</style>
