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

export default function NewtonDividedDifferenceCalculator() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { x: 0, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 5 },
    { x: 3, y: 10 },
  ])
  const [xInterp, setXInterp] = useState("1.5")
  const [result, setResult] = useState<number | null>(null)
  const [polynomial, setPolynomial] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])
  const [dividedDiffTable, setDividedDiffTable] = useState<number[][]>([])

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

  const calculateDividedDifferences = (): number[][] => {
    const n = dataPoints.length
    const table: number[][] = Array(n)
      .fill(null)
      .map(() => Array(n).fill(0))

    // First column is y values
    for (let i = 0; i < n; i++) {
      table[i][0] = dataPoints[i].y
    }

    // Calculate divided differences
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (dataPoints[i + j].x - dataPoints[i].x)
      }
    }

    return table
  }

  const evaluateNewtonPolynomial = (x: number, coefficients: number[]): number => {
    let result = coefficients[0]
    let product = 1

    for (let i = 1; i < coefficients.length; i++) {
      product *= x - dataPoints[i - 1].x
      result += coefficients[i] * product
    }

    return result
  }

  const generatePolynomialString = (coefficients: number[]): string => {
    let poly = coefficients[0].toFixed(4)

    for (let i = 1; i < coefficients.length; i++) {
      const coeff = coefficients[i]
      if (coeff >= 0) poly += " + "
      else poly += " - "

      poly += Math.abs(coeff).toFixed(4)

      for (let j = 0; j < i; j++) {
        poly += `(x - ${dataPoints[j].x})`
      }
    }

    return poly
  }

  const calculateNewtonInterpolation = () => {
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

      // Sort data points by x value
      const sortedPoints = [...dataPoints].sort((a, b) => a.x - b.x)
      setDataPoints(sortedPoints)

      // Calculate divided difference table
      const table = calculateDividedDifferences()
      setDividedDiffTable(table)

      // Extract coefficients (first row of each column)
      const coefficients = table[0]

      // Calculate interpolated value
      const yInterp = evaluateNewtonPolynomial(xVal, coefficients)
      setResult(yInterp)

      // Generate polynomial string
      const polyStr = generatePolynomialString(coefficients)
      setPolynomial(polyStr)

      // Generate graph data
      const minX = Math.min(...dataPoints.map((p) => p.x), xVal) - 1
      const maxX = Math.max(...dataPoints.map((p) => p.x), xVal) + 1
      const step = (maxX - minX) / 200
      const curveData = []

      for (let x = minX; x <= maxX; x += step) {
        curveData.push({ x, y: evaluateNewtonPolynomial(x, coefficients) })
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
    setDividedDiffTable([])
    setPolynomial("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Newton's Divided Difference Calculator</CardTitle>
          <CardDescription>Efficient polynomial interpolation using divided differences</CardDescription>
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
                <Button onClick={calculateNewtonInterpolation} className="flex-1">
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
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Newton Interpolation Graph</CardTitle>
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

              {/* Divided Difference Table */}
              {dividedDiffTable.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Divided Difference Table</CardTitle>
                    <CardDescription>Step-by-step calculation of divided differences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>i</TableHead>
                            <TableHead>x_i</TableHead>
                            <TableHead>f[x_i]</TableHead>
                            {dividedDiffTable[0] &&
                              dividedDiffTable[0]
                                .slice(1)
                                .map((_, j) => <TableHead key={j}>f[x_i,...,x_{j + 1}]</TableHead>)}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dividedDiffTable.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell>{i}</TableCell>
                              <TableCell>{dataPoints[i].x}</TableCell>
                              {row.map((value, j) => (
                                <TableCell key={j}>{j < row.length - i ? value.toFixed(6) : ""}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {polynomial && (
                      <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded">
                        <p className="text-sm font-mono break-all">
                          <strong>Polynomial:</strong> P(x) = {polynomial}
                        </p>
                      </div>
                    )}
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
