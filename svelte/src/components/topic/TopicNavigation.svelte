<script lang="ts">
	type Topic = { url: string; title: string };
	let { previous, next }: { previous?: Topic | null; next?: Topic | null } = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
		if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable], [role="slider"]')) return;
		const topic = event.key === 'ArrowLeft' ? previous : event.key === 'ArrowRight' ? next : null;
		if (!topic) return;
		event.preventDefault();
		window.location.assign(topic.url);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#each [{ topic: previous, direction: 'prev', label: 'Previous' }, { topic: next, direction: 'next', label: 'Next' }] as item}
	{#if item.topic}
		<a
			class="topic-nav {item.direction}"
			href={item.topic.url}
			aria-label="{item.label} topic: {item.topic.title}"
			rel={item.direction}
		>
			<span class="circle" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d={item.direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
				</svg>
			</span>
			<span class="label">{item.topic.title}</span>
		</a>
	{/if}
{/each}

<style>
	.topic-nav {
		position: fixed;
		top: 50%;
		z-index: 11;
		display: flex;
		align-items: center;
		gap: 0.9rem;
		transform: translateY(-50%);
		color: #fff;
		mix-blend-mode: difference;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.prev { left: calc(var(--corner-inset) + 1rem); }
	.next { right: calc(var(--corner-inset) + 1rem); flex-direction: row-reverse; }

	.circle {
		display: grid;
		width: clamp(2.75rem, 3.5vw, 3.5rem);
		aspect-ratio: 1;
		flex: none;
		place-items: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		transition: background-color 0.3s, color 0.3s, transform 0.3s;
	}

	svg { width: 38%; height: 38%; }

	.label {
		white-space: nowrap;
		opacity: 0;
		transform: translateX(-0.5rem);
		transition: opacity 0.3s, transform 0.3s;
	}

	.next .label { transform: translateX(0.5rem); }
	.topic-nav:hover .circle, .topic-nav:focus-visible .circle {
		background: #fff;
		color: #000;
		transform: scale(1.08);
	}
	.topic-nav:hover .label, .topic-nav:focus-visible .label { opacity: 1; transform: none; }
	.topic-nav:focus-visible { outline: 2px solid currentColor; outline-offset: 0.4rem; border-radius: 2rem; }

	@media (max-width: 767px) {
		.topic-nav { top: auto; bottom: calc(var(--corner-inset) + 2.75rem); transform: none; }
		.label { display: none; }
		.prev { left: calc(var(--corner-inset) + 0.75rem); }
		.next { right: calc(var(--corner-inset) + 0.75rem); }
	}

	@media (prefers-reduced-motion: reduce) {
		.circle, .label { transition: none; }
	}
</style>
