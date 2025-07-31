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
  x0: number
  x1: number
  fx0: number
  fx1: number
  x2: number
  error: number
  explanation: string
}

export default function SecantCalculator() {
  const [equation, setEquation] = useState("x^3 - x - 2")
  const [initialGuess1, setInitialGuess1] = useState("1")
  const [initialGuess2, setInitialGuess2] = useState("2")
  const [tolerance, setTolerance] = useState("0.0001")
  const [maxIterations, setMaxIterations] = useState("20")
  const [iterations, setIterations] = useState<IterationData[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [converged, setConverged] = useState(false)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])
  const [error, setError] = useState<string | null>(null)

  const evaluateFunction = (x: number): number => {
    try {
      return evaluate(equation.replace(/x/g, `(${x})`))
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const generateGraphData = () => {
    try {
      const x0 = Number.parseFloat(initialGuess1)
      const x1 = Number.parseFloat(initialGuess2)
      const data = []
      const range = Math.max(Math.abs(x1 - x0) * 2, 3)
      const center = (x0 + x1) / 2
      const step = range / 100

      for (let x = center - range; x <= center + range; x += step) {
        data.push({ x: x, y: evaluateFunction(x) })
      }
      setGraphData(data)
      setError(null)
    } catch (err) {
      setError("Invalid function")
    }
  }

  const runSecantMethod = () => {
    try {
      setIsCalculating(true)
      setError(null)

      const x0 = Number.parseFloat(initialGuess1)
      const x1 = Number.parseFloat(initialGuess2)
      const tol = Number.parseFloat(tolerance)
      const maxIter = Number.parseInt(maxIterations)

      const newIterations: IterationData[] = []
      let currentX0 = x0
      let currentX1 = x1
      let iteration = 0
      let error = Number.POSITIVE_INFINITY

      while (error > tol && iteration < maxIter) {
        const fx0 = evaluateFunction(currentX0)
        const fx1 = evaluateFunction(currentX1)

        if (Math.abs(fx1 - fx0) < 1e-12) {
          setError("Division by zero! f(x₁) - f(x₀) is too small.")
          setIsCalculating(false)
          return
        }

        const x2 = currentX1 - (fx1 * (currentX1 - currentX0)) / (fx1 - fx0)

        if (iteration > 0) {
          error = Math.abs(x2 - currentX1)
        } else {
          error = Math.abs(currentX1 - currentX0)
        }

        let explanation = `📊 **Iteration ${iteration + 1}:**\n\n`;
        explanation += `**Step 1 - Current points:** (x₀, x₁) = (${currentX0.toFixed(6)}, ${currentX1.toFixed(6)})\n\n`;
        explanation += `**Step 2 - Evaluate function at both points:**\n`;
        explanation += `• f(x₀) = f(${currentX0.toFixed(6)}) = ${fx0.toFixed(6)}\n`;
        explanation += `• f(x₁) = f(${currentX1.toFixed(6)}) = ${fx1.toFixed(6)}\n\n`;
        explanation += `**Step 3 - Calculate secant slope:** m = (f(x₁) - f(x₀)) / (x₁ - x₀)\n`;
        explanation += `• m = (${fx1.toFixed(6)} - ${fx0.toFixed(6)}) / (${currentX1.toFixed(6)} - ${currentX0.toFixed(6)})\n`;
        explanation += `• m = ${(fx1 - fx0).toFixed(6)} / ${(currentX1 - currentX0).toFixed(6)}\n`;
        explanation += `• m = ${((fx1 - fx0) / (currentX1 - currentX0)).toFixed(6)}\n\n`;
        explanation += `**Step 4 - Secant formula:** x₂ = x₁ - f(x₁) / m\n`;
        explanation += `• x₂ = ${currentX1.toFixed(6)} - ${fx1.toFixed(6)} / ${((fx1 - fx0) / (currentX1 - currentX0)).toFixed(6)}\n`;
        explanation += `• x₂ = ${currentX1.toFixed(6)} - ${(fx1 / ((fx1 - fx0) / (currentX1 - currentX0))).toFixed(6)}\n`;
        explanation += `• x₂ = ${x2.toFixed(6)}\n\n`;
        explanation += `**Step 5 - Calculate error:** |x₂ - x₁| = |${x2.toFixed(6)} - ${currentX1.toFixed(6)}|\n`;
        explanation += `• Error = ${error.toFixed(6)}\n\n`;
        explanation += `**Mathematical reasoning:** The secant method approximates the derivative using the slope of the secant line between two points. This gives us a direction to move toward the root without needing the actual derivative.`;

        newIterations.push({
          iteration: iteration + 1,
          x0: currentX0,
          x1: currentX1,
          fx0: fx0,
          fx1: fx1,
          x2: x2,
          error: error,
          explanation: explanation,
        })

        if (Math.abs(evaluateFunction(x2)) < tol) {
          setConverged(true)
          setResult(x2)
          break
        }

        currentX0 = currentX1
        currentX1 = x2
        iteration++
      }

      if (iteration >= maxIter) {
        setResult(currentX1)
        setConverged(false)
      } else if (!converged) {
        setResult(currentX1)
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
  }, [initialGuess1, initialGuess2, equation])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Secant Method Calculator</CardTitle>
          <CardDescription>Root finding without derivatives using secant approximation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="equation">Function f(x)</Label>
                <Input
                  id="equation"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="x^3 - x - 2"
                />
                <p className="text-xs text-slate-500 mt-1">No derivative needed</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="initial1">Initial Point (x₀)</Label>
                  <Input
                    id="initial1"
                    value={initialGuess1}
                    onChange={(e) => setInitialGuess1(e.target.value)}
                    type="number"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="initial2">Initial Point (x₁)</Label>
                  <Input
                    id="initial2"
                    value={initialGuess2}
                    onChange={(e) => setInitialGuess2(e.target.value)}
                    type="number"
                    step="0.1"
                  />
                </div>
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
                <Button onClick={runSecantMethod} disabled={isCalculating} className="flex-1">
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
                  <CardTitle>Function Graph</CardTitle>
                  <CardDescription>f(x) = {equation}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [value.toFixed(4), "f(x)"]}
                          labelFormatter={(value: number) => `x = ${value.toFixed(4)}`}
                        />
                        <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} />
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
                    <CardDescription>Secant iterations: x₂ = x₁ - f(x₁)(x₁-x₀)/(f(x₁)-f(x₀))</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>n</TableHead>
                            <TableHead>x₀</TableHead>
                            <TableHead>x₁</TableHead>
                            <TableHead>f(x₀)</TableHead>
                            <TableHead>f(x₁)</TableHead>
                            <TableHead>x₂</TableHead>
                            <TableHead>Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {iterations.map((iter) => (
                            <TableRow key={iter.iteration}>
                              <TableCell>{iter.iteration}</TableCell>
                              <TableCell>{iter.x0.toFixed(6)}</TableCell>
                              <TableCell>{iter.x1.toFixed(6)}</TableCell>
                              <TableCell>{iter.fx0.toFixed(6)}</TableCell>
                              <TableCell>{iter.fx1.toFixed(6)}</TableCell>
                              <TableCell>{iter.x2.toFixed(6)}</TableCell>
                              <TableCell>{iter.error.toFixed(6)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Explanations */}
              {iterations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Step-by-Step Explanation</CardTitle>
                    <CardDescription>Detailed mathematical process and reasoning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {iterations.map((iter, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          <div className="whitespace-pre-line text-sm leading-relaxed">
                            {iter.explanation}
                          </div>
                        </div>
                      ))}
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
