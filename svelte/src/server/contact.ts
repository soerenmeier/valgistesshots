import type { CrelteServerRequest } from 'crelte/server';

type ContactRequest = {
	name: string;
	email: string;
	phone: string;

	vision: string;
	company?: string;
};

export async function sendContact(csr: CrelteServerRequest): Promise<Response> {
	let data: ContactRequest;
	try {
		data = await csr.req.json();
	} catch {
		return Response.json({ success: false }, { status: 400 });
	}

	if (
		!data ||
		!['name', 'email', 'phone'].every(
			key =>
				typeof data[key as keyof ContactRequest] === 'string' &&
				!!data[key as keyof ContactRequest]?.trim(),
		) ||
		typeof data.vision !== 'string'
	) {
		return Response.json({ success: false }, { status: 400 });
	}

	// Do not forward submissions that filled the honeypot.
	if (data.company) return Response.json({ success: true });

	try {
		const sessionResponse = await fetch(
			csr.backendUrl('/actions/users/session-info'),
			{
				headers: { Accept: 'application/json' },
			},
		);
		if (!sessionResponse.ok)
			throw new Error('Could not get contact form session');

		const { csrfTokenName, csrfTokenValue } = await sessionResponse.json();
		if (!csrfTokenName || !csrfTokenValue)
			throw new Error('Missing CSRF token');

		const cookie = sessionResponse.headers
			.getSetCookie()
			.map(value => value.split(';', 1)[0])
			.join('; ');
		const response = await fetch(
			csr.backendUrl('/actions/contact-form/send'),
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					Cookie: cookie,
				},
				body: JSON.stringify({
					fromName: data.name.trim(),
					fromEmail: data.email.trim(),
					[csrfTokenName]: csrfTokenValue,
					message: {
						'Contact Number': data.phone.trim(),

						body: data.vision.trim(),
					},
				}),
			},
		);

		const result = await response.json();
		if (!response.ok || !result.success) {
			return Response.json(
				{ success: false },
				{ status: response.ok ? 502 : response.status },
			);
		}
		return Response.json({ success: true, message: result.message });
	} catch (error) {
		console.error('Contact form submission failed', error);
		return Response.json({ success: false }, { status: 502 });
	}
}
