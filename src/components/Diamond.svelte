<script>
    import * as d3 from "d3";

	import AxisY from './AxisY.svelte';
	import AxisX from './AxisX.svelte';
    import Grid from './Grid.svelte'

    export let diamond_dat;

    import { rin } from "$components/utils_helpers.js"
    
    import Tooltip from "$components/Tooltip.svelte";
    import BarChart from "./BarChart.svelte";
    import { fly } from "svelte/transition";

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

    const bin_size = 1.5

    const buckets = d3.range(0, ncells, bin_size)
    const center_y = d3.scaleThreshold()
                       .domain(buckets)
                       .range(buckets.map(d => d-(bin_size/2)));

    let xy  = d3.scaleBand()
                .domain(d3.range(60))
                .range([0, diamondHeight])


    let xyc = d3.scaleBand()
                .domain(diamond_dat.map(d=>center_y(d.coord_on_diag)))
                .range([0, width])
    
    let wxy  = d3.scaleBand()
                 .domain(d3.range(60))
                 .range([0, innerHeight+margin.diamondTop])
	
    let logScale = d3.scaleLog() 
                     .domain(xyDomain)
                     .range([0, innerHeight-margin.diamondTop])
                     .nice()
    
    let linScale = d3.scaleLinear()
                         .domain([0,ncells-1])
                         .range([0, innerHeight])
    
    let color_scale = d3.scaleSequentialLog()
                        .domain([max_xy, 1])
                        .interpolator(d3.interpolateInferno)
    
    function get_chosen_types () {
        const cummulative_bin = d3.range(0, ncells, bin_size)
        const relevant_types = []
        
        
        for (let sys of ["right", "left"]) {
            
            for (let i=1; i < cummulative_bin.length; i++) {
            
            const filtered_dat = diamond_dat.filter(d => d.value > 0 && d.which_sys == sys)
                                            .filter(d => d.coord_on_diag >= cummulative_bin[i-1] && 
                                                    d.coord_on_diag < cummulative_bin[i])
            
            
            if (filtered_dat.length > 0) {
                const cos_dists = filtered_dat.map(d => d.cos_dist)
                
                const max_dist = cos_dists.reduce((a, b) => { return Math.max(a, b) })
                const max_dist_idx = cos_dists.indexOf(max_dist)
                const name = d3.shuffle(filtered_dat[max_dist_idx]['types'].split(","))[0]        
                relevant_types.push(name)
            }
        }
        }
        return relevant_types
        }

    let chosen_types = get_chosen_types()

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
    <svg {width} {height} transform="translate(60 130) scale (-1,1) rotate(45)">
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
                    opacity = {d.value === null ? 0 : 1}
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
            {#each diamond_dat.filter(d => rin(chosen_types, d.types.split(",")).some((x) => x === true)) as d}
                <g class="diamond-lab" 
                   transform="
                    scale(1,-1) 
                    rotate(-90) 
                    rotate(-45, {xy(d.x1)}, {xy(d.y1)}) 
                    translate({d.which_sys === "right" ? xy(Math.sqrt(d.cos_dist))*1.5 : -xy(Math.sqrt(d.cos_dist))*1.5}, 0)
                   ">
                    <text 
                        x={xy(d.x1)}
                        y={Number.isInteger(d.coord_on_diag) ? xy(d.y1) : xy(d.y1)-1}
                        dx={d.x1 - d.y1 <= 0 ? "start" : "end"}
                        dy={20}
                        font-size="12"
                        text-anchor={d.x1 - d.y1 <= 0 ? "start" : "end"}
                        opacity={d.types == "" ? 0 : 1}
                        >{d.types.split(",")[0]}</text>
                </g>
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
