<script lang="ts">
	import LinkButton from '@/components/form/LinkButton.svelte';
	import type { Style } from '../form/Button.svelte';

	let { btns, style }: { btns: any[]; style?: Style } = $props();
</script>

<div class="buttons">
	{#each btns as btn, i}
		<LinkButton
			{...btn}
			style={style || (i <= 0 ? 'primary' : 'secondary')}
		/>
	{/each}
</div>

<style lang="scss">
	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	@include tablet {
		.buttons {
			gap: 0.75rem;
		}
	}

	@include desktop {
		.buttons {
			gap: 1rem;
		}
	}
</style>
