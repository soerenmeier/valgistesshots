<script module>
	import topicsQuery from '@/queries/topics.graphql';

	export const loadData = topicsQuery;
</script>

<script>
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import HomeIntro from '@/components/home/HomeIntro.svelte';
	import About from '@/components/home/About.svelte';
	import TopicShowcase from '@/components/home/TopicShowcase.svelte';
	import Contact from '@/components/home/Contact.svelte';

	let { entry, topics = [] } = $props();
	let scroller;
	let track;

	onMount(() => {
		const media = window.matchMedia('(min-width: 1111px)');
		let lenis;

		function setup() {
			lenis?.destroy();
			lenis = media.matches
				? new Lenis({
						wrapper: scroller,
						content: track,
						orientation: 'horizontal',
						gestureOrientation: 'both',
						allowNestedScroll: true,
						overscroll: false,
						autoRaf: true,
					})
				: undefined;
		}

		setup();
		media.addEventListener('change', setup);

		return () => {
			media.removeEventListener('change', setup);
			lenis?.destroy();
		};
	});
</script>

<!-- Keyboard focus enables native arrow-key scrolling of the horizontal region. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="home-panels"
	role="region"
	aria-label="Homepage sections"
	tabindex="0"
	bind:this={scroller}
>
	<div class="home-track" bind:this={track}>
		<HomeIntro
			title={entry.title}
			pageTitle={entry.pageTitle}
			pageIntroCke={entry.pageIntroCke}
			video={entry.video}
		/>

		<About aboutCke={entry.aboutCke} />
		<TopicShowcase {topics} />
		<Contact title={entry.contactTitle} intro={entry.sectIntroCke} />
	</div>
</div>

<style lang="scss">
	@include desktop {
		.home-panels {
			display: flex;
			width: 100%;
			height: 100vh;
			height: 100svh;
			overflow-x: auto;
			overflow-y: hidden;
			scrollbar-width: none;
		}

		.home-panels::-webkit-scrollbar {
			display: none;
		}

		.home-track {
			display: flex;
			width: max-content;
			height: 100%;
		}
	}
</style>
