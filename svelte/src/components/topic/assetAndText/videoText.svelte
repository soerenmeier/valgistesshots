<script>
	import TopicTextBlock from '../TopicTextBlock.svelte';
	import { videoEmbedUrl } from '@/lib/videoEmbed';

	let {
		title,
		video = [],
		autoplay = false,
		youtubeOrVimeoUrl,
		sectIntroCke,
		textAlign,
		switchSide = false,
	} = $props();
	let videoAsset = $derived(video?.[0]);
	let embedUrl = $derived(videoEmbedUrl(youtubeOrVimeoUrl?.url, autoplay));
</script>

<TopicTextBlock {title} {sectIntroCke} {switchSide} {textAlign}>
	{#if videoAsset?.url}
		<!-- svelte-ignore a11y_media_has_caption (The video asset field does not supply caption tracks.) -->
		<video
			src={videoAsset.url}
			{autoplay}
			muted={autoplay}
			loop={autoplay}
			controls
			playsinline
			preload="metadata"
			aria-label={title || videoAsset.title || 'Video'}
		>
			<a href={videoAsset.url}>
				Watch {title || videoAsset.title || 'video'}
			</a>
		</video>
	{:else if embedUrl}
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
	video,
	iframe {
		display: block;
		width: 100%;
		border: 0;
	}

	video {
		height: auto;
	}

	iframe {
		aspect-ratio: 16 / 9;
	}
</style>
