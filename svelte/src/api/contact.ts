export type ContactDetails = {
	name: string;
	email: string;
	phone: string;
	date: string;
	budget: string;
	vision: string;
	company: string;
};

export async function contact(details: ContactDetails): Promise<string> {
	const response = await fetch('/api/contact', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify(details),
	});

	const result = await response.json();
	if (!response.ok || !result.success) {
		throw new Error('Failed to send contact form');
	}
	return result.message ?? '';
}
