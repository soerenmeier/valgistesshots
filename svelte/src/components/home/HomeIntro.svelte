<script lang="ts">
	import Richtext, { hasChunks } from '../cke/Richtext.svelte';

	let {
		title,
		pageTitle,
		pageIntroCke,
		video,
	}: {
		title: string;
		pageTitle?: string | null;
		pageIntroCke?: { chunks?: any[] } | null;
		video?: { url?: string | null }[] | null;
	} = $props();
</script>

<section class="home-intro" aria-label="Introduction">
	{#if video?.[0]?.url}
		<video
			class="background-video"
			src={video[0].url}
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
			aria-hidden="true"
		></video>
	{/if}

	<div class="intro-content">
		{#if pageTitle && pageTitle !== title}
			<p class="eyebrow">{title}</p>
		{/if}
		<h1>{pageTitle || title}</h1>
		{#if hasChunks(pageIntroCke)}
			<Richtext chunks={pageIntroCke?.chunks ?? []} center />
		{/if}
	</div>
</section>

<style lang="scss">
	.home-intro {
		position: relative;
		display: flex;
		min-height: 100vh;
		min-height: 100svh;
		overflow: hidden;
		background: #222;
		color: #fff;
		font-family: var(--font-sans);
		text-align: center;
		isolation: isolate;
	}

	.home-intro::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(
			180deg,
			rgb(0 0 0 / 20%),
			rgb(0 0 0 / 12%) 40%,
			rgb(0 0 0 / 65%)
		);
	}

	.background-video {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.intro-content {
		position: relative;
		width: min(100%, 56rem);
		margin: auto auto 0;
		padding: 10rem clamp(2rem, 7vw, 5rem) clamp(7rem, 12vh, 10rem);
	}

	.eyebrow {
		margin-bottom: 0.75rem;
		font-size: 0.875rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	h1 {
		font-family: var(--font-serif);
		font-size: clamp(3rem, 9vw, 7rem);
		font-weight: 400;
		line-height: 1.05;
	}

	.intro-content :global(.rt) {
		margin-top: 1.5rem;
		font-size: clamp(1rem, 2vw, 1.25rem);
		line-height: 1.5;
	}
</style>
