<script>
    export let data;
    export let scale;
    export let width;
  
    $: x = scale(data.x1);
    $: y = scale(data.y1);
  
    let tooltipWidth;
  
    const xNudge = 15;
    const yNudge = 30;
  
    $: xPosition = x + tooltipWidth > width ? x - tooltipWidth - xNudge : x + xNudge;
    $: yPosition = y + yNudge;
    </script>
  
  <div
    class="tooltip"
    style="top: {yPosition}px; left: {xPosition}px"
    bind:clientWidth={tooltipWidth}
    >
    <h1>Types: <span>{data.types}</span></h1>
  </div>
  
  <style>
    .tooltip {
      position: absolute;
      padding: 8px 6px;
      background: white;
      box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px;
      border-radius: 3px;
      pointer-events: none;
      transition: top 300ms ease, left 300ms ease;
    }
  
    h1,
  
    h1 {
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 6px;
      width: 100%;
    }

    span {
      background: #dda0dd50;
      font-size: 80%;
      margin-left: 2px;
      padding: 2px 4px;
      display: inline-block;
      vertical-align: bottom;
      border-radius: 3px;
      color: rgba(0, 0, 0, 0.7);
    }
  </style>