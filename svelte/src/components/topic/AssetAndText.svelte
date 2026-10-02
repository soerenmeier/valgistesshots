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

		flex-direction: column;
		gap: 2vw;
	}

	@media (max-width: 767px) {
		.blocks {
			gap: 0.75rem;
		}
	}
</style>
