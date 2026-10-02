<script>
	import TopicImageGrid from '../TopicImageGrid.svelte';

	let { topic2Images = [], displace = false } = $props();
</script>

<TopicImageGrid images={topic2Images} columns={2} {displace} />
