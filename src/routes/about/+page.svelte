<script lang="ts">
  import NiceLink from "$lib/components/NiceLink.svelte";
</script>

<div class="prose">
  <h1>
    About This Website
  </h1>
  <p>
    This website offers banks of popular speedcubing algorithm sets as well as a spaced repetition trainer for memorizing algorithms. Open source and made by Kepler Boyce using SvelteKit. You can check out the codebase here:
  </p>
  <NiceLink href="https://github.com/KeplerBoyce/alg-trainer">
    https://github.com/keplerboyce/alg-trainer
  </NiceLink>
  <h2>
    Spaced Repetition System
  </h2>
  <p>
    The concept is that you are given a particular algorithm, you try to recall the solution, and then you rate how well you were able to recall the solution using one the four options at the bottom of the screen: Didn't know, Hard, Good, or Easy. Based on which option you select, your "knowledge level" for that algorithm is adjusted accordingly, and the trainer will prioritize testing you on algorithms for which you have a lower knowledge level. This means that you will naturally end up getting more practice with the algorithms you're struggling with, making the learning process more efficient.
  </p>
  <p>
    If you're curious about the specifics of how the knowledge levels are updated, the system is currently pretty simple: Didn't know divides the knowledge level by 10, Hard subtracts 10, Good adds 5, and Easy adds 20. I think there are systems that are a lot more advanced than this (e.g. using time and incorporating some kind of exponential increase in the test spacing) but this seemed good enough for cubing algorithms.
  </p>
  <h2>
    Using The Trainer
  </h2>
  <p>
    On the "Trainer" page, select the algorithms you want to train from the sidebar on the right. This sidebar shows all of the available algorithm sets and their subsets, and you can expand the dropdown menus to see pictures of the individual cases as well. You can either click on individual cases to select them or use the "select all" buttons to choose entire sets or subsets.
  </p>
  <p>
    Once you have chosen the bank of algorithms you would like to train, the trainer will test you on the case that currently has the lowest knowledge level. A scramble to set up the cube for that particular case will be shown. The scrambles are randomized as much as possible to fully test your case recognition—for example, if a COLL case is selected, it will randomize the edge permutation and AUF to make sure you aren't accidentally recognizing by edge stickers.
  </p>
  <h2>
    Tips and Tricks
  </h2>
  <p>
    There are some keyboard shortcuts that you may find convenient to speed up the training system. They're all displayed on the buttons: The spacebar reveals the solution to the current case and the 1, 2, 3, and 4 number keys select the Didn't know, Hard, Good, and Easy options respectively (and also advance to the next case).
  </p>
</div>
