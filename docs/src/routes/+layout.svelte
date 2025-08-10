<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="topnav">
	<a class="brand" href="/">8-bit Bootcamp</a>
	<a href="/">GDD</a>
	<a href="/early-game">Early Game</a>
	<a href="/pipeline">3D → Sprite</a>
	<a href="/characters">Characters</a>
</nav>

{@render children?.()}
