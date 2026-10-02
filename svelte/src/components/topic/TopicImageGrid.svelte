<script lang="ts">
	import TopicImage from './TopicImage.svelte';

	type Image = {
		id: string;
		w800?: string | null;
		w1920?: string | null;
		width?: number | null;
		height?: number | null;
		alt?: string | null;
		title?: string | null;
	};

	let {
		images = [],
		columns,
		displace = false,
	}: {
		images?: Image[] | null;
		columns: 2 | 3;
		displace?: boolean;
	} = $props();

	let sizes = $derived(
		columns === 2
			? '(min-width: 768px) 49vw, 100vw'
			: '(min-width: 768px) 32vw, 100vw',
	);
</script>

<div class="image-grid" class:displace style:--columns={columns}>
	{#each images ?? [] as image, index (image.id)}
		{#if image.w1920 || image.w800}
			<div class="image" style:--column-index={index % columns}>
				<TopicImage {image} {sizes} />
			</div>
		{/if}
	{/each}
</div>

<style>
	.image-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
		gap: 0.75rem;
		padding-inline: var(--frame-inset);
	}

	.image {
		min-width: 0;
	}

	@media (min-width: 768px) {
		.image-grid {
			grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
			gap: 2vw;
			padding-inline: 0;
		}

		.displace .image {
			margin-top: calc(var(--column-index) * 10vw / (var(--columns) - 1));
		}
	}
</style>
