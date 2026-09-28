<script lang="ts">
	import { getSite } from 'crelte';
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

	const site = getSite();
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

	<div class="corners" aria-hidden="true">
		<span class="corner top-left"></span>
		<span class="corner top-right"></span>
		<span class="corner bottom-left"></span>
		<span class="corner bottom-right"></span>
	</div>

	<nav class="links" aria-label="Intro links">
		<a href={$site.url.href}>Home</a>
		<a href="mailto:hello@dunkel.cc">Email</a>
	</nav>

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
		--frame-inset: clamp(1.25rem, 4vw, 4rem);
		--corner-size: clamp(2.5rem, 7vw, 7rem);
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

	.corners {
		position: absolute;
		inset: var(--frame-inset);
		pointer-events: none;
	}

	.corner {
		position: absolute;
		width: var(--corner-size);
		height: var(--corner-size);
		border-color: rgb(255 255 255 / 70%);
		border-style: solid;
		border-width: 0;
	}

	.top-left {
		top: 0;
		left: 0;
		border-top-width: 1px;
		border-left-width: 1px;
	}

	.top-right {
		top: 0;
		right: 0;
		border-top-width: 1px;
		border-right-width: 1px;
	}

	.bottom-left {
		bottom: 0;
		left: 0;
		border-bottom-width: 1px;
		border-left-width: 1px;
	}

	.bottom-right {
		bottom: 0;
		right: 0;
		border-bottom-width: 1px;
		border-right-width: 1px;
	}

	.links {
		position: absolute;
		top: calc(var(--frame-inset) + 1.5rem);
		right: calc(var(--frame-inset) + 1.5rem);
		left: calc(var(--frame-inset) + 1.5rem);
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.links a:hover,
	.links a:focus-visible {
		text-decoration: underline;
		text-underline-offset: 0.3em;
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
