<script module>
	import { loadAssetAndText } from '@/components/topic/AssetAndText.svelte';

	/** @type {import('crelte').LoadData} */
	export const loadData = {
		blocks: (cr, entry) => loadAssetAndText(cr, entry.assetAndText ?? []),
	};
</script>

<script>
	import AssetAndText from '@/components/topic/AssetAndText.svelte';

	let { blocks } = $props();
</script>

<main class="topic-with-text">
	<AssetAndText {blocks} />
</main>

<style lang="scss">
	.topic-with-text {
		min-height: 100svh;
		padding: clamp(9rem, 16vh, 12rem) var(--frame-inset)
			clamp(4rem, 8vh, 7rem);
	}
</style>
