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
  <p>
    This system was heavily inspired by Anki, as spaced repetition systems are very popular for learning and memorizing big amounts of information. So, I figured it would probably be pretty good for learning cubing algs as well.
  </p>

  <h2>
    Using The Trainer
  </h2>
  <p>
    On the "Trainer" page, select the algorithms you want to train from the sidebar on the right. This sidebar shows all of the available algorithm sets and their subsets, and you can expand the dropdown menus to see pictures of the individual cases as well. You can either click on individual cases to select them or use the "select all" buttons to choose entire sets or subsets.
  </p>
  <p>
    Once you have chosen the bank of algorithms you would like to train, the trainer will test you on the case that currently has the lowest knowledge level. A scramble to set up the cube for that particular case will be shown. The scrambles are randomized as much as possible to fully test your case recognition—for example, if a COLL case is selected, it will randomize the edge permutation and AUF to make sure you aren't accidentally recognizing by edge stickers and learning only one orientation.
  </p>
  <p>
    Note that this means the cube may not be entirely solved after applying the solution—for a COLL case, for example, you will be left with a random EPLL case after applying the solution, consistent with how it would look when you use COLL in a real solve. If you're training only COLL cases, this is perfectly fine, since having a random edge permutation won't mess up the next case's setup. However, if you mix cases from multiple different algsets in your training selection, this will cause issues. For example, training a PLL case requires the last layer to be completely solved before applying the setup scramble, which isn't guaranteed if you just did an OLL or COLL case right before. If you would like to mix together multiple algsets and are fine with less-complete recognition practice, you can change the randomization option for that algset in the Alg List page as explained later.
  </p>

  <h2>
    Trainer Keyboard Shortcuts
  </h2>
  <p>
    On desktop, there are some keyboard shortcuts that you may find convenient to speed up the training system. They're all displayed on the buttons: the spacebar reveals the solution to the current case and the 1, 2, 3, and 4 number keys select the Didn't know, Hard, Good, and Easy options respectively (and also advance to the next case).
  </p>

  <h2>
    Adding and Editing Algsets
  </h2>
  <p>
    On the Alg List page, you can see a simple list of every algset and all of their subsets offered. You can use this if there is a particular case you want to see the solution for or if you want to create your own algsets or adjust existing ones.
  </p>

  <p>
    To create a new algset, use the button at the bottom of the list on the Alg List page. This will open a popup modal where you can specify the subsets you want to define for your algset and type in all of the algorithms (i.e. solutions for the cases) in each subset. All basic 3x3 move notations are supported: FRUBLD face turns, MSE slice turns, frubld wide turns, and xyz cube rotations, with ' or 2 to designate CCW or 180 degree turns. There is also an option to duplicate an existing algset, e.g. if you would like to make adjustments to one of the provided algsets.
  </p>
  <p>
    The "cube net" option selects the style of the net in the trainer when that case is selected: Full shows all six faces of the cube, Last Layer shows only the top face and stickers around the sides of the top layer, and Roux shows the same as Last Layer but with the bottom M slice edges included as well.
  </p>
  <p>
    The "stickers shown" option selects which stickers to include vs. gray out in the cube net. For example, you don't need to know what all of the non-top-face stickers are for an OLL case (and they make it kind of hard to see the cases in the pictures) so all of those stickers are grayed out. Default has no blank stickers, Last Layer makes the middle and bottom layers blank, COLL additionally makes the side stickers of the last layer edges blank, and OLL additionally makes all of the side stickers of the last layer blank.
  </p>
  <p>
    Lastly, the "randomization" option selects how much randomization can be applied to the cases in your algset. As said above, when the trainer generates a setup scramble for each case, it will apply this randomization to make sure you're learning full recognition for every case. For example, OLL deals only with piece orientations, so we can apply a random piece permutation in the setup of the case to randomize the appearance of the case as much as possible. The AUF option will apply only a random U move, the EPLL option will additionally apply a random edge permutation, and the PLL option will apply a random full last layer permutation.
  </p>
  <p>
    For every algset besides the default provided ones, there is also an "edit" button on this page, which will allow you to make changes to any of the subsets and algorithms or any of these other settings later.
  </p>
</div>
