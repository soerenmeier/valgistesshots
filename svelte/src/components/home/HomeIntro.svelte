<script lang="ts">
	let { video }: { video?: { url?: string | null }[] | null } = $props();
</script>

<section class="home-intro" aria-label="Introduction">
	{#if video?.[0]?.url}
		<video
			class="background-video"
			src={video[0].url}
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
			aria-hidden="true"
		></video>
	{/if}
</section>

<style lang="scss">
	.home-intro {
		position: relative;
		display: flex;
		min-height: 100vh;
		min-height: 100svh;
		overflow: hidden;
		background: #222;
		color: #fff;
		font-family: var(--font-sans);
		text-align: center;
		isolation: isolate;
	}

	.home-intro::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(
			180deg,
			rgb(0 0 0 / 20%),
			rgb(0 0 0 / 12%) 40%,
			rgb(0 0 0 / 65%)
		);
	}

	.background-video {
		position: absolute;
		inset: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@include desktop {
		.home-intro {
			width: 100vw;
			height: 100svh;
			min-height: 0;
			flex: 0 0 100vw;
		}
	}
</style>
