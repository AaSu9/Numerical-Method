"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, RotateCcw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function LinearInterpolationCalculator() {
  const [x0, setX0] = useState("0")
  const [y0, setY0] = useState("1")
  const [x1, setX1] = useState("2")
  const [y1, setY1] = useState("3")
  const [xInterp, setXInterp] = useState("1")
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([])

  const calculateLinearInterpolation = () => {
    try {
      setError(null)

      const x0Val = Number.parseFloat(x0)
      const y0Val = Number.parseFloat(y0)
      const x1Val = Number.parseFloat(x1)
      const y1Val = Number.parseFloat(y1)
      const xVal = Number.parseFloat(xInterp)

      if (x0Val === x1Val) {
        setError("x₀ and x₁ cannot be equal!")
        return
      }

      // Linear interpolation formula: y = y0 + (y1-y0)*(x-x0)/(x1-x0)
      const yInterp = y0Val + ((y1Val - y0Val) * (xVal - x0Val)) / (x1Val - x0Val)
      setResult(yInterp)

      // Generate graph data
      const minX = Math.min(x0Val, x1Val, xVal) - 1
      const maxX = Math.max(x0Val, x1Val, xVal) + 1
      const step = (maxX - minX) / 100
      const lineData = []

      for (let x = minX; x <= maxX; x += step) {
        const y = y0Val + ((y1Val - y0Val) * (x - x0Val)) / (x1Val - x0Val)
        lineData.push({ x, y })
      }

      setGraphData(lineData)
      setPoints([
        { x: x0Val, y: y0Val },
        { x: x1Val, y: y1Val },
        { x: xVal, y: yInterp },
      ])
    } catch (err) {
      setError("Invalid input values")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
    setGraphData([])
    setPoints([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Linear Interpolation Calculator</CardTitle>
          <CardDescription>Interpolate between two points using linear approximation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Points</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="x0">x₀</Label>
                    <Input id="x0" value={x0} onChange={(e) => setX0(e.target.value)} type="number" step="0.1" />
                  </div>
                  <div>
                    <Label htmlFor="y0">y₀</Label>
                    <Input id="y0" value={y0} onChange={(e) => setY0(e.target.value)} type="number" step="0.1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="x1">x₁</Label>
                    <Input id="x1" value={x1} onChange={(e) => setX1(e.target.value)} type="number" step="0.1" />
                  </div>
                  <div>
                    <Label htmlFor="y1">y₁</Label>
                    <Input id="y1" value={y1} onChange={(e) => setY1(e.target.value)} type="number" step="0.1" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="xinterp">Interpolation Point (x)</Label>
                <Input
                  id="xinterp"
                  value={xInterp}
                  onChange={(e) => setXInterp(e.target.value)}
                  type="number"
                  step="0.1"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={calculateLinearInterpolation} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={resetCalculation}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              {result !== null && !error && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Result</h4>
                  <p className="text-lg font-mono">
                    y({xInterp}) ≈ {result.toFixed(6)}
                  </p>
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    <p>Formula: y = y₀ + (y₁-y₀)(x-x₀)/(x₁-x₀)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Linear Interpolation Graph</CardTitle>
                  <CardDescription>Visualization of interpolated line and points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [value.toFixed(4), "y"]}
                          labelFormatter={(value: number) => `x = ${value.toFixed(4)}`}
                        />
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  {points.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Points:</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded">
                          <strong>Point 1:</strong> ({points[0].x}, {points[0].y.toFixed(3)})
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded">
                          <strong>Point 2:</strong> ({points[1].x}, {points[1].y.toFixed(3)})
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded">
                          <strong>Interpolated:</strong> ({points[2].x}, {points[2].y.toFixed(3)})
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Formula Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle>Linear Interpolation Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <code className="text-lg">y = y₀ + (y₁ - y₀) × (x - x₀) / (x₁ - x₀)</code>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-2">Where:</h4>
                        <ul className="space-y-1">
                          <li>• (x₀, y₀) = First known point</li>
                          <li>• (x₁, y₁) = Second known point</li>
                          <li>• x = Point to interpolate</li>
                          <li>• y = Interpolated value</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Properties:</h4>
                        <ul className="space-y-1">
                          <li>• Exact at given points</li>
                          <li>• Simple and fast</li>
                          <li>• Linear approximation</li>
                          <li>• Good for smooth data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
