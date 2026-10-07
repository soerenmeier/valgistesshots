<script lang="ts">
	type Logo = {
		id?: string;
		url?: string | null;
		width?: number | null;
		height?: number | null;
		alt?: string | null;
		title?: string | null;
	};

	let { logos = [] }: { logos?: Logo[] | null } = $props();

	let availableLogos = $derived((logos ?? []).filter(logo => logo.url));
	// Fill each half of the loop so short partner lists still cover the viewport.
	let loopLogos = $derived(
		availableLogos.length > 1
			? Array.from(
					{
						length: Math.max(
							1,
							Math.ceil(12 / availableLogos.length),
						),
					},
					() => availableLogos,
				).flat()
			: availableLogos,
	);
</script>

{#if availableLogos.length}
	<section class="partners" aria-labelledby="partners-title">
		<h2 id="partners-title" class="sr-only">Trusted by</h2>

		<div class="marquee" class:single={availableLogos.length === 1}>
			<div
				class="track"
				class:animated={availableLogos.length > 1}
				style:--duration={`${loopLogos.length * 6}s`}
			>
				{#each availableLogos.length > 1 ? [0, 1] : [0] as copy}
					<ul
						class="group"
						class:clone={copy === 1}
						aria-hidden={copy === 1 ? true : undefined}
					>
						{#each loopLogos as logo, index}
							<li
								class="logo"
								class:repeat={index >= availableLogos.length}
								aria-hidden={index >= availableLogos.length
									? true
									: undefined}
							>
								<img
									src={logo.url ?? undefined}
									width={logo.width ?? undefined}
									height={logo.height ?? undefined}
									alt={copy === 0 &&
									index < availableLogos.length
										? logo.alt ||
											logo.title ||
											'Partner logo'
										: ''}
									loading="lazy"
									decoding="async"
								/>
							</li>
						{/each}
					</ul>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style lang="scss">
	.partners {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;

		padding: clamp(5rem, 10vw, 8rem) 0;
		background: #f7f6f2;
		color: #171717;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.marquee {
		width: 100%;
		overflow: hidden;
	}

	.track {
		display: flex;
		width: max-content;
	}

	.animated {
		animation: drift-horizontal var(--duration, 50s) linear infinite;
	}

	.group {
		display: flex;
		flex: none;
		align-items: center;
		gap: 1.5rem;
		margin: 0;
		padding: 0 1.5rem 0 0;
		list-style: none;
	}

	.logo {
		display: grid;
		flex: none;
		width: clamp(13rem, 40vw, 18rem);
		height: 8rem;
		place-items: center;
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 7rem;
		object-fit: contain;
	}

	.single .track {
		width: 100%;
		justify-content: center;
	}

	.single .group {
		padding: 0;
	}

	@media (hover: hover) {
		.marquee:hover .animated {
			animation-play-state: paused;
		}
	}

	@keyframes drift-horizontal {
		to {
			transform: translateX(-50%);
		}
	}

	@keyframes drift-vertical {
		to {
			transform: translateY(-50%);
		}
	}

	@include desktop {
		.partners {
			flex: 0 0 auto;
			justify-content: center;
			width: clamp(20rem, 28vw, 30rem);
			height: 100svh;
			padding: 0 clamp(1rem, 2vw, 2rem);
		}

		.marquee {
			height: 100%;
			min-height: 0;
		}

		.track {
			width: 100%;
			flex-direction: column;
		}

		.animated {
			animation-name: drift-vertical;
		}

		.group {
			width: 100%;
			flex-direction: column;
			gap: 3rem;
			padding: 0 0 3rem;
		}

		.logo {
			width: min(100%, 21rem);
		}

		.single {
			display: grid;
			place-items: center;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee {
			overflow: auto;
		}

		.track {
			width: 100%;
			animation: none;
		}

		.group {
			width: 100%;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			gap: 2rem;
			padding: 0 var(--frame-inset);
		}

		.clone,
		.repeat {
			display: none;
		}
	}
</style>
