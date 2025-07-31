"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts"
import { evaluate } from "mathjs"

interface GaussPoint {
  i: number
  xi: number
  wi: number
  x: number
  fx: number
  contribution: number
}

// Gauss-Legendre quadrature points and weights
const gaussianData = {
  2: {
    points: [-0.5773502692, 0.5773502692],
    weights: [1.0, 1.0],
  },
  3: {
    points: [-0.7745966692, 0.0, 0.7745966692],
    weights: [0.5555555556, 0.8888888889, 0.5555555556],
  },
  4: {
    points: [-0.8611363116, -0.3399810436, 0.3399810436, 0.8611363116],
    weights: [0.3478548451, 0.6521451549, 0.6521451549, 0.3478548451],
  },
}

export default function GaussianQuadratureCalculator() {
  const [equation, setEquation] = useState("x^2")
  const [lowerLimit, setLowerLimit] = useState("-1")
  const [upperLimit, setUpperLimit] = useState("1")
  const [nPoints, setNPoints] = useState("2")
  const [result, setResult] = useState<{
    integral: number
    nPoints: number
    transformed: boolean
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])
  const [gaussData, setGaussData] = useState<GaussPoint[]>([])

  const evaluateFunction = (x: number): number => {
    try {
      // Replace x with the actual value and evaluate
      const expression = equation.replace(/x/g, `(${x})`)
      return evaluate(expression)
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const transformToStandard = (xi: number, a: number, b: number): number => {
    return ((b - a) * xi + (b + a)) / 2
  }

  const calculateGaussianQuadrature = () => {
    try {
      setError(null)

      const a = Number.parseFloat(lowerLimit)
      const b = Number.parseFloat(upperLimit)
      const n = Number.parseInt(nPoints) as 2 | 3 | 4

      if (a >= b) {
        setError("Upper limit must be greater than lower limit!")
        return
      }

      if (![2, 3, 4].includes(n)) {
        setError("Only 2, 3, or 4 point Gaussian quadrature supported!")
        return
      }

      const { points, weights } = gaussianData[n]
      let integral = 0
      const gaussPoints: GaussPoint[] = []

      // Check if we need transformation from [-1,1] to [a,b]
      const needsTransform = a !== -1 || b !== 1
      const jacobian = needsTransform ? (b - a) / 2 : 1

      for (let i = 0; i < n; i++) {
        const xi = points[i]
        const wi = weights[i]

        // Transform from [-1,1] to [a,b] if needed
        const x = needsTransform ? ((b - a) * xi + (b + a)) / 2 : xi
        const fx = evaluateFunction(x)
        const contribution = wi * fx * jacobian

        integral += contribution

        gaussPoints.push({
          i: i + 1,
          xi,
          wi,
          x,
          fx,
          contribution,
        })
      }

      setResult({ integral, nPoints: n, transformed: needsTransform })
      setGaussData(gaussPoints)

      // Generate graph data
      const step = (b - a) / 200
      const functionData = []

      for (let x = a; x <= b; x += step) {
        functionData.push({ x, y: evaluateFunction(x) })
      }

      setGraphData(functionData)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
    setGraphData([])
    setGaussData([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gaussian Quadrature Calculator</CardTitle>
          <CardDescription>High-accuracy numerical integration using optimal sampling points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="equation">Function f(x)</Label>
                <Input id="equation" value={equation} onChange={(e) => setEquation(e.target.value)} placeholder="x^2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="lower">Lower Limit (a)</Label>
                  <Input
                    id="lower"
                    value={lowerLimit}
                    onChange={(e) => setLowerLimit(e.target.value)}
                    type="number"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="upper">Upper Limit (b)</Label>
                  <Input
                    id="upper"
                    value={upperLimit}
                    onChange={(e) => setUpperLimit(e.target.value)}
                    type="number"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="npoints">Number of Points</Label>
                <Select value={nPoints} onValueChange={setNPoints}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2-Point Gauss</SelectItem>
                    <SelectItem value="3">3-Point Gauss</SelectItem>
                    <SelectItem value="4">4-Point Gauss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button onClick={calculateGaussianQuadrature} className="flex-1">
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
                  <p className="text-lg font-mono">∫ f(x)dx ≈ {result.integral.toFixed(6)}</p>
                  <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                    <p>Points: {result.nPoints}-Point Gaussian</p>
                    <p>Transformed: {result.transformed ? "Yes" : "No"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Gaussian Quadrature Points</CardTitle>
                  <CardDescription>
                    ∫[{lowerLimit}, {upperLimit}] {equation} dx
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [value.toFixed(4), "f(x)"]}
                          labelFormatter={(value: number) => `x = ${value.toFixed(4)}`}
                        />
                        <Area type="monotone" dataKey="y" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        {gaussData.map((point, i) => (
                          <ReferenceLine key={i} x={point.x} stroke="#ff0000" strokeDasharray="5 5" />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Gaussian Points:</h4>
                    <div className="flex flex-wrap gap-2">
                      {gaussData.map((point) => (
                        <div key={point.i} className="bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded text-sm">
                          x{point.i}: {point.x.toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calculation Table */}
              {gaussData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gaussian Quadrature Calculation</CardTitle>
                    <CardDescription>Optimal points and weights for integration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>i</TableHead>
                            <TableHead>ξᵢ</TableHead>
                            <TableHead>wᵢ</TableHead>
                            <TableHead>xᵢ</TableHead>
                            <TableHead>f(xᵢ)</TableHead>
                            <TableHead>wᵢ × f(xᵢ)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gaussData.map((data) => (
                            <TableRow key={data.i}>
                              <TableCell>{data.i}</TableCell>
                              <TableCell>{data.xi.toFixed(6)}</TableCell>
                              <TableCell>{data.wi.toFixed(6)}</TableCell>
                              <TableCell>{data.x.toFixed(6)}</TableCell>
                              <TableCell>{data.fx.toFixed(6)}</TableCell>
                              <TableCell>{data.contribution.toFixed(6)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <div className="text-sm space-y-1">
                        <p>
                          <strong>Formula:</strong> ∫f(x)dx ≈ Σ wᵢ × f(xᵢ)
                        </p>
                        {result?.transformed && (
                          <p>
                            <strong>Transformation:</strong> x = ((b-a)ξ + (b+a))/2, Jacobian = (b-a)/2
                          </p>
                        )}
                        <p>
                          <strong>Sum:</strong> {gaussData.reduce((sum, d) => sum + d.contribution, 0).toFixed(6)}
                        </p>
                      </div>
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
