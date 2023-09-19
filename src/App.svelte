<script>
  import { test_elem_1, test_elem_2 } from './data/data.js'
  // import mixedElems from "./components/combine_distributions.js";  
  import { combElems, RTD, myDiamond, wordShift_dat } from "./components/combine_distributions.js"
  // import Main from "./components/Main.svelte"
  
  import Hero from "./components/Hero.svelte";

  import BarChartRank from "./components/barChart_rank.svelte"
  import Diamond from "./components/Diamond.svelte";
  import Wordshift from "./components/BarChart.svelte";

  import Scrolly from "./helpers/Scrolly.svelte"

  let alpha = 0.92;
  
  const me = combElems(test_elem_1, test_elem_2)
  const rtd = RTD(me, alpha)
  const dat = myDiamond(me, rtd)
  const diamond_dat_raw = dat.counts
  const diamond_dat = diamond_dat_raw.filter(d => d.types !== "")
  
  // const me2 = combElems(test_elem_2, test_elem_1)
  // const rtd2 = RTD(me2, alpha)
  // const dat2 = myDiamond(me2, rtd2)
  // const diamond_dat_raw2 = dat2.counts
  // const diamond_dat2 = diamond_dat_raw2.filter(d => d.types !== "")
  
  // const me3 = combElems(test_elem_1, test_elem_2)
  // const rtd3 = RTD(me3, 0)
  // const dat3 = myDiamond(me3, rtd3)

  const barData = wordShift_dat(me, dat).slice(0, 30);
  // const barData2 = wordShift_dat(me3, dat3).slice(0, 30);

  let currentStep;

  let initialData = diamond_dat;
  let renderedData = initialData;
  
  let initialBarData = barData;
  let rendererBarData = initialBarData;

  // Series of if-else to play with data.
  $: {
    if (currentStep === 0) {
      renderedData = initialData.map((d => 
        ({...d, 
            x1: Math.ceil(d.coord_on_diag),
            y1: Math.ceil(d.coord_on_diag),
            value: null,
            types: ""
          })));

      rendererBarData = initialBarData.map((d => 
        ({...d, 
            metric: 0,
          })));

    } else if (currentStep === 1) {
      renderedData = initialData.map((d => 
        ({...d, 
            x1: Math.ceil(d.coord_on_diag),
            y1: Math.ceil(d.coord_on_diag),
            types: ""
          })));
      
      rendererBarData = initialBarData.map((d => 
        ({...d, 
            metric: 0
          })));

    } else if (currentStep === 2) {
      renderedData = initialData.map((d => 
          ({...d, 
            x1: d.which_sys == "left" ? Math.ceil(d.coord_on_diag) : d.x1, 
            y1: d.which_sys == "left" ? Math.ceil(d.coord_on_diag) : d.y1,
            types: d.which_sys == "left" ? "" : d.types,
          })));

      rendererBarData = initialBarData.map((d => 
            ({...d, 
                metric: d.metric < 0 ? 0 : d.metric,
              })));

    } else if (currentStep === 3) {
      renderedData = initialData;
      rendererBarData = initialBarData;
      // console.log(rendererBarData)
    }
  }

</script>

<Hero />
<main>
  <h1>Allotaxonometry for all</h1>
  <h2>Boys 1895 vs 1930</h2>
  <p>Here is the rank of the babynames for 1895</p>
  <div class="initial-chart">
    <BarChartRank barData={test_elem_1.slice(0,30)} height={300}/> 
  </div>
  <p>Here is the ranking for boy babynames in the US for 1930</p>
  <BarChartRank barData={test_elem_2.slice(0,30)} height={300}/> 
  <p>If you wanted to compare which babyname got more popular over time, how would you do it? 
     You can say that Robert is more popular than John. Then what?</p>
  
    <section>
    <div class='sticky'>
      <div class='full-dashboard' style="display:flex; gap: 3em;">
        <div> <Diamond diamond_dat={renderedData}/> </div>
        <div> <Wordshift barData={rendererBarData} /> </div>
      </div>
    </div>
    
    <div class="steps">
      <Scrolly bind:value={currentStep}>
        {#each ["The diamond plot is an histogram, where the axis are the rank of the tokens", "A perfect diagonal would be if all names were of the same rank for both years", "As you get further away from the diagonal on the right, you get the most popular boy babynames for 1930", "Finally we can put everything together, contrasting two different years in different ways"] as text, i}
        <div class='step' class:active={currentStep === i}>
          <div class="step-content">
            <p>{text}</p>
          </div>
        </div>
        {/each}
      </Scrolly>
    </div>
    <!-- <div class='reference-step'>
      {currentStep}
    </div> -->
  </section>
  <h2>Divergence</h2>
  <p>What are divergences? What are they doing down there?</p>
</main>


<style>

  :global(*) {
    font-family: Inter;
    -moz-osx-font-smoothing: grayscale;
  }
  
  main {
    text-align: center;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 120vh;
    max-width: 768px;
    padding: 20px;
    background: white;
  }

  h1 {
    margin-top: 5rem;
    font-size: 50px;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 3rem;
    color: hsla(212, 10%, 53%, 1);
  }

  p:not(:last-of-type) {
    margin-bottom: 1rem;
  }

  /* Scrollytelling stuff */

  .step {
    height: 90vh;
    opacity: 0.3;
    transition: opacity 300ms ease;

    display: flex;
    justify-content: center;
    place-items: center;
  }

  .step.active {
    opacity: 1;
  }

  .step-content {
    background-color: white;
    border: 1px solid black;
    padding: 0.75rem 1rem;
    border-radius: 3px; 
  }

  section {
    position: relative;
  }

  .steps {
    position: relative;
    z-index: 2;
  }

  .sticky {
    position: sticky;
    margin-top: 30px;
    height: 90vh;
    top: 5vh; /* (100vh - 90vh) / 2 */
    width: 100%; /* Full width */
    z-index: 1;
    margin-bottom: 1rem;
  }

  .reference-step {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 1rem;
  }

  .initial-chart {
    margin-bottom: 1rem;
  }

  /* Transition section */

  :global(rect) {
    transition: 
    x 700ms cubic-bezier(0.76, 0, 0.24, 1), 
    y 700ms cubic-bezier(0.76, 0, 0.24, 1),
    fill 700ms cubic-bezier(0.76, 0, 0.24, 1),
    width 700ms cubic-bezier(0.76, 0, 0.24, 1),
    height 700ms cubic-bezier(0.76, 0, 0.24, 1),
    opacity 700ms cubic-bezier(0.76, 0, 0.24, 1);
  }

  :global(text) {
    transition: 
      x 700ms cubic-bezier(0.76, 0, 0.24, 1), 
      y 700ms cubic-bezier(0.76, 0, 0.24, 1),
      opacity 700ms cubic-bezier(0.76, 0, 0.24, 1);
  }

  :global(tick) {
    transition: 
      x 700ms cubic-bezier(0.76, 0, 0.24, 1), 
      y 700ms cubic-bezier(0.76, 0, 0.24, 1)
      opacity 700ms cubic-bezier(0.76, 0, 0.24, 1);
  }
</style>
