<script>
	import TopicTextBlock from '../TopicTextBlock.svelte';
	import TopicImage from '../TopicImage.svelte';

	let { topicImage = [], sectIntroCke } = $props();
	let image = $derived(topicImage[0]);
</script>

<TopicTextBlock {sectIntroCke}>
	{#if image}
		<TopicImage {image} sizes="(min-width: 768px) 55vw, 100vw" />
	{/if}
</TopicTextBlock>
