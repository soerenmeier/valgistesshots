<script module>
	import topicsQuery from '@/queries/topics.graphql';

	export const loadData = topicsQuery;
</script>

<script>
	import HomeIntro from '@/components/home/HomeIntro.svelte';
	import About from '@/components/home/About.svelte';
	import TopicShowcase from '@/components/home/TopicShowcase.svelte';

	let { entry, topics = [] } = $props();
</script>

<HomeIntro
	title={entry.title}
	pageTitle={entry.pageTitle}
	pageIntroCke={entry.pageIntroCke}
	video={entry.video}
/>

<About aboutCke={entry.aboutCke} />
<TopicShowcase {topics} />
