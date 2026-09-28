<script>
	import { getSite } from 'crelte';

	const site = getSite();
</script>

<header class="header">
	<span class="corner left" aria-hidden="true"></span>
	<span class="corner right" aria-hidden="true"></span>

	<nav aria-label="Main navigation">
		<a class="home" href={$site.url.href}>Home</a>
		<a
			class="brand"
			href={$site.url.href}
			aria-label={$site.name ?? 'Home'}
		>
			<img src="/assets/valgistesshots-logo.svg" alt="" />
		</a>
		<a class="email" href="mailto:hello@dunkel.cc">Email</a>
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

	.corner {
		position: absolute;
		top: var(--frame-inset);
		width: var(--corner-size);
		height: var(--corner-size);
		border-top: 1px solid currentColor;
		pointer-events: none;
	}

	.left {
		left: var(--frame-inset);
		border-left: 1px solid currentColor;
	}

	.right {
		right: var(--frame-inset);
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

		.brand {
			margin-top: 0;
		}

		.brand img {
			width: clamp(6rem, 31vw, 9rem);
		}
	}
</style>
