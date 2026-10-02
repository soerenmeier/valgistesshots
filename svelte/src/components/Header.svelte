<script>
	import { getGlobal, getSite } from 'crelte';

	const site = getSite();
	const header = getGlobal('header');
	let { entry } = $props();
</script>

<header class="header">
	<span class="corner left" aria-hidden="true"></span>
	<span class="corner right" aria-hidden="true"></span>

	<nav aria-label="Main navigation">
		<a class="home" href={$site.url.href}>Home</a>
		{#if entry?.typeHandle === 'topic' || entry?.typeHandle === 'topicWithText'}
			<h1 class="topic-title">{entry.title}</h1>
		{:else}
			<a
				class="brand"
				href={$site.url.href}
				aria-label={$site.name || undefined}
			>
				<img src="/assets/valgistesshots-logo.svg" alt="" />
			</a>
		{/if}
		{#if $header?.contactLink?.url}
			<a
				class="email"
				href={$header.contactLink.url}
				target={$header.contactLink.target || undefined}
				rel={$header.contactLink.target === '_blank'
					? 'noopener noreferrer'
					: undefined}
			>
				{$header.contactLink.label ||
					$header.contactLink.defaultLabel ||
					$header.contactLink.url}
			</a>
		{/if}
	</nav>
</header>

<style lang="scss">
	.header {
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		width: 100%;
		height: clamp(7rem, 13vw, 11rem);
		color: #fff;
		mix-blend-mode: difference;
	}

	.topic-title {
		justify-self: center;
		margin-top: -0.4rem;
		font-family: var(--font-serif);
		font-size: clamp(1.75rem, 3vw, 3rem);
		font-weight: 400;
		line-height: 1;
		text-align: center;
	}

	.corner {
		position: absolute;
		top: var(--corner-inset);
		width: var(--corner-size);
		height: var(--corner-size);
		border-top: 1px solid currentColor;
		pointer-events: none;
	}

	.left {
		left: var(--corner-inset);
		border-left: 1px solid currentColor;
	}

	.right {
		right: var(--corner-inset);
		border-right: 1px solid currentColor;
	}

	nav {
		position: relative;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: start;
		gap: 0.5rem;
		padding: calc(var(--frame-inset) + 1.5rem)
			calc(var(--frame-inset) + 1.5rem) 0;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.home {
		justify-self: start;
	}

	.brand {
		justify-self: center;
		margin-top: -0.4rem;
	}

	.brand img {
		width: clamp(10rem, 25vw, 19rem);
		filter: invert(1);
	}

	.email {
		justify-self: end;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.email::before {
		content: '';
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 50%;
		background: #32bab6;
	}

	nav a:hover,
	nav a:focus-visible {
		text-decoration: underline;
		text-underline-offset: 0.3em;
	}

	@media (max-width: 600px) {
		nav {
			align-items: center;
			padding-inline: calc(var(--frame-inset) + 0.75rem);
			font-size: 0.75rem;
		}

		.brand,
		.topic-title {
			margin-top: 0;
		}

		.brand img {
			width: clamp(6rem, 31vw, 9rem);
		}

		.topic-title {
			font-size: clamp(1.25rem, 5vw, 1.75rem);
		}
	}
</style>
