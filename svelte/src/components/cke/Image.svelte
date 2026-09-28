<script lang="ts">
	let {
		image,
	}: {
		image: {
			url: string;
			alt?: string | null;
			width?: number | null;
			height?: number | null;
		};
	} = $props();
</script>

<figure class="image">
	<img
		src={image.url}
		alt={image.alt ?? ''}
		width={image.width ?? undefined}
		height={image.height ?? undefined}
		loading="lazy"
	/>
</figure>
