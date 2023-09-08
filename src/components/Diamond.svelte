<script>
    import * as d3 from "d3";

	import AxisY from './AxisY.svelte';
	import AxisX from './AxisX.svelte';
    import Grid from './Grid.svelte'

    export let diamond_dat;
    
    import Tooltip from "$components/Tooltip.svelte";

    const margin = {
        innerTop: 70,
        innerRight: 70,
        diamondTop: 20,
        diamondRight: 20
    };
    
    let height = 600;
	let width = 600;
    
    
    const innerHeight = height - margin.innerTop - margin.innerRight;   
    const diamondHeight = innerHeight - margin.diamondTop - margin.diamondRight;

    const ncells = d3.max(diamond_dat, d => d.x1)
    const max_xy   = d3.max(diamond_dat, d => d.x1)
	const max_rank = d3.max(diamond_dat, (d) => d.rank_L[1]);

    const xyDomain = [1, 10**Math.ceil(Math.max(Math.log10(max_rank))-1)];
    
    let xy  = d3.scaleBand().domain(d3.range(60)).range([0, diamondHeight])
    let wxy  = d3.scaleBand().domain(d3.range(60)).range([0, innerHeight+margin.diamondTop])
	
    let logScale = d3.scaleLog().domain(xyDomain).range([0, innerHeight-margin.diamondTop]).nice()
    
    const linScale = d3.scaleLinear()
                         .domain([0,ncells-1])
                         .range([0, innerHeight])
    
    let color_scale = d3.scaleSequentialLog()
                        .domain([max_xy, 1])
                        .interpolator(d3.interpolateInferno)
    

    // Bg color
	const blue_triangle = [
		{"x":max_xy, "y":max_xy}, {"x":0, "y":0}, {"x":0, "y":max_xy}
	].map(d => [wxy(d.x), wxy(d.y)].join(',')).join(" ")

    const grey_triangle = [
        {"x":max_xy, "y":max_xy}, {"x":0, "y":0}, {"x":max_xy, "y":0}
	].map(d => [wxy(d.x), wxy(d.y)].join(',')).join(" ")

    let hoveredData;
</script>

<div
  class="chart-container"
  bind:clientWidth={width}
>
    <svg {width} {height} transform="translate(0 200) scale (-1,1) rotate(45)">
        <g class='inner-chart' transform="translate({margin.innerRight}, {margin.innerTop})">
            <polygon points={blue_triangle} fill="#89CFF0" fill-opacity=0.2 stroke="black" stroke-width=0.5/>
            <polygon points={grey_triangle} fill="grey" fill-opacity=0.2 stroke="black" stroke-width=0.5/>
            
            <Grid height={innerHeight-margin.diamondTop} {wxy} {ncells} scale={linScale}></Grid>
            
            <AxisY height={innerHeight-margin.diamondTop} scale={logScale}/>
            <AxisX height={innerHeight-margin.diamondTop} scale={logScale}/>
            
            <!-- MAIN PLOT -->
            {#each diamond_dat as d}
                <rect
                    x={xy(d.x1)}
                    y={xy(d.y1)}
                    width={xy.bandwidth()}
                    height={xy.bandwidth()}
                    fill={color_scale(d.value)}
                    stroke="black"
                    stroke-width=0.2
                    on:mouseover={() => {
                        hoveredData = d;
                    }}
                    on:focus={() => {
                        hoveredData = d;
                    }}
                />
            {/each}
        </g>
    </svg>
    <!-- {#if hoveredData}
         <Tooltip scale={xy} {width} data={hoveredData} />
    {/if} -->
</div>

<style>
    .chart-container {
        position: relative;
    }
</style>
