"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { evaluate } from "mathjs"

interface IterationData {
  iteration: number
  x: number
  gx: number
  error: number
}

export default function FixedPointCalculator() {
  const [gFunction, setGFunction] = useState("(x^3 - 2) / x")
  const [initialGuess, setInitialGuess] = useState("1.5")
  const [tolerance, setTolerance] = useState("0.0001")
  const [maxIterations, setMaxIterations] = useState("20")
  const [iterations, setIterations] = useState<IterationData[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [converged, setConverged] = useState(false)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number; gx: number }>>([])
  const [error, setError] = useState<string | null>(null)

  const evaluateG = (x: number): number => {
    try {
      return evaluate(gFunction.replace(/x/g, `(${x})`))
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const generateGraphData = () => {
    try {
      const x0 = Number.parseFloat(initialGuess)
      const data = []
      const range = 3
      const step = 0.1

      for (let x = x0 - range; x <= x0 + range; x += step) {
        data.push({
          x: x,
          y: x, // y = x line
          gx: evaluateG(x), // g(x) function
        })
      }
      setGraphData(data)
      setError(null)
    } catch (err) {
      setError("Invalid function")
    }
  }

  const runFixedPointMethod = () => {
    try {
      setIsCalculating(true)
      setError(null)

      const x0 = Number.parseFloat(initialGuess)
      const tol = Number.parseFloat(tolerance)
      const maxIter = Number.parseInt(maxIterations)

      const newIterations: IterationData[] = []
      let currentX = x0
      let iteration = 0
      let error = Number.POSITIVE_INFINITY

      while (error > tol && iteration < maxIter) {
        const gx = evaluateG(currentX)

        if (iteration > 0) {
          error = Math.abs(gx - currentX)
        }

        newIterations.push({
          iteration: iteration + 1,
          x: currentX,
          gx: gx,
          error: iteration === 0 ? 0 : error,
        })

        if (Math.abs(gx - currentX) < tol) {
          setConverged(true)
          setResult(gx)
          break
        }

        currentX = gx
        iteration++
      }

      if (iteration >= maxIter) {
        setResult(currentX)
        setConverged(false)
      } else if (!converged) {
        setResult(currentX)
        setConverged(true)
      }

      setIterations(newIterations)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculation = () => {
    setIterations([])
    setResult(null)
    setConverged(false)
    setError(null)
  }

  useEffect(() => {
    generateGraphData()
  }, [initialGuess, gFunction])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fixed Point Iteration Calculator</CardTitle>
          <CardDescription>Solve x = g(x) using iterative method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="gfunction">Function g(x)</Label>
                <Input
                  id="gfunction"
                  value={gFunction}
                  onChange={(e) => setGFunction(e.target.value)}
                  placeholder="(x^3 - 2) / x"
                />
                <p className="text-xs text-slate-500 mt-1">Transform f(x) = 0 to x = g(x)</p>
              </div>

              <div>
                <Label htmlFor="initial">Initial Guess (x₀)</Label>
                <Input
                  id="initial"
                  value={initialGuess}
                  onChange={(e) => setInitialGuess(e.target.value)}
                  type="number"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="tolerance">Tolerance</Label>
                <Input
                  id="tolerance"
                  value={tolerance}
                  onChange={(e) => setTolerance(e.target.value)}
                  type="number"
                  step="0.0001"
                />
              </div>

              <div>
                <Label htmlFor="maxIter">Max Iterations</Label>
                <Input
                  id="maxIter"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(e.target.value)}
                  type="number"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={runFixedPointMethod} disabled={isCalculating} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  {isCalculating ? "Calculating..." : "Calculate"}
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
                  <p className="text-lg font-mono">x ≈ {result.toFixed(6)}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {converged ? "✓ Converged" : "⚠ Max iterations reached"}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">Iterations: {iterations.length}</p>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Fixed Point Graph</CardTitle>
                  <CardDescription>Intersection of y = x and y = g(x)</CardDescription>
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
                            name === "y" ? "y = x" : "g(x)",
                          ]}
                          labelFormatter={(value: number) => `x = ${value.toFixed(4)}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="y"
                          stroke="#666"
                          strokeWidth={1}
                          dot={false}
                          name="y = x"
                          strokeDasharray="5 5"
                        />
                        <Line type="monotone" dataKey="gx" stroke="#8884d8" strokeWidth={2} dot={false} name="g(x)" />
                        {result !== null && <ReferenceLine x={result} stroke="#ff0000" strokeDasharray="5 5" />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Iteration Table */}
              {iterations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Iteration Table</CardTitle>
                    <CardDescription>Fixed point iterations: xₙ₊₁ = g(xₙ)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>n</TableHead>
                            <TableHead>xₙ</TableHead>
                            <TableHead>g(xₙ)</TableHead>
                            <TableHead>Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {iterations.map((iter) => (
                            <TableRow key={iter.iteration}>
                              <TableCell>{iter.iteration}</TableCell>
                              <TableCell>{iter.x.toFixed(6)}</TableCell>
                              <TableCell>{iter.gx.toFixed(6)}</TableCell>
                              <TableCell>{iter.error.toFixed(6)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
