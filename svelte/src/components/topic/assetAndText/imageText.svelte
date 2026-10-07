<script>
	import TopicTextBlock from '../TopicTextBlock.svelte';
	import TopicImage from '../TopicImage.svelte';

	let {
		title,
		topicImage = [],
		sectIntroCke,
		textAlign,
		switchSide = false,
		noParallax = false,
	} = $props();
	let image = $derived(topicImage[0]);
</script>

<TopicTextBlock {title} {sectIntroCke} {switchSide} {textAlign}>
	{#if image}
		<TopicImage
			{image}
			{noParallax}
			sizes="(min-width: 768px) 55vw, 100vw"
		/>
	{/if}
</TopicTextBlock>
