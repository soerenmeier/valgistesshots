<script>
	import TopicImage from '../TopicImage.svelte';

	let { topicImage = [] } = $props();
	let image = $derived(topicImage[0]);
</script>

{#if image}
	<div class="fullscreen">
		<TopicImage {image} sizes="100vw" />
	</div>
{/if}

<style>
	.fullscreen {
		box-sizing: border-box;
		width: 100%;
		padding-inline: var(--frame-inset);
	}

	@media (min-width: 768px) {
		.fullscreen {
			padding-inline: 0;
		}
	}
</style>
