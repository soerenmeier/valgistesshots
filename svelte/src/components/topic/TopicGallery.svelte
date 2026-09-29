<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Lenis from 'lenis';

	type Image = {
		id: string;
		thumb?: string | null;
		w800?: string | null;
		image?: string | null;
		width?: number | null;
		height?: number | null;
		alt?: string | null;
		title?: string | null;
	};

	let { images = [] }: { images?: Image[] } = $props();
	let gallery: HTMLElement | undefined = $state();
	let rail: HTMLDivElement | undefined = $state();
	let track: HTMLDivElement | undefined = $state();
	let active = $state(0);
	let proximity = $state<number[]>([]);
	let endPadding = $state(0);
	let selectImage = (_index: number) => {};

	onMount(() => {
		if (!gallery || !rail || !track || !images.length) return;

		const media = window.matchMedia('(min-width: 1111px)');
		let lenis: Lenis | undefined;
		let snapTimer: ReturnType<typeof setTimeout> | undefined;
		let snapFallback: ReturnType<typeof setTimeout> | undefined;
		let frame: number | undefined;
		let snapping = false;

		function stopSnapping() {
			snapping = false;
			clearTimeout(snapFallback);
		}

		function buttons() {
			return Array.from(track!.querySelectorAll('button'));
		}

		function update() {
			const bounds = rail!.getBoundingClientRect();
			const marker = media.matches
				? bounds.top + bounds.height / 2
				: bounds.left + bounds.width / 2;
			let nearest = 0;
			let distance = Infinity;
			const items = buttons();
			const step = media.matches
				? (items[0]?.offsetHeight ?? 1) + 12
				: (items[0]?.offsetWidth ?? 1) + 12;

			proximity = items.map((button, index) => {
				const rect = button.getBoundingClientRect();
				const middle = media.matches
					? rect.top + rect.height / 2
					: rect.left + rect.width / 2;
				const gap = Math.abs(middle - marker);
				if (gap < distance) {
					distance = gap;
					nearest = index;
				}
				return Math.max(0, 1 - gap / step);
			});

			if (!snapping) active = nearest;
		}

		function offsetFor(index: number) {
			const button = buttons()[index];
			if (!button) return 0;
			const bounds = rail!.getBoundingClientRect();
			const rect = button.getBoundingClientRect();
			return media.matches
				? rail!.scrollTop +
						rect.top -
						bounds.top -
						(bounds.height - rect.height) / 2
				: rail!.scrollLeft +
						rect.left -
						bounds.left -
						(bounds.width - rect.width) / 2;
		}

		selectImage = index => {
			if (index < 0 || index >= images.length) return;
			clearTimeout(snapTimer);
			active = index;
			const offset = offsetFor(index);
			if (!lenis || Math.abs(lenis.scroll - offset) < 1) {
				stopSnapping();
				return;
			}

			snapping = true;
			clearTimeout(snapFallback);
			snapFallback = setTimeout(stopSnapping, 900);
			lenis.scrollTo(offset, {
				duration: 0.55,
				onComplete: stopSnapping,
			});
		};

		function onScroll() {
			update();
			if (snapping) return;
			clearTimeout(snapTimer);
			snapTimer = setTimeout(() => selectImage(active), 140);
		}

		function measure() {
			const button = buttons()[0];
			if (!button) return;
			endPadding = Math.max(
				0,
				((media.matches ? rail!.clientHeight : rail!.clientWidth) -
					(media.matches
						? button.offsetHeight
						: button.offsetWidth)) /
					2,
			);
			cancelAnimationFrame(frame ?? 0);
			frame = requestAnimationFrame(() => {
				lenis?.resize();
				update();
			});
		}

		function setup() {
			clearTimeout(snapTimer);
			stopSnapping();
			lenis?.destroy();
			lenis = new Lenis({
				wrapper: rail!,
				content: track!,
				eventsTarget: gallery!,
				orientation: media.matches ? 'vertical' : 'horizontal',
				gestureOrientation: 'both',
				overscroll: false,
				autoRaf: true,
			});
			lenis.on('scroll', onScroll);
			lenis.on('virtual-scroll', stopSnapping);
			measure();
		}

		const observer = new ResizeObserver(measure);
		observer.observe(rail);
		setup();
		media.addEventListener('change', setup);

		return () => {
			observer.disconnect();
			media.removeEventListener('change', setup);
			clearTimeout(snapTimer);
			stopSnapping();
			cancelAnimationFrame(frame ?? 0);
			lenis?.destroy();
		};
	});
</script>

<section class="topic-gallery" aria-label="Topic gallery" bind:this={gallery}>
	<div class="stage" aria-live="polite">
		{#if images[active]?.image || images[active]?.w800}
			{#key images[active].id}
				<img
					src={images[active].image || images[active].w800}
					srcset={images[active].w800 && images[active].image
						? `${images[active].w800} 800w, ${images[active].image} 1920w`
						: undefined}
					sizes="(max-width: 767px) 100vw, 75vw"
					width={images[active].width ?? undefined}
					height={images[active].height ?? undefined}
					alt={images[active].alt || images[active].title || ''}
					in:fade={{ duration: 220 }}
				/>
			{/key}
		{:else}
			<p>No images yet.</p>
		{/if}

		{#if images.length > 1}
			<button
				class="stage-nav previous"
				type="button"
				aria-label="Previous image"
				disabled={active === 0}
				onclick={() => selectImage(active - 1)}
			></button>
			<button
				class="stage-nav next"
				type="button"
				aria-label="Next image"
				disabled={active === images.length - 1}
				onclick={() => selectImage(active + 1)}
			></button>
		{/if}
	</div>

	{#if images.length}
		<div class="thumbnails" aria-label="Choose an image" bind:this={rail}>
			<div
				class="rail-track"
				style:--end-padding={`${endPadding}px`}
				bind:this={track}
			>
				{#each images as image, index (image.id)}
					<button
						type="button"
						style:--proximity={proximity[index] ??
							(index === 0 ? 1 : 0)}
						aria-label={`Show image ${index + 1} of ${images.length}`}
						aria-pressed={active === index}
						onclick={() => selectImage(index)}
					>
						<img
							src={image.thumb || image.w800 || image.image}
							alt=""
							loading="lazy"
						/>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</section>

<style lang="scss">
	.topic-gallery {
		position: relative;
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 2rem;
		height: 100vh;
		height: 100svh;
		min-height: 28rem;
		padding: clamp(8rem, 16vh, 11rem) var(--frame-inset)
			clamp(4rem, 7vh, 6rem);
		overflow: hidden;
		background: #f7f6f2;
		color: #171717;
	}

	.stage {
		position: relative;
		display: flex;
		min-width: 0;
		min-height: 0;
		align-items: center;
		justify-content: center;
	}

	.stage img {
		display: block;
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.stage-nav {
		position: absolute;
		z-index: 1;
		top: 0;
		width: 50%;
		height: 100%;
		cursor: pointer;
	}

	.stage-nav.previous {
		left: 0;
	}

	.stage-nav.next {
		right: 0;
	}

	.stage-nav:disabled {
		pointer-events: none;
	}

	.stage-nav:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -2px;
	}

	.thumbnails {
		width: calc(100% + 2 * var(--frame-inset));
		min-width: 0;
		margin-inline: calc(-1 * var(--frame-inset));
		overflow-x: auto;
		scrollbar-width: none;
	}

	.thumbnails::-webkit-scrollbar {
		display: none;
	}

	.rail-track {
		display: flex;
		width: max-content;
		gap: 0.75rem;
		padding-inline: var(--end-padding);
		padding-top: 1.75rem;
	}

	.rail-track button {
		width: clamp(3.5rem, 12vw, 5rem);
		height: clamp(3.5rem, 12vw, 5rem);
		flex: 0 0 auto;
		cursor: pointer;
		transform: translateY(calc(var(--proximity) * -1.25rem));
	}

	.rail-track button[aria-pressed='true'] {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	.rail-track img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@include desktop {
		.topic-gallery {
			grid-template-columns: clamp(5rem, 10vw, 9rem) minmax(0, 1fr) clamp(
					5rem,
					10vw,
					9rem
				);
			grid-template-rows: minmax(0, 1fr);
			padding-block: clamp(9.5rem, 16vh, 12rem) clamp(2.5rem, 5vh, 4rem);
		}

		.stage {
			grid-column: 2;
			grid-row: 1;
		}

		.thumbnails {
			grid-column: 1;
			grid-row: 1;
			width: calc(100% + var(--frame-inset));
			margin-top: calc(-1 * clamp(9.5rem, 16vh, 12rem));
			margin-right: 0;
			margin-bottom: calc(-1 * clamp(2.5rem, 5vh, 4rem));
			margin-left: calc(-1 * var(--frame-inset));
			overflow-x: hidden;
			overflow-y: auto;
		}

		.rail-track {
			width: 100%;
			flex-direction: column;
			align-items: flex-start;
			padding-inline: var(--frame-inset) 0;
			padding-block: var(--end-padding);
		}

		.rail-track button {
			width: clamp(4rem, 7vw, 6rem);
			height: clamp(4rem, 7vw, 6rem);
			transform: translateX(calc(var(--proximity) * 2rem));
		}
	}
</style>
