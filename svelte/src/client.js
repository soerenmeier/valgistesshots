import * as app from './App.svelte';
import * as errorPage from './Error.svelte';
import { main } from 'crelte/client';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const desktop = window.matchMedia('(min-width: 1111px)');

new Lenis({
	autoRaf: true,
	allowNestedScroll: true,
	prevent: node =>
		node.classList.contains('topic-gallery') ||
		(desktop.matches && node.classList.contains('home-panels')),
});

main({ app, errorPage });
