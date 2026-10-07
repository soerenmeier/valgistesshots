<script lang="ts">
	import { contact } from '@/api/contact';
	import { circularWipe } from '@/lib/circularWipe';
	import { textareaSparkles } from '@/lib/textareaSparkles';
	import { submitSparkles } from '@/lib/emojiParticles';
	import Richtext, { hasChunks } from '../cke/Richtext.svelte';

	let {
		title,
		intro,
	}: {
		title?: string | null;
		intro?: { chunks?: any[] } | null;
	} = $props();

	let name = $state('');
	let email = $state('');
	let phone = $state('');

	let vision = $state('');
	let company = $state('');
	let sending = $state(false);
	let sent = $state(false);
	let successMessage = $state('');
	let error = $state(false);

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (sending) return;

		sending = true;
		error = false;
		try {
			successMessage = await contact({
				name,
				email,
				phone,

				vision,
				company,
			});
			sent = true;
		} catch {
			error = true;
		} finally {
			sending = false;
		}
	}
</script>

<section
	class="contact"
	id="contact"
	use:submitSparkles
	aria-labelledby={title ? 'contact-title' : undefined}
	aria-label={title ? undefined : 'Contact form'}
>
	<div class="inner">
		<div class="copy">
			{#if title}
				<h2 id="contact-title">{title}</h2>
			{/if}
			{#if hasChunks(intro)}
				<div class="intro">
					<Richtext chunks={intro?.chunks ?? []} />
				</div>
			{/if}
		</div>

		{#if sent}
			<p class="feedback success" role="status">{successMessage}</p>
		{:else}
			<form onsubmit={submit}>
				<div class="field full">
					<label for="contact-name">Name*</label>
					<input
						id="contact-name"
						type="text"
						name="name"
						autocomplete="name"
						required
						bind:value={name}
					/>
				</div>

				<div class="field">
					<label for="contact-email">Email*</label>
					<input
						id="contact-email"
						type="email"
						name="email"
						autocomplete="email"
						required
						bind:value={email}
					/>
				</div>

				<div class="field">
					<label for="contact-phone">Contact Number*</label>
					<input
						id="contact-phone"
						type="tel"
						name="phone"
						autocomplete="tel"
						required
						bind:value={phone}
					/>
				</div>

				<div class="field full">
					<label for="contact-vision">
						Tell me about your vision
					</label>
					<textarea
						id="contact-vision"
						name="vision"
						rows="4"
						bind:value={vision}
						use:textareaSparkles
					></textarea>
				</div>

				<div class="honeypot">
					<label for="contact-company">Company</label>
					<input
						id="contact-company"
						name="company"
						type="text"
						autocomplete="off"
						tabindex="-1"
						bind:value={company}
					/>
				</div>

				{#if error}
					<p class="feedback full" role="alert">
						Your message could not be sent. Please try again.
					</p>
				{/if}

				<button
					class="submit full"
					type="submit"
					disabled={sending}
					use:circularWipe
				>
					<span class="wipe-content">
						{sending ? 'Sending…' : 'Submit'}
					</span>
				</button>
			</form>
		{/if}
	</div>
</section>

<style lang="scss">
	@use '../../sass/circularWipe' as *;

	.contact {
		min-height: 100svh;
		padding: clamp(9rem, 16vh, 12rem) var(--frame-inset)
			clamp(6rem, 12vh, 9rem);
		background: #f7f6f2;
		color: #171717;
	}

	.inner {
		max-width: 80rem;
		margin-inline: auto;
	}

	h2 {
		font-size: clamp(3.5rem, 8vw, 7rem);
		font-weight: 400;
		line-height: 0.95;
	}

	.copy {
		margin-bottom: 2rem;
	}

	.intro {
		font-size: clamp(1rem, 1.4vw, 1.125rem);
		line-height: 1.5;
		overflow-wrap: anywhere;
	}

	h2 + .intro {
		margin-top: 1.5rem;
	}

	form {
		position: relative;
		display: grid;
		gap: clamp(1.25rem, 3vh, 2rem) clamp(1rem, 3vw, 2rem);
	}

	.full {
		grid-column: 1 / -1;
	}

	label {
		display: block;
		font-weight: 600;
	}

	input,
	textarea {
		display: block;
		width: 100%;
		min-height: 2.25rem;
		padding: 0.3rem 0;
		border: 0;
		border-bottom: 1px solid currentColor;
		border-radius: 0;
		background: transparent;
		color: inherit;
		font: inherit;
	}

	input:focus-visible,
	textarea:focus-visible {
		outline: none;
		border-bottom-width: 2px;
	}

	textarea {
		resize: vertical;
	}

	.submit {
		@include circular-wipe;
		--wipe-fill: #000;
		min-height: 3.75rem;
		border: 2px solid currentColor;
		background: #f7f6f2;
		color: inherit;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}

	@media (hover: hover) {
		.submit:not(:disabled):hover::before {
			transform: translate(-50%, -50%) scale(1);
		}
	}

	.submit:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 4px;
	}

	.submit:focus-visible::before {
		transform: translate(-50%, -50%) scale(1);
	}

	.submit:disabled {
		opacity: 0.5;
		cursor: wait;
	}

	.feedback {
		font-weight: 600;
	}

	.feedback:not(.success) {
		color: #b02c2c;
	}

	.honeypot {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}

	@include tablet {
		form {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@include desktop {
		textarea {
			resize: none;
		}

		.contact {
			display: flex;
			width: 100vw;
			height: 100svh;
			min-height: 0;
			padding-block: clamp(6rem, 10vh, 8rem);
			align-items: center;
			flex: 0 0 100vw;
		}

		.inner {
			display: grid;
			width: 100%;
			grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
			align-items: center;
			gap: clamp(2rem, 5vw, 5rem);
		}

		.copy {
			margin-bottom: 0;
		}

		h2 {
			font-size: clamp(3rem, 6vw, 6rem);
		}
	}
</style>
