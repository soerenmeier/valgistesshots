<script module>
	import topicsQuery from '@/queries/topics.graphql';

	export const loadData = topicsQuery;

	const scrollPositions = new Map();
</script>

<script>
	import { onMount } from 'svelte';
	import { getRoute } from 'crelte';
	import Lenis from 'lenis';
	import HomeIntro from '@/components/home/HomeIntro.svelte';
	import About from '@/components/home/About.svelte';
	import TopicShowcase from '@/components/home/TopicShowcase.svelte';
	import Contact from '@/components/home/Contact.svelte';
	import TrustedPartners from '@/components/home/TrustedPartners.svelte';

	const route = getRoute();
	let { entry, topics = [] } = $props();
	let scroller;
	let track;

	onMount(() => {
		const media = window.matchMedia('(min-width: 1111px)');
		const homeRoute = $route;
		const savedPosition =
			homeRoute.getState('homeScroll') ?? scrollPositions.get(entry.url);
		let lenis;

		function rememberPosition() {
			// Navigation updates the route before resetting the document scroll.
			if ($route.entry?.url !== entry.url) return;

			const position = {
				left: scroller.scrollLeft,
				top: window.scrollY,
			};
			scrollPositions.set(entry.url, position);
			$route.setState('homeScroll', position);
		}

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

		function scrollToStart() {
			const reducedMotion = window.matchMedia(
				'(prefers-reduced-motion: reduce)',
			).matches;
			if (lenis) {
				lenis.scrollTo(0, { immediate: reducedMotion });
			} else {
				scroller.scrollTo({
					left: 0,
					behavior: reducedMotion ? 'instant' : 'smooth',
				});
			}
			window.scrollTo({
				top: 0,
				behavior: reducedMotion ? 'instant' : 'smooth',
			});
		}

		setup();
		media.addEventListener('change', setup);
		window.addEventListener('home-scroll-start', scrollToStart);

		// Wait until the router has applied its default scroll reset.
		const restoreFrame = requestAnimationFrame(() => {
			if (savedPosition && !homeRoute.hash) {
				lenis?.resize();
				if (lenis) {
					lenis.scrollTo(savedPosition.left, { immediate: true });
				} else {
					scroller.scrollLeft = savedPosition.left;
				}
				window.scrollTo({
					top: savedPosition.top,
					behavior: 'instant',
				});
			}

			rememberPosition();
			window.addEventListener('scroll', rememberPosition, {
				passive: true,
			});
			scroller.addEventListener('scroll', rememberPosition, {
				passive: true,
			});
			scroller.addEventListener('click', rememberPosition, true);
		});

		return () => {
			cancelAnimationFrame(restoreFrame);
			window.removeEventListener('home-scroll-start', scrollToStart);
			window.removeEventListener('scroll', rememberPosition);
			scroller.removeEventListener('scroll', rememberPosition);
			scroller.removeEventListener('click', rememberPosition, true);
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
		<HomeIntro video={entry.video} />

		<About
			aboutTitle={entry.aboutTitle}
			aboutImage={entry.aboutImage}
			aboutCke={entry.aboutCke}
		/>
		<TopicShowcase {topics} />
		<TrustedPartners logos={entry.trustedPartnersLogo} />
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
