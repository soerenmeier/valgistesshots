<script>
	import TopicImageGrid from '../TopicImageGrid.svelte';

	let { topic3Images = [], displace = false } = $props();
</script>

<TopicImageGrid images={topic3Images} columns={3} {displace} />
