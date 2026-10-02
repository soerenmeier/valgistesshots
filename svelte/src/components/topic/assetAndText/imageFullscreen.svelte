<script>
	let { topicImage = [] } = $props();
	let image = $derived(topicImage[0]);
</script>

{#if image}
	<figure class="fullscreen">
		<img
			src={image.w1920}
			srcset="{image.w800} 800w, {image.w1920} 1920w"
			sizes="100vw"
			width={image.width}
			height={image.height}
			alt={image.alt ?? image.title ?? ''}
			loading="lazy"
		/>
	</figure>
{/if}

<style>
	.fullscreen {
		position: relative;
		left: 50%;
		width: 100vw;
		height: 100svh;
		transform: translateX(-50%);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
