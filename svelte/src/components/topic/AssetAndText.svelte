<script module>
	import Blocks, { blockModules, loadBlocksData } from 'crelte/blocks';

	const mods = blockModules(import.meta.glob('./assetAndText/*.svelte'));

	/** @type {import('crelte').LoadDataFn} */
	export const loadAssetAndText = (cr, blocks) =>
		loadBlocksData(cr, blocks, mods);
</script>

<script>
	let { blocks } = $props();
</script>

<div class="blocks">
	<Blocks {blocks} />
</div>

<style lang="scss">
	.blocks {
		display: flex;
		max-width: 90rem;
		flex-direction: column;
		gap: clamp(4rem, 8vw, 8rem);
		margin-inline: auto;
	}
</style>
