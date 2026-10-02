<script>
	import TopicTextBlock from '../TopicTextBlock.svelte';
	import { videoEmbedUrl } from '@/lib/videoEmbed';

	let { title, youtubeOrVimeoUrl, sectIntroCke } = $props();
	let embedUrl = $derived(videoEmbedUrl(youtubeOrVimeoUrl?.url));
</script>

<TopicTextBlock {sectIntroCke}>
	{#if embedUrl}
		<iframe
			src={embedUrl}
			title={title || 'Video'}
			loading="lazy"
			allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
			allowfullscreen
		></iframe>
	{:else if youtubeOrVimeoUrl?.url}
		<a
			href={youtubeOrVimeoUrl.url}
			target="_blank"
			rel="noopener noreferrer"
		>
			Watch {title || 'video'}
		</a>
	{/if}
</TopicTextBlock>

<style>
	iframe {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		border: 0;
	}
</style>
