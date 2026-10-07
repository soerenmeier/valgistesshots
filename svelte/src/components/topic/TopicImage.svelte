<script lang="ts">
	import { getContext } from 'svelte';
	import { topicPhotoMotion } from '@/lib/topicPhotoMotion';
	import {
		topicLightboxContext,
		type TopicLightboxContext,
	} from './lightboxContext';

	const lightbox = getContext<TopicLightboxContext | undefined>(
		topicLightboxContext,
	);

	type Image = {
		w800?: string | null;
		w1920?: string | null;
		width?: number | null;
		height?: number | null;
		alt?: string | null;
		title?: string | null;
	};
	let {
		image,
		sizes = '100vw',
		noParallax = false,
	}: { image: Image; sizes?: string; noParallax?: boolean } = $props();
</script>

<figure
	class="photo"
	class:no-parallax={noParallax}
	use:topicPhotoMotion={noParallax}
>
	{#snippet frame()}
		<div class="frame">
			<img
				src={image.w1920 || image.w800 || undefined}
				srcset={image.w800 && image.w1920
					? `${image.w800} 800w, ${image.w1920} 1920w`
					: undefined}
				{sizes}
				width={image.width ?? undefined}
				height={image.height ?? undefined}
				alt={image.alt ?? image.title ?? ''}
				loading="lazy"
				decoding="async"
			/>
		</div>
	{/snippet}
	{#if lightbox && (image.w1920 || image.w800)}
		<button
			class="open-lightbox"
			use:lightbox.register={image}
			aria-label="Enlarge image{image.alt || image.title
				? `: ${image.alt || image.title}`
				: ''}"
			aria-haspopup="dialog"
			onclick={event => lightbox.open(event.currentTarget)}
		>
			{@render frame()}
		</button>
	{:else}
		{@render frame()}
	{/if}
</figure>

<style>
	.photo {
		width: 100%;
	}
	.open-lightbox {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		text-align: inherit;
		cursor: zoom-in;
	}

	.open-lightbox:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 4px;
	}

	.frame {
		overflow: hidden;
		background: #d6d5d0;
	}
	img {
		display: block;
		width: 100%;
		height: auto;
	}

	.photo:global(.reveal) {
		opacity: 0;
		transform: translateY(2rem);
		transition:
			opacity 1s cubic-bezier(0.2, 0.7, 0.2, 1),
			transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.photo:global(.reveal.in) {
		opacity: 1;
		transform: none;
	}
	.photo:global(.reveal):not(.no-parallax) img {
		transform: translateY(var(--iy, 0px)) scale(1.22);
		will-change: transform;
	}

	@media (prefers-reduced-motion: reduce) {
		.photo:global(.reveal) {
			opacity: 1;
			transform: none;
			transition: none;
		}
		.photo:global(.reveal) img {
			transform: none;
			will-change: auto;
		}
	}
</style>
