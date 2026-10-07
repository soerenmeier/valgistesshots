export function circularWipe(node: HTMLElement, selector?: string) {
	const surface = selector ? node.querySelector<HTMLElement>(selector) : node;
	if (!surface) return;

	function setOrigin(event: PointerEvent) {
		if (event.pointerType === 'touch' || !surface) return;

		const bounds = surface.getBoundingClientRect();
		const x = Math.max(0, Math.min(bounds.width, event.clientX - bounds.left));
		const y = Math.max(0, Math.min(bounds.height, event.clientY - bounds.top));
		const radius = Math.hypot(
			Math.max(x, bounds.width - x),
			Math.max(y, bounds.height - y),
		);

		surface.style.setProperty('--wipe-x', `${x}px`);
		surface.style.setProperty('--wipe-y', `${y}px`);
		surface.style.setProperty('--wipe-size', `${radius * 2}px`);
	}

	node.addEventListener('pointerenter', setOrigin);
	node.addEventListener('pointerleave', setOrigin);

	return {
		destroy() {
			node.removeEventListener('pointerenter', setOrigin);
			node.removeEventListener('pointerleave', setOrigin);
		},
	};
}
