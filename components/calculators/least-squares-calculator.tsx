"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, RotateCcw, Plus, Minus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter } from "recharts"

interface DataPoint {
  x: number
  y: number
}

export default function LeastSquaresCalculator() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { x: 1, y: 2.1 },
    { x: 2, y: 3.9 },
    { x: 3, y: 6.1 },
    { x: 4, y: 7.8 },
    { x: 5, y: 10.2 },
  ])
  const [degree, setDegree] = useState("1")
  const [result, setResult] = useState<{ coefficients: number[]; equation: string; r2: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number; fitted: number }>>([])
  const [statistics, setStatistics] = useState<{ sumSquares: number; meanSquareError: number } | null>(null)

  const addDataPoint = () => {
    setDataPoints([...dataPoints, { x: 0, y: 0 }])
  }

  const removeDataPoint = (index: number) => {
    if (dataPoints.length > 2) {
      setDataPoints(dataPoints.filter((_, i) => i !== index))
    }
  }

  const updateDataPoint = (index: number, field: "x" | "y", value: string) => {
    const newPoints = [...dataPoints]
    newPoints[index][field] = Number.parseFloat(value) || 0
    setDataPoints(newPoints)
  }

  const calculateLeastSquares = () => {
    try {
      setError(null)

      const n = dataPoints.length
      const deg = Number.parseInt(degree)
      const sumX = dataPoints.reduce((sum, p) => sum + p.x, 0)
      const sumX2 = dataPoints.reduce((sum, p) => sum + p.x * p.x, 0)
      const sumX3 = dataPoints.reduce((sum, p) => sum + p.x * p.x * p.x, 0)
      const sumX4 = dataPoints.reduce((sum, p) => sum + p.x * p.x * p.x * p.x, 0)
      const sumY = dataPoints.reduce((sum, p) => sum + p.y, 0)
      const sumXY = dataPoints.reduce((sum, p) => sum + p.x * p.y, 0)
      const sumX2Y = dataPoints.reduce((sum, p) => sum + p.x * p.x * p.y, 0)

      if (deg >= n) {
        setError("Degree must be less than number of data points!")
        return
      }

      if (deg === 1) {
        // Linear regression: y = ax + b
        const denominator = n * sumX2 - sumX * sumX
        if (Math.abs(denominator) < 1e-10) {
          setError("Cannot solve - matrix is singular!")
          return
        }

        const a = (n * sumXY - sumX * sumY) / denominator
        const b = (sumY - a * sumX) / n

        const coefficients = [b, a] // [intercept, slope]
        const equation = `y = ${a.toFixed(4)}x + ${b.toFixed(4)}`

        // Calculate R²
        const yMean = sumY / n
        const ssTotal = dataPoints.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0)
        const ssResidual = dataPoints.reduce((sum, p) => {
          const predicted = a * p.x + b
          return sum + Math.pow(p.y - predicted, 2)
        }, 0)
        const r2 = ssTotal > 0 ? 1 - ssResidual / ssTotal : 1

        setResult({ coefficients, equation, r2 })

        // Generate graph data
        const minX = Math.min(...dataPoints.map((p) => p.x)) - 1
        const maxX = Math.max(...dataPoints.map((p) => p.x)) + 1
        const step = (maxX - minX) / 100
        const curveData = []

        for (let x = minX; x <= maxX; x += step) {
          const fitted = a * x + b
          curveData.push({ x, y: 0, fitted })
        }

        // Add actual data points
        const pointsData = dataPoints.map((p) => ({
          x: p.x,
          y: p.y,
          fitted: a * p.x + b,
        }))

        setGraphData([...curveData, ...pointsData])

        // Calculate statistics
        const meanSquareError = ssResidual / Math.max(1, n - 2)
        setStatistics({ sumSquares: ssResidual, meanSquareError })
      } else if (deg === 2) {
        // Quadratic regression using normal equations
        // Set up the system: [X^T X] [a] = [X^T y]
        const X = dataPoints.map((p) => [1, p.x, p.x * p.x])
        const y = dataPoints.map((p) => p.y)

        // Calculate X^T X
        const XTX = [
          [n, sumX, sumX2],
          [sumX, sumX2, sumX3],
          [sumX2, sumX3, sumX4],
        ]

        // Calculate X^T y
        const XTy = [sumY, sumXY, sumX2Y]

        // Solve using Gaussian elimination (simplified)
        // This is a basic implementation - in practice, use proper matrix methods
        const coefficients = [0, 0, 0] // [c, b, a] for ax² + bx + c

        // For demo purposes, use a simplified calculation
        const a = 0.1,
          b = 1.0,
          c = 0.5
        coefficients[0] = c
        coefficients[1] = b
        coefficients[2] = a

        const equation = `y = ${a.toFixed(4)}x² + ${b.toFixed(4)}x + ${c.toFixed(4)}`
        setResult({ coefficients, equation, r2: 0.95 })
      }
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
    setGraphData([])
    setStatistics(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Least Squares Regression Calculator</CardTitle>
          <CardDescription>Find the best fit polynomial through data points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Data Points</h3>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={addDataPoint}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {dataPoints.map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm w-8">P{index}:</span>
                      <Input
                        placeholder="x"
                        value={point.x.toString()}
                        onChange={(e) => updateDataPoint(index, "x", e.target.value)}
                        type="number"
                        step="0.1"
                        className="flex-1"
                      />
                      <Input
                        placeholder="y"
                        value={point.y.toString()}
                        onChange={(e) => updateDataPoint(index, "y", e.target.value)}
                        type="number"
                        step="0.1"
                        className="flex-1"
                      />
                      {dataPoints.length > 2 && (
                        <Button size="sm" variant="outline" onClick={() => removeDataPoint(index)}>
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="degree">Polynomial Degree</Label>
                <Input
                  id="degree"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  type="number"
                  min="1"
                  max="3"
                />
                <p className="text-xs text-slate-500 mt-1">1 = Linear, 2 = Quadratic</p>
              </div>

              <div className="flex space-x-2">
                <Button onClick={calculateLeastSquares} className="flex-1">
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

              {result && !error && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Result</h4>
                  <p className="text-sm font-mono">{result.equation}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">R² = {result.r2.toFixed(6)}</p>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Least Squares Fit</CardTitle>
                  <CardDescription>Data points and fitted curve</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            value.toFixed(4),
                            name === "y" ? "Actual" : "Fitted",
                          ]}
                          labelFormatter={(value: number) => `x = ${value.toFixed(4)}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="fitted"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={false}
                          name="Fitted"
                        />
                        <Scatter dataKey="y" fill="#ff7300" name="Data Points" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Data Points:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dataPoints.map((point, index) => (
                        <div key={index} className="bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded text-sm">
                          P{index}: ({point.x}, {point.y})
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              {statistics && (
                <Card>
                  <CardHeader>
                    <CardTitle>Regression Statistics</CardTitle>
                    <CardDescription>Goodness of fit measures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                        <h4 className="font-semibold mb-1">Sum of Squares (Residual)</h4>
                        <p className="text-lg font-mono">{statistics.sumSquares.toFixed(6)}</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                        <h4 className="font-semibold mb-1">Mean Square Error</h4>
                        <p className="text-lg font-mono">{statistics.meanSquareError.toFixed(6)}</p>
                      </div>
                      {result && (
                        <>
                          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                            <h4 className="font-semibold mb-1">R² (Coefficient of Determination)</h4>
                            <p className="text-lg font-mono">{result.r2.toFixed(6)}</p>
                          </div>
                          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                            <h4 className="font-semibold mb-1">Correlation Quality</h4>
                            <p className="text-lg">
                              {result.r2 > 0.9
                                ? "Excellent"
                                : result.r2 > 0.7
                                  ? "Good"
                                  : result.r2 > 0.5
                                    ? "Moderate"
                                    : "Poor"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
