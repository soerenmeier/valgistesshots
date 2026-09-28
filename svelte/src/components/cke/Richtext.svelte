<script module lang="ts">
	export function hasChunks(cke: any): boolean {
		return !!cke?.chunks?.length;
	}
</script>

<script lang="ts">
	import type { Style } from '../form/Button.svelte';
	import Cke from './Cke.svelte';

	let {
		chunks,
		center = false,
		btnStyle,
	}: { chunks: any[]; center?: boolean; btnStyle?: Style } = $props();
</script>

<div class="rt" class:center>
	<Cke {chunks} {btnStyle} />
</div>
