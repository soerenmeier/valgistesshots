<script lang="ts">
	import Button, { type Style } from './Button.svelte';

	let {
		url,
		target,
		label,
		defaultLabel,
		download,
		style,
	}: {
		url: string;
		target?: string | null;
		label?: string | null;
		defaultLabel: string;
		download?: boolean;
		style?: Style;
	} = $props();
</script>

<Button
	href={url}
	target={target ?? undefined}
	download={download || undefined}
	{style}
>
	{label ?? defaultLabel}
</Button>
