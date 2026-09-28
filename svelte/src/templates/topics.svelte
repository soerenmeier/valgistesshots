<script>
	import TopicGallery from '@/components/topic/TopicGallery.svelte';

	let { entry } = $props();
</script>

<TopicGallery images={entry.assets ?? []} />
