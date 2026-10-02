export function videoEmbedUrl(value: string | null | undefined): string | null {
	if (!value) return null;

	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return null;
	}

	if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

	const host = url.hostname.toLowerCase().replace(/^www\./, '');
	const path = url.pathname.split('/').filter(Boolean);

	if (
		host === 'youtube.com' ||
		host === 'm.youtube.com' ||
		host === 'youtube-nocookie.com' ||
		host === 'youtu.be'
	) {
		const id =
			host === 'youtu.be'
				? path[0]
				: ['embed', 'shorts', 'live'].includes(path[0])
					? path[1]
					: url.searchParams.get('v');

		return id && /^[\w-]{11}$/.test(id)
			? `https://www.youtube-nocookie.com/embed/${id}`
			: null;
	}

	if (host === 'vimeo.com' || host === 'player.vimeo.com') {
		const idIndex = path.findIndex(part => /^\d+$/.test(part));
		if (idIndex === -1) return null;

		const embed = new URL(
			`https://player.vimeo.com/video/${path[idIndex]}`,
		);
		const hash = url.searchParams.get('h') || path[idIndex + 1];
		if (hash && /^[a-zA-Z0-9]+$/.test(hash))
			embed.searchParams.set('h', hash);
		return embed.href;
	}

	return null;
}
