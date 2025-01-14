<script lang="ts">
  import { type AlgWithDupes } from "$lib/types";
  import Alg from "./Alg.svelte";

  export let alg: AlgWithDupes;
  export let name: string;
</script>

<button>
  <div class="bg-slate-100 drop-shadow-lg p-4 rounded-lg border transition-transform hover:scale-105 active:bg-slate-200">
    <Alg alg={alg.normal[0]} name={name} />
  </div>
</button>
