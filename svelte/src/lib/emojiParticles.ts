type Particle = {
	element: HTMLElement;
	x: number;
	y: number;
	vx: number;
	vy: number;
	scale: number;
	rotation: number;
	rotationDelta: number;
	birthTime: number;
};

const particleLifetime = 3000;
const gravity = 1000;
const maxParticles = 120;
const particleEmojis = ['✨', '⭐', '☀️', '🌻', '📸'];

export function createEmojiParticles() {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	const layer = document.createElement('div');
	const particles = new Set<Particle>();
	let frame: number | null = null;
	let lastTime = 0;

	layer.setAttribute('aria-hidden', 'true');
	layer.style.cssText =
		'position: fixed; inset: 0; z-index: 20; overflow: hidden; pointer-events: none;';
	document.body.append(layer);

	function removeParticle(particle: Particle) {
		particles.delete(particle);
		particle.element.remove();
	}

	function clearParticles() {
		if (frame !== null) cancelAnimationFrame(frame);
		frame = null;
		for (const particle of particles) removeParticle(particle);
	}

	function renderParticle(particle: Particle, progress: number) {
		const rotation = particle.rotation + particle.rotationDelta * progress;
		particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) translate(-50%, -50%) scale(${particle.scale}) rotate(${rotation}deg)`;
		particle.element.style.opacity = String(
			progress > 0.7 ? (1 - progress) / 0.3 : 1,
		);
	}

	function animate(time: number) {
		const dt = Math.min(32, time - lastTime) / 1000;
		lastTime = time;

		for (const particle of particles) {
			const progress = (time - particle.birthTime) / particleLifetime;
			if (progress >= 1) {
				removeParticle(particle);
				continue;
			}

			particle.vy += gravity * dt;
			particle.x += particle.vx * dt;
			particle.y += particle.vy * dt;
			renderParticle(particle, progress);
		}

		frame = particles.size ? requestAnimationFrame(animate) : null;
	}

	function burst(x: number, y: number, count = 1, radial = false) {
		if (reducedMotion.matches) return;

		const birthTime = performance.now();
		for (let i = 0; i < count; i++) {
			if (particles.size >= maxParticles) {
				const oldest = particles.values().next().value;
				if (oldest) removeParticle(oldest);
			}

			const sparkle = document.createElement('span');
			sparkle.textContent =
				particleEmojis[
					Math.floor(Math.random() * particleEmojis.length)
				];
			sparkle.style.cssText =
				'position: absolute; left: 0; top: 0; font-size: 28px; line-height: 1; user-select: none; pointer-events: none; will-change: transform, opacity; transform-origin: 50% 50%;';
			layer.append(sparkle);

			const angle = Math.random() * Math.PI * 2;
			const speed = 200 + Math.random() * 600;
			const particle: Particle = {
				element: sparkle,
				x,
				y,
				vx: radial
					? Math.cos(angle) * speed
					: (Math.random() * 2 - 1) * 300,
				vy: radial
					? Math.sin(angle) * speed - 250
					: -560 + (Math.random() * 2 - 1) * 300,
				scale: 0.4 + Math.random() * 1.2,
				rotation: Math.random() * 360 - 180,
				rotationDelta: Math.random() * 720 - 360,
				birthTime,
			};
			particles.add(particle);
			renderParticle(particle, 0);
		}

		if (frame === null && particles.size) {
			lastTime = birthTime;
			frame = requestAnimationFrame(animate);
		}
	}

	reducedMotion.addEventListener('change', clearParticles);

	return {
		get reducedMotion() {
			return reducedMotion.matches;
		},
		burst,
		destroy() {
			reducedMotion.removeEventListener('change', clearParticles);
			clearParticles();
			layer.remove();
		},
	};
}

// Attach to the contact section so a successful submission doesn't cut the burst short.
export function submitSparkles(node: HTMLElement) {
	const particles = createEmojiParticles();

	function burstFromEvent(event: MouseEvent, centered = false) {
		if (!(event.target instanceof Element)) return;
		const button = event.target.closest<HTMLButtonElement>(
			'button[type="submit"]',
		);
		if (!button || !node.contains(button)) return;

		const bounds = button.getBoundingClientRect();
		const x = centered ? bounds.left + bounds.width / 2 : event.clientX;
		const y = centered ? bounds.top + bounds.height / 2 : event.clientY;
		particles.burst(x, y, 100, true);
	}

	function handlePointerDown(event: PointerEvent) {
		if (event.button !== 0 || !event.isPrimary) return;
		burstFromEvent(event);
	}

	function handleClick(event: MouseEvent) {
		// Pointer presses already burst; keep keyboard activation without doubling it.
		if (event.detail === 0) burstFromEvent(event, true);
	}

	node.addEventListener('pointerdown', handlePointerDown, true);
	node.addEventListener('click', handleClick, true);
	return {
		destroy() {
			node.removeEventListener('pointerdown', handlePointerDown, true);
			node.removeEventListener('click', handleClick, true);
			particles.destroy();
		},
	};
}
