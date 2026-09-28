<script module>
	import topicsQuery from '@/queries/topics.graphql';

	export const loadData = topicsQuery;
</script>

<script>
	import { onMount } from 'svelte';
	import HomeIntro from '@/components/home/HomeIntro.svelte';
	import About from '@/components/home/About.svelte';
	import TopicShowcase from '@/components/home/TopicShowcase.svelte';

	let { entry, topics = [] } = $props();
	let scroller;

	onMount(() => {
		const media = window.matchMedia('(min-width: 1111px)');

		function onWheel(event) {
			if (
				!media.matches ||
				event.ctrlKey ||
				Math.abs(event.deltaX) >= Math.abs(event.deltaY)
			)
				return;

			const about =
				event.target instanceof Element
					? event.target.closest('.about')
					: null;
			if (about && about.scrollHeight > about.clientHeight) {
				const maxTop = about.scrollHeight - about.clientHeight;
				if (
					(event.deltaY > 0 && about.scrollTop < maxTop) ||
					(event.deltaY < 0 && about.scrollTop > 0)
				)
					return;
			}

			const delta =
				event.deltaY *
				(event.deltaMode === WheelEvent.DOM_DELTA_LINE
					? 16
					: event.deltaMode === WheelEvent.DOM_DELTA_PAGE
						? scroller.clientWidth
						: 1);
			const nextLeft = Math.max(
				0,
				Math.min(
					scroller.scrollWidth - scroller.clientWidth,
					scroller.scrollLeft + delta,
				),
			);
			if (nextLeft === scroller.scrollLeft) return;

			event.preventDefault();
			scroller.scrollLeft = nextLeft;
		}

		scroller.addEventListener('wheel', onWheel, { passive: false });
		return () => scroller.removeEventListener('wheel', onWheel);
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
	<HomeIntro
		title={entry.title}
		pageTitle={entry.pageTitle}
		pageIntroCke={entry.pageIntroCke}
		video={entry.video}
	/>

	<About aboutCke={entry.aboutCke} />
	<TopicShowcase {topics} />
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
	}
</style>
