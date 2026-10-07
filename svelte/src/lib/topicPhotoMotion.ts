export function topicPhotoMotion(node: HTMLElement, noParallax = false) {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

	let visible = false;
	let frame = 0;

	function update() {
		frame = 0;
		if (reducedMotion.matches) node.classList.add('in');
		if (reducedMotion.matches || noParallax) {
			node.style.removeProperty('--iy');
			return;
		}
		if (!visible) return;
		const rect = node.getBoundingClientRect();
		const progress = Math.max(
			-1,
			Math.min(
				1,
				(window.innerHeight / 2 - (rect.top + rect.height / 2)) /
					(window.innerHeight / 2 + rect.height / 2),
			),
		);
		node.style.setProperty(
			'--iy',
			`${(progress * rect.height * 0.1).toFixed(1)}px`,
		);
	}

	function requestUpdate() {
		if (!frame) frame = window.requestAnimationFrame(update);
	}

	const reveal = new IntersectionObserver(
		entries => {
			if (entries.some(entry => entry.isIntersecting)) {
				node.classList.add('in');
				reveal.disconnect();
			}
		},
		{ rootMargin: '0px 0px -8% 0px' },
	);
	const parallax = new IntersectionObserver(
		entries => {
			visible = entries[0].isIntersecting;
			requestUpdate();
		},
		{ rootMargin: '20% 0px' },
	);

	node.classList.add('reveal');
	reveal.observe(node);
	function configureParallax(disabled: boolean) {
		noParallax = disabled;
		parallax.disconnect();
		window.removeEventListener('scroll', requestUpdate);
		window.removeEventListener('resize', requestUpdate);
		window.cancelAnimationFrame(frame);
		frame = 0;
		visible = false;
		node.style.removeProperty('--iy');

		if (!noParallax) {
			parallax.observe(node);
			window.addEventListener('scroll', requestUpdate, { passive: true });
			window.addEventListener('resize', requestUpdate);
		}
	}

	configureParallax(noParallax);
	reducedMotion.addEventListener('change', requestUpdate);

	return {
		update: configureParallax,
		destroy() {
			reveal.disconnect();
			parallax.disconnect();
			window.cancelAnimationFrame(frame);
			window.removeEventListener('scroll', requestUpdate);
			window.removeEventListener('resize', requestUpdate);
			reducedMotion.removeEventListener('change', requestUpdate);
		},
	};
}
