<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { circularWipe } from '@/lib/circularWipe';
	import {
		topicLightboxContext,
		type TopicLightboxContext,
		type TopicLightboxImage,
	} from './lightboxContext';

	let { children }: { children: Snippet } = $props();
	let dialog: HTMLDialogElement;
	let images = $state<
		{ button: HTMLButtonElement; image: TopicLightboxImage }[]
	>([]);
	let active = $state<HTMLButtonElement | null>(null);
	let index = $derived(images.findIndex(item => item.button === active));
	let image = $derived(images[index]?.image);

	setContext<TopicLightboxContext>(topicLightboxContext, {
		register(button, image) {
			images = [...images, { button, image }];
			return {
				update(image) {
					images = images.map(item =>
						item.button === button ? { button, image } : item,
					);
				},
				destroy() {
					if (active === button) active = null;
					images = images.filter(item => item.button !== button);
				},
			};
		},
		open(button) {
			images = [...images].sort((a, b) =>
				a.button.compareDocumentPosition(b.button) &
				Node.DOCUMENT_POSITION_FOLLOWING
					? -1
					: 1,
			);
			active = button;
		},
	});

	function move(offset: number) {
		if (images.length) {
			active =
				images[(index + offset + images.length) % images.length].button;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		// Keep the page's previous/next topic shortcuts out of the modal.
		event.stopPropagation();
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
			return;
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.preventDefault();
			move(event.key === 'ArrowLeft' ? -1 : 1);
		}
	}

	$effect(() => {
		if (active) {
			if (!dialog.open) dialog.showModal();
			const previousOverflow = document.documentElement.style.overflow;
			document.documentElement.style.overflow = 'hidden';
			return () => {
				document.documentElement.style.overflow = previousOverflow;
			};
		} else if (dialog?.open) {
			dialog.close();
		}
	});
</script>

{@render children()}

<dialog
	bind:this={dialog}
	aria-label="Topic image lightbox"
	onkeydown={handleKeydown}
	onclose={() => (active = null)}
>
	<button
		class="backdrop"
		aria-label="Close lightbox"
		tabindex="-1"
		onclick={() => dialog.close()}
	></button>
	<button
		class="close control"
		aria-label="Close lightbox"
		onclick={() => dialog.close()}
	>
		<span aria-hidden="true">×</span>
	</button>
	{#if image}
		<img
			src={image.w1920 || image.w800 || undefined}
			alt={image.alt ?? image.title ?? ''}
			width={image.width ?? undefined}
			height={image.height ?? undefined}
		/>
		<p class="counter" aria-live="polite" aria-atomic="true">
			{index + 1} / {images.length}
		</p>
	{/if}
	{#if images.length > 1}
		<button
			class="previous control"
			use:circularWipe={'.circle'}
			aria-label="Previous image"
			onclick={() => move(-1)}
		>
			<span class="circle" aria-hidden="true">
				<svg
					class="wipe-content"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path d="M15 5l-7 7 7 7" />
				</svg>
			</span>
		</button>
		<button
			class="next control"
			use:circularWipe={'.circle'}
			aria-label="Next image"
			onclick={() => move(1)}
		>
			<span class="circle" aria-hidden="true">
				<svg
					class="wipe-content"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path d="M9 5l7 7-7 7" />
				</svg>
			</span>
		</button>
	{/if}
</dialog>

<style lang="scss">
	@use '../../sass/circularWipe' as *;

	dialog {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 4.5rem clamp(0.75rem, 6vw, 6rem);
		border: 0;
		background: transparent;
		color: #171717;
	}

	dialog[open] {
		display: grid;
		place-items: center;
	}

	dialog::backdrop {
		background: rgb(247 246 242 / 95%);
	}

	.backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		cursor: zoom-out;
	}

	img {
		position: relative;
		min-width: 0;
		min-height: 0;
		width: auto;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.control {
		position: absolute;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border: 1px solid currentColor;
		border-radius: 50%;
		background: #f7f6f2;
		color: #171717;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.close:hover {
		background: #171717;
		color: #f7f6f2;
	}

	.control:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 4px;
	}

	.close {
		top: 1rem;
		right: 1rem;
	}

	.previous,
	.next {
		top: 50%;
		border: 0;
		background: transparent;
		transform: translateY(-50%);
	}

	.circle {
		@include circular-wipe;
		--wipe-fill: #171717;
		display: grid;
		width: 100%;
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		background: #f7f6f2;
		transition: transform 0.3s;
	}

	svg {
		width: 38%;
		height: 38%;
	}

	@media (hover: hover) {
		.control:hover .circle::before {
			transform: translate(-50%, -50%) scale(1);
		}

		.control:hover .circle {
			transform: scale(1.08);
		}
	}

	.control:focus-visible .circle::before {
		transform: translate(-50%, -50%) scale(1);
	}

	.control:focus-visible .circle {
		transform: scale(1.08);
	}

	@media (prefers-reduced-motion: reduce) {
		.circle {
			transition: none;
		}
	}

	.previous {
		left: 1rem;
	}

	.next {
		right: 1rem;
	}

	.counter {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 0.875rem;
	}

	@media (max-width: 767px) {
		.previous,
		.next {
			top: auto;
			bottom: 0.75rem;
			transform: none;
		}
	}
</style>
