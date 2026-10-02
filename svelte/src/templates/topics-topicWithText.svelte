<script module>
	import { loadAssetAndText } from '@/components/topic/AssetAndText.svelte';
	import topicsQuery from '@/queries/topics.graphql';

	/** @type {import('crelte').LoadData} */
	export const loadData = [
		topicsQuery,
		{
			blocks: (cr, entry) => loadAssetAndText(cr, entry.topicCtn ?? []),
		},
	];
</script>

<script>
	import AssetAndText from '@/components/topic/AssetAndText.svelte';
	import TopicNavigation from '@/components/topic/TopicNavigation.svelte';

	let { entry, blocks, topics = [] } = $props();

	let navigableTopics = $derived(topics.filter(topic => topic.url));
	let topicIndex = $derived(
		navigableTopics.findIndex(
			topic => String(topic.id) === String(entry.id),
		),
	);
	let previous = $derived(
		topicIndex >= 0 && navigableTopics.length > 1
			? navigableTopics[
					(topicIndex - 1 + navigableTopics.length) %
						navigableTopics.length
				]
			: null,
	);
	let next = $derived(
		topicIndex >= 0 && navigableTopics.length > 1
			? navigableTopics[(topicIndex + 1) % navigableTopics.length]
			: null,
	);
	let frameCount = $derived(
		(entry.topicCtn ?? []).reduce(
			(count, block) =>
				count +
				(block.topicImage?.length ?? 0) +
				(block.topic2Images?.length ?? 0) +
				(block.topic3Images?.length ?? 0),
			0,
		),
	);
</script>

<TopicNavigation {previous} {next} />

<main class="topic-with-text">
	<header class="topic-head">
		<h1>{entry.title}</h1>
		<p class="meta">
			{#if topicIndex >= 0}
				<span>
					Topic {String(topicIndex + 1).padStart(2, '0')} / {String(
						navigableTopics.length,
					).padStart(2, '0')}
				</span>
			{/if}
			<span>{frameCount} {frameCount === 1 ? 'frame' : 'frames'}</span>
		</p>
	</header>

	<section class="gallery" aria-label="Topic gallery">
		<AssetAndText {blocks} />
	</section>
</main>

<style>
	.topic-with-text {
		min-height: 100svh;
		background: #f7f6f2;
		color: #171717;
	}

	.topic-head {
		padding: calc(clamp(7rem, 13vw, 11rem) + 0.5rem)
			clamp(4.5rem, 8vw, 8rem) 0;
		text-align: center;
	}

	h1 {
		font-family: var(--font-sans);
		font-size: clamp(1rem, 1.3vw, 1.25rem);
		font-weight: 400;
		letter-spacing: 0.02em;
	}

	.meta {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		margin-top: 0.5rem;
		color: #8a8984;
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		font-variant-numeric: tabular-nums;
	}

	.gallery {
		padding-block: clamp(2.5rem, 6vh, 4rem) clamp(8rem, 18vh, 12rem);
	}

	@media (min-width: 768px) {
		.gallery {
			padding-inline: var(--frame-inset);
		}
	}

	@media (max-width: 767px) {
		.topic-head {
			padding-inline: var(--frame-inset);
		}
	}
</style>
