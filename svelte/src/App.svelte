<script module>
	export const templates = import.meta.glob('@/templates/*.svelte');

	/** @type {import('crelte').Config} */
	export const config = {
		preloadOnMouseOver: true,
	};
</script>

<script>
	import Header from './components/Header.svelte';
	import BottomCorners from './components/BottomCorners.svelte';

	/** @type {import('crelte').AppProps} */
	let { route } = $props();

	let entry = $derived($route.entry);
	let Template = $derived($route.template.default);
	let templateData = $derived($route.loadedData);
</script>

<svelte:head>
	<title>{entry?.title ?? 'Not Found'}</title>
</svelte:head>

<Header {entry} />
<BottomCorners />

<!-- update entire component if page changes -->
{#key entry?.url}
	<div class="app">
		<Template {entry} {...templateData} />
	</div>
{/key}
