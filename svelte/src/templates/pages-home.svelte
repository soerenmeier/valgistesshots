<script>
	import HomeIntro from '@/components/home/HomeIntro.svelte';

	let { entry } = $props();
</script>

<HomeIntro
	title={entry.title}
	pageTitle={entry.pageTitle}
	pageIntroCke={entry.pageIntroCke}
	video={entry.video}
/>
