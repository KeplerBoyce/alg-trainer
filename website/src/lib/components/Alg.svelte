<script lang="ts">
  import { type Algorithm, type Color } from "$lib/types";
  import { getEdgeColor } from "$lib/helpers";
  import { COLOR_MAP } from "$lib/constants";

  export let alg: Algorithm;
  export let name: string | undefined;

  const squareStyle = (color: Color) => {
    return `w-8 h-8 border border-black rounded-md ${COLOR_MAP[color]}`
  }

  const horizStyle = (color: Color) => {
    return `w-8 h-4 border border-black rounded-md ${COLOR_MAP[color]}`
  }

  const vertStyle = (color: Color) => {
    return `w-4 h-8 border border-black rounded-md ${COLOR_MAP[color]}`
  }

  const emptyStyle = () => {
    return "w-4 h-4";
  }
</script>

<div class="flex flex-col gap-4 w-min">
  <div class="flex gap-4">
    <div class="flex gap-0.5">
      <div class="flex flex-col gap-0.5">
        <div class={emptyStyle()}></div>
        <div class={vertStyle("RED")}></div>
        <div class={vertStyle(getEdgeColor(alg.state.topLeft, false))}></div>
        <div class={vertStyle("RED")}></div>
        <div class={emptyStyle()}></div>
      </div>
      <div class="flex flex-col gap-0.5">
        <div class={horizStyle("BLUE")}></div>
        <div class={squareStyle("YELLOW")}></div>
        <div class={squareStyle(getEdgeColor(alg.state.topLeft, true))}></div>
        <div class={squareStyle("YELLOW")}></div>
        <div class={horizStyle("GREEN")}></div>
      </div>
      <div class="flex flex-col gap-0.5">
        <div class={horizStyle(getEdgeColor(alg.state.topBack, false))}></div>
        <div class={squareStyle(getEdgeColor(alg.state.topBack, true))}></div>
        <div class={squareStyle("YELLOW")}></div>
        <div class={squareStyle(getEdgeColor(alg.state.topFront, true))}></div>
        <div class={horizStyle(getEdgeColor(alg.state.topFront, false))}></div>
      </div>
      <div class="flex flex-col gap-0.5">
        <div class={horizStyle("BLUE")}></div>
        <div class={squareStyle("YELLOW")}></div>
        <div class={squareStyle(getEdgeColor(alg.state.topRight, true))}></div>
        <div class={squareStyle("YELLOW")}></div>
        <div class={horizStyle("GREEN")}></div>
      </div>
      <div class="flex flex-col gap-0.5">
        <div class={emptyStyle()}></div>
        <div class={vertStyle("ORANGE")}></div>
        <div class={vertStyle(getEdgeColor(alg.state.topRight, false))}></div>
        <div class={vertStyle("ORANGE")}></div>
        <div class={emptyStyle()}></div>
      </div>
    </div>

    <div class="flex flex-col gap-0.5">
      <div class={horizStyle(getEdgeColor(alg.state.bottomBack, false))}></div>
      <div class={squareStyle(getEdgeColor(alg.state.bottomBack, true))}></div>
      <div class={squareStyle("WHITE")}></div>
      <div class={squareStyle(getEdgeColor(alg.state.bottomFront, true))}></div>
      <div class={horizStyle(getEdgeColor(alg.state.bottomFront, false))}></div>
    </div>
  </div>

  <div class="flex gap-2">
    {#if name}
      <p class="font-bold">
        {name}
      </p>
    {/if}
    <p class="max-w-full text-left">
      {alg.solution}
    </p>
  </div>
</div>
