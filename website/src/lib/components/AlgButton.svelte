<script lang="ts">
  import Alg from "./Alg.svelte";

  export let alg: string;
  export let name: string;
  export let callback: () => void;
</script>

<button on:click={callback}>
  <div class="bg-slate-100 drop-shadow-lg p-4 rounded-lg border transition-transform hover:scale-105 active:bg-slate-200">
    <Alg alg={alg} netStyle="LL" name={name} />
  </div>
</button>
