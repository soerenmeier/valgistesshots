import type { Action } from 'svelte/action';

export type TopicLightboxImage = {
	w800?: string | null;
	w1920?: string | null;
	width?: number | null;
	height?: number | null;
	alt?: string | null;
	title?: string | null;
};

export type TopicLightboxContext = {
	register: Action<HTMLButtonElement, TopicLightboxImage>;
	open: (button: HTMLButtonElement) => void;
};

export const topicLightboxContext = Symbol('topic-lightbox');
