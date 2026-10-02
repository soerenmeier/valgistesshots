<script lang="ts">
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
			? '(min-width: 768px) 50vw, 100vw'
			: '(min-width: 768px) 33.33vw, 100vw',
	);
</script>

<div class="image-grid" class:displace style:--columns={columns}>
	{#each images ?? [] as image, index (image.id)}
		{#if image.w1920 || image.w800}
			<div class="image" style:--column-index={index % columns}>
				<img
					src={image.w1920 || image.w800}
					srcset={image.w800 && image.w1920
						? `${image.w800} 800w, ${image.w1920} 1920w`
						: undefined}
					{sizes}
					width={image.width ?? undefined}
					height={image.height ?? undefined}
					alt={image.alt ?? image.title ?? ''}
					loading="lazy"
					decoding="async"
				/>
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.image-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		align-items: start;
		gap: clamp(1rem, 2vw, 2rem);
	}

	.image {
		min-width: 0;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
	}

	@include tablet {
		.image-grid {
			grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
		}

		.displace .image {
			margin-top: calc(var(--column-index) * clamp(2rem, 5vw, 5rem));
		}
	}
</style>
