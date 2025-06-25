<script lang="ts">
  import Alg from "./Alg.svelte";

  export let alg: string;
  export let name: string;
  export let callback: () => void;
</script>

<button on:click={callback}>
  <div class="transition-transform p-2 hover:bg-slate-100 active:bg-slate-200 w-min">
    <Alg alg={alg} netStyle="LL" name={name} hideSolution small />
  </div>
</button>
