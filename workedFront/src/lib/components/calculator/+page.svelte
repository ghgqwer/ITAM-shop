<script lang="ts">
	import ControlPanel from "$lib/components/ControlPanel.svelte";
	import InfoPanel from "$lib/components/InfoPanel.svelte";
	let screen: string = "";
</script>

<div class="calculator">
	<InfoPanel {screen} />
	<ControlPanel bind:screen />
</div>
<style>
	.calculator{
		width: 420px;
		height: 600px;
		background-color: black;
		margin: 150px auto;
		border-radius: 20px;
		padding: 10px;

	}
</style>
