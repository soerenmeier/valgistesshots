<script>
	import TopicTextBlock from '../TopicTextBlock.svelte';

	let { topicImage = [], sectIntroCke } = $props();
	let image = $derived(topicImage[0]);
</script>

<TopicTextBlock {sectIntroCke}>
	{#if image}
		<img
			src={image.w1920}
			srcset="{image.w800} 800w, {image.w1920} 1920w"
			sizes="(min-width: 1024px) 60vw, 100vw"
			width={image.width}
			height={image.height}
			alt={image.alt ?? image.title ?? ''}
			loading="lazy"
		/>
	{/if}
</TopicTextBlock>

<style>
	img {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
