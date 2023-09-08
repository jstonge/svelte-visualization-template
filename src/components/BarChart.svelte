<script>
    import * as d3 from "d3";

    export let barData;

    const max_shift = d3.max(barData, d => Math.abs(d.metric))

    let margin = ({ top: 79, left: 40, right: 40, bottom: 10 })
	let width = 640;
    
    let yPadding = 0.2;
    
    const X = d3.map(barData,d => d.metric);
    const Y = d3.map(barData, d => d.type);
    
    let xDomain = [-max_shift*1.5, max_shift*1.5];
    let yDomain = Y;
    yDomain = new d3.InternSet(yDomain);

    const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));
    const YX = d3.rollup(I, ([i]) => X[i], i => Y[i]);
    
    const height = Math.ceil((yDomain.size + yPadding) * 25) + margin.top + margin.bottom

    const xRange = [margin.left, width - margin.right];
    const yRange = [margin.top, height - margin.bottom];
    
    const xScale = d3.scaleLinear(xDomain, xRange)
    const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
        
    const xTicks = xScale.ticks(width / 80)
    const yTicks = Array.from(yDomain)

    const colors = ["lightgrey", "lightblue"]

    console.log(barData)

    // <g class='axisY-BarChart'>
    //             {#each yTicks as name, i}
    //                 <g class="tick" transform="translate({xScale(0)}, 0)">
    //                     <text 
    //                         text-anchor={YX.get(name) > 0 ? "start" : "end"}
    //                         x={YX.get(name) > 0 ? 6 : -6 }
    //                         y={yScale(Y[i])}
    //                         dy="14"
    //                         font-size=0.7em
    //                     >{name}</text>
    //                 </g>
    //             {/each}
    //         </g>
    import {fade} from "svelte/transition"
</script>

<div
  class="chart-container"
  bind:clientWidth={width}
>
    <svg {width} {height}>
        <g class='inner-chart'>
            <g class='axis x' transform="translate(0, {margin.top})">
                {#each xTicks as tick}
                    <g class="tick">
                        <line 
                            x1={xScale(tick)} 
                            y1="0" 
                            x2={xScale(tick)}
                            y2={height - margin.top - margin.bottom} 
                            stroke="hsla(212, 10%, 53%, 1)"
                            stroke-opacity=0.2
                        >{tick}</line>
                        <text 
                        x={xScale(tick)} 
                        y="-12" 
                        font-size=0.8em
                        >{tick*100}%</text>
                    </g>
                {/each}
            </g>
            {#each barData as d, i}
                <rect
                    x={Math.min(xScale(0), xScale(d.metric))}
                    y={yScale(d.type)}
                    fill={colors[d.type[i] > 0 ? colors.length - 1 : 0]}
                    width={Math.abs(xScale(d.metric) - xScale(0))}
                    height={ yScale.bandwidth() }
                />
                <text 
                    x={Math.min(xScale(0), xScale(d.metric))}
                    y={yScale(d.type)}
                    dy="14"
                    font-size=0.7em
                >{d.type}</text>
            {/each}
        </g>
    </svg>
</div>

<style>
    .chart-container {
        position: relative;
    }
</style>
