<script>
	import Richtext, { hasChunks } from '@/components/cke/Richtext.svelte';

	let {
		title,
		sectIntroCke,
		children,
		switchSide = false,
		textAlign,
	} = $props();
	let alignment = $derived(
		['left', 'center', 'right'].includes(textAlign) ? textAlign : undefined,
	);
	let hasText = $derived(hasChunks(sectIntroCke));
	let hasCopy = $derived(!!title || hasText);
</script>

<section class="block" class:with-text={hasCopy} class:switch-side={switchSide}>
	<div class="media">
		{@render children()}
	</div>
	{#if hasCopy}
		<div class="text" style:text-align={alignment}>
			{#if title}
				<h2>{title}</h2>
			{/if}
			{#if hasText}
				<Richtext chunks={sectIntroCke.chunks} />
			{/if}
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
		width: 100%;
		max-width: 38rem;
		line-height: 1.55;
		font-size: clamp(0.875rem, 1.1vw, 1.0625rem);
	}

	h2 {
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		font-weight: 400;
		line-height: 1.15;
	}

	h2 + :global(.rt) {
		margin-top: 1rem;
	}

	@include tablet {
		.with-text {
			grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
		}

		.with-text.switch-side {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);

			.media {
				grid-column: 2;
				grid-row: 1;
			}

			.text {
				grid-column: 1;
				grid-row: 1;
				justify-self: end;
				text-align: right;
			}
		}
	}

	@media (max-width: 767px) {
		.block {
			width: auto;
			margin: 1.5rem var(--frame-inset);
		}
	}
</style>
