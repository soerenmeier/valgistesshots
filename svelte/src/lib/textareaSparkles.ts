import { createEmojiParticles } from './emojiParticles';

const caretStyleProperties = [
	'font-family',
	'font-size',
	'font-weight',
	'font-style',
	'line-height',
	'letter-spacing',
	'text-transform',
	'text-indent',
	'text-align',
	'direction',
	'tab-size',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'word-break',
	'overflow-wrap',
];

export function textareaSparkles(node: HTMLTextAreaElement) {
	const particles = createEmojiParticles();
	const mirror = document.createElement('div');

	mirror.setAttribute('aria-hidden', 'true');
	mirror.style.cssText =
		'position: fixed; left: 0; top: 0; visibility: hidden; pointer-events: none; box-sizing: border-box; white-space: pre-wrap; overflow-wrap: break-word;';
	document.body.append(mirror);

	function burst(event: Event) {
		if (
			particles.reducedMotion ||
			!(event instanceof InputEvent) ||
			event.isComposing ||
			!event.inputType.startsWith('insert')
		)
			return;

		// Mirror the textarea's wrapping to find the caret, including scrolled text.
		const styles = getComputedStyle(node);
		for (const property of caretStyleProperties) {
			mirror.style.setProperty(
				property,
				styles.getPropertyValue(property),
			);
		}
		mirror.style.width = `${node.clientWidth}px`;
		mirror.textContent = node.value.slice(0, node.selectionStart);
		const marker = document.createElement('span');
		marker.textContent = node.value.slice(node.selectionStart) || '\u200b';
		mirror.append(marker);

		const bounds = node.getBoundingClientRect();
		const caret = marker.getClientRects()[0];
		if (!caret) return;

		const x = bounds.left + node.clientLeft + caret.left - node.scrollLeft;
		const y =
			bounds.top +
			node.clientTop +
			caret.top +
			caret.height / 2 -
			node.scrollTop;
		if (
			x < bounds.left ||
			x > bounds.right ||
			y < bounds.top ||
			y > bounds.bottom
		)
			return;

		particles.burst(x, y);
	}

	node.addEventListener('input', burst);
	return {
		destroy() {
			node.removeEventListener('input', burst);
			particles.destroy();
			mirror.remove();
		},
	};
}
