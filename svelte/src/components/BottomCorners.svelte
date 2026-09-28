<div class="bottom-corners" aria-hidden="true">
	<span class="corner left"></span>
	<span class="corner right"></span>
</div>

<style lang="scss">
	.bottom-corners {
		position: fixed;
		z-index: 9;
		right: var(--frame-inset);
		bottom: var(--frame-inset);
		left: var(--frame-inset);
		height: var(--corner-size);
		color: #fff;
		mix-blend-mode: difference;
		pointer-events: none;
	}

	.corner {
		position: absolute;
		bottom: 0;
		width: var(--corner-size);
		height: var(--corner-size);
		border-bottom: 1px solid currentColor;
	}

	.left {
		left: 0;
		border-left: 1px solid currentColor;
	}

	.right {
		right: 0;
		border-right: 1px solid currentColor;
	}
</style>
