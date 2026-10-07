<script lang="ts">
	type Topic = {
		id: string;
		title: string;
		firstWord?: string | null;
		secondWord?: string | null;
		url?: string | null;
		previewImage?:
			| {
					w800?: string | null;
					w1920?: string | null;
					width?: number | null;
					height?: number | null;
					alt?: string | null;
					title?: string | null;
			  }[]
			| null;
	};

	let { topics = [] }: { topics?: Topic[] } = $props();
</script>

{#if topics.length}
	<section class="showcase" aria-labelledby="showcase-title">
		<h2 id="showcase-title" class="sr-only">Topics</h2>
		<div class="scroller">
			<div class="list">
				{#each topics as topic (topic.id)}
					{@const first = topic.firstWord?.trim() || topic.title}
					{@const second = topic.secondWord?.trim() || ''}
					{@const label = second ? `${first} ${second}` : first}
					{@const image = topic.previewImage?.[0]}
					<article class="card">
						<a href={topic.url ?? undefined} aria-label={label}>
							<span class="name first" aria-hidden="true">
								{first}
							</span>
							{#if image?.w800}
								<img
									src={image.w800}
									srcset={image.w1920
										? `${image.w800} 800w, ${image.w1920} 1920w`
										: undefined}
									sizes="(max-width: 767px) 100vw, 29vw"
									width={image.width ?? undefined}
									height={image.height ?? undefined}
									alt={image.alt || image.title || ''}
									loading="lazy"
								/>
							{:else}
								<div
									class="placeholder"
									aria-hidden="true"
								></div>
							{/if}

							{#if second}
								<span class="name last" aria-hidden="true">
									{second}
								</span>
							{/if}
						</a>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style lang="scss">
	.showcase {
		position: relative;
		display: flex;
		min-height: 100vh;
		min-height: 100svh;
		align-items: center;
		background: #f7f6f2;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.scroller {
		width: 100%;
		overflow-x: auto;
		scroll-snap-type: x proximity;
		scroll-padding-inline: var(--frame-inset);
		scrollbar-width: thin;
	}

	.list {
		display: flex;
		width: max-content;
		gap: clamp(5rem, 12vw, 10rem);
		padding: clamp(8rem, 17vh, 12rem) var(--frame-inset);
	}

	.card {
		width: clamp(19rem, 29vw, 25rem);
		scroll-snap-align: start;
	}

	.card a {
		position: relative;
		display: block;
	}

	.card img,
	.placeholder {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		background: #d6d5d0;
	}

	.name {
		position: absolute;
		z-index: 1;
		white-space: nowrap;
		color: #aaa;
		font-family: var(--font-serif);
		font-size: clamp(4rem, 7vw, 7rem);
		line-height: 1;
		pointer-events: none;
	}

	.first {
		top: -0.48em;
		left: 0;
	}

	.last {
		right: 0;
		bottom: -0.38em;
	}

	.card a:hover .name,
	.card a:focus-visible .name {
		color: #000;
	}

	.card a:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 0.5rem;
	}

	@include desktop {
		.showcase {
			width: max-content;
			min-width: 100vw;
			height: 100svh;
			min-height: 0;
			flex: 0 0 auto;
		}

		.scroller {
			width: auto;
			overflow: visible;
		}

		.list {
			min-width: 100vw;
			gap: clamp(9rem, 19vw, 20rem);
			padding-block: clamp(3rem, 8vh, 6rem);
			padding-inline-end: clamp(8rem, 20vw, 24rem);
		}

		.card {
			width: min(29vw, 48vh, 25rem);
		}
	}

	@include max-tablet {
		.showcase {
			padding-block: 6rem 4rem;
		}

		.scroller {
			overflow: visible;
		}

		.list {
			display: grid;
			width: 100%;
			gap: 7rem;
			padding-block: 3rem 4rem;
		}

		.card {
			width: min(100%, 32rem);
			margin-inline: auto;
		}

		.name {
			font-size: clamp(3.5rem, 13vw, 6rem);
		}
	}
</style>
