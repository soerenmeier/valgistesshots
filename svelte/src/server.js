import * as app from './App.svelte';
import * as errorPage from './Error.svelte';
import { main, mainError } from 'crelte/server';
import { sendContact } from './server/contact';

export const queries = import.meta.glob('@/queries/*', { eager: true });

export async function render(serverData) {
	return await main({ app, serverData });
}

export async function renderError(error, serverData) {
	return await mainError({ error, errorPage, serverData });
}

/** @param {import('crelte/server').ServerRouter} router */
export async function routes(router) {
	router.post('/api/contact', sendContact);
}
