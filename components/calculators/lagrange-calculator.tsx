"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw, Plus, Minus } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DataPoint {
  x: number
  y: number
}

export default function LagrangeCalculator() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 5 },
  ])
  const [xInterp, setXInterp] = useState("1.5")
  const [result, setResult] = useState<number | null>(null)
  const [polynomial, setPolynomial] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])
  const [lagrangeBasis, setLagrangeBasis] = useState<Array<{ i: number; Li: string; value: number }>>([])

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

  const calculateLagrangeBasis = (i: number, x: number): number => {
    let Li = 1
    for (let j = 0; j < dataPoints.length; j++) {
      if (i !== j) {
        Li *= (x - dataPoints[j].x) / (dataPoints[i].x - dataPoints[j].x)
      }
    }
    return Li
  }

  const evaluateLagrangePolynomial = (x: number): number => {
    let result = 0
    for (let i = 0; i < dataPoints.length; i++) {
      result += dataPoints[i].y * calculateLagrangeBasis(i, x)
    }
    return result
  }

  const calculateLagrangeInterpolation = () => {
    try {
      setError(null)

      const xVal = Number.parseFloat(xInterp)

      // Check for duplicate x values
      const xValues = dataPoints.map((p) => p.x)
      const uniqueX = new Set(xValues)
      if (uniqueX.size !== xValues.length) {
        setError("Duplicate x values are not allowed!")
        return
      }

      // Calculate interpolated value
      const yInterp = evaluateLagrangePolynomial(xVal)
      setResult(yInterp)

      // Calculate Lagrange basis functions at interpolation point
      const basis = dataPoints.map((point, i) => {
        const Li_value = calculateLagrangeBasis(i, xVal)
        let Li_formula = ""

        for (let j = 0; j < dataPoints.length; j++) {
          if (i !== j) {
            if (Li_formula) Li_formula += " × "
            Li_formula += `(x-${dataPoints[j].x})/(${dataPoints[i].x}-${dataPoints[j].x})`
          }
        }

        return {
          i: i,
          Li: Li_formula,
          value: Li_value,
        }
      })
      setLagrangeBasis(basis)

      // Generate polynomial string
      let polyStr = ""
      for (let i = 0; i < dataPoints.length; i++) {
        if (i > 0) polyStr += " + "
        polyStr += `${dataPoints[i].y}L${i}(x)`
      }
      setPolynomial(polyStr)

      // Generate graph data
      const minX = Math.min(...dataPoints.map((p) => p.x), xVal) - 1
      const maxX = Math.max(...dataPoints.map((p) => p.x), xVal) + 1
      const step = (maxX - minX) / 200
      const curveData = []

      for (let x = minX; x <= maxX; x += step) {
        curveData.push({ x, y: evaluateLagrangePolynomial(x) })
      }

      setGraphData(curveData)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
    setGraphData([])
    setLagrangeBasis([])
    setPolynomial("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lagrange Interpolation Calculator</CardTitle>
          <CardDescription>Polynomial interpolation using Lagrange basis functions</CardDescription>
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
                <Button onClick={calculateLagrangeInterpolation} className="flex-1">
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
                    P({xInterp}) ≈ {result.toFixed(6)}
                  </p>
                  {polynomial && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                      <p>Polynomial: {polynomial}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Lagrange Interpolation Graph</CardTitle>
                  <CardDescription>Polynomial curve through data points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [value.toFixed(4), "P(x)"]}
                          labelFormatter={(value: number) => `x = ${value.toFixed(4)}`}
                        />
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Data Points:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dataPoints.map((point, index) => (
                        <div key={index} className="bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded text-sm">
                          P{index}: ({point.x}, {point.y})
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lagrange Basis Functions */}
              {lagrangeBasis.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Lagrange Basis Functions</CardTitle>
                    <CardDescription>L_i(x) values at interpolation point</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>i</TableHead>
                            <TableHead>L_i(x)</TableHead>
                            <TableHead>L_i({xInterp})</TableHead>
                            <TableHead>y_i × L_i({xInterp})</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lagrangeBasis.map((basis) => (
                            <TableRow key={basis.i}>
                              <TableCell>{basis.i}</TableCell>
                              <TableCell className="font-mono text-xs">{basis.Li}</TableCell>
                              <TableCell>{basis.value.toFixed(6)}</TableCell>
                              <TableCell>{(dataPoints[basis.i].y * basis.value).toFixed(6)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <p className="text-sm">
                        <strong>Final Result:</strong> P({xInterp}) = Σ y_i × L_i({xInterp}) = {result?.toFixed(6)}
                      </p>
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
