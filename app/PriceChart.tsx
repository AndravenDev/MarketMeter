'use client'

import { useEffect, useRef } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'

const MIN_GRID_DISTANCE: Record<string, number> = {
  day: 80,
  week: 140,
  month: 200,
  year: 100,
}

interface PriceChartProps {
  labels: string[]
  prices: number[]
  range: string
}

export default function PriceChart({ labels, prices, range }: PriceChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const root = am5.Root.new(chartRef.current)
    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
      })
    )

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'label',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: MIN_GRID_DISTANCE[range] ?? 100 }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    )

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
        numberFormat: "'$'#,###",
      })
    )

    const series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'Bitcoin Price (USD)',
        xAxis,
        yAxis,
        valueYField: 'price',
        categoryXField: 'label',
        tooltip: am5.Tooltip.new(root, {
          labelText: '${valueY.formatNumber("#,###.00")}',
        }),
        fill: am5.color(0xf7931a),
        stroke: am5.color(0xf7931a),
      })
    )

    series.fills.template.setAll({ fillOpacity: 0.2, visible: true })

    const chartData = labels.map((label, i) => ({ label, price: prices[i] }))
    xAxis.data.setAll(chartData)
    series.data.setAll(chartData)

    chart.set('cursor', am5xy.XYCursor.new(root, { behavior: 'zoomX' }))
    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, { orientation: 'horizontal' })
    )

    series.appear(1000)
    chart.appear(1000, 100)

    return () => root.dispose()
  }, [labels, prices])

  return <div ref={chartRef} style={{ width: '100%', height: 400 }} />
}
