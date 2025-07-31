"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { evaluate, derivative } from "mathjs"

interface NewtonStep {
  iteration: number
  x: number
  f_x: number
  f_prime_x: number
  x_next: number
  error: number
  explanation: string
}

interface IterationData {
  iteration: number
  x: number
  fx: number
  fpx: number
  error: number
}

export default function NewtonRaphsonCalculator() {
  const [equation, setEquation] = useState("x^3 - x - 2")
  const [initialGuess, setInitialGuess] = useState("1.5")
  const [tolerance, setTolerance] = useState("0.0001")
  const [maxIterations, setMaxIterations] = useState("20")
  const [iterations, setIterations] = useState<IterationData[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [converged, setConverged] = useState(false)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number; dy: number }>>([])
  const [error, setError] = useState<string | null>(null)

  const evaluateFunction = (x: number): number => {
    try {
      return evaluate(equation.replace(/x/g, `(${x})`))
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const evaluateDerivative = (x: number): number => {
    try {
      const expr = derivative(equation, "x")
      return evaluate(expr.toString().replace(/x/g, `(${x})`))
    } catch (err) {
      // Fallback to numerical derivative
      const h = 0.0001
      return (evaluateFunction(x + h) - evaluateFunction(x - h)) / (2 * h)
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
          y: evaluateFunction(x),
          dy: evaluateDerivative(x),
        })
      }
      setGraphData(data)
      setError(null)
    } catch (err) {
      setError("Invalid function")
    }
  }

  const runNewtonRaphsonMethod = () => {
    try {
      setIsCalculating(true)
      setError(null)

      const x0 = Number.parseFloat(initialGuess)
      const tol = Number.parseFloat(tolerance)
      const maxIter = Number.parseInt(maxIterations)

      const newIterations: NewtonStep[] = []
      let currentX = x0
      let iteration = 0
      let error = Number.POSITIVE_INFINITY

      while (error > tol && iteration < maxIter) {
        const fx = evaluateFunction(currentX)
        const fpx = evaluateDerivative(currentX)

        if (Math.abs(fpx) < 1e-12) {
          setError("Derivative is zero! Method fails.")
          setIsCalculating(false)
          return
        }

        const nextX = currentX - fx / fpx

        if (iteration > 0) {
          error = Math.abs(nextX - currentX)
        }

        let explanation = `📊 **Iteration ${iteration + 1}:**\n\n`;
        explanation += `**Step 1 - Current point:** xₙ = ${currentX.toFixed(6)}\n\n`;
        explanation += `**Step 2 - Evaluate function:** f(xₙ) = f(${currentX.toFixed(6)})\n`;
        explanation += `• f(x) = ${equation}\n`;
        explanation += `• f(${currentX.toFixed(6)}) = ${fx.toFixed(6)}\n\n`;
        explanation += `**Step 3 - Calculate derivative:** f'(xₙ) = f'(${currentX.toFixed(6)})\n`;
        explanation += `• f'(x) = derivative of ${equation}\n`;
        explanation += `• f'(${currentX.toFixed(6)}) = ${fpx.toFixed(6)}\n\n`;
        explanation += `**Step 4 - Newton-Raphson formula:** xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)\n`;
        explanation += `• xₙ₊₁ = ${currentX.toFixed(6)} - ${fx.toFixed(6)}/${fpx.toFixed(6)}\n`;
        explanation += `• xₙ₊₁ = ${currentX.toFixed(6)} - ${(fx/fpx).toFixed(6)}\n`;
        explanation += `• xₙ₊₁ = ${nextX.toFixed(6)}\n\n`;
        explanation += `**Step 5 - Calculate error:** |xₙ₊₁ - xₙ| = |${nextX.toFixed(6)} - ${currentX.toFixed(6)}|\n`;
        explanation += `• Error = ${Math.abs(nextX - currentX).toFixed(6)}\n\n`;
        explanation += `**Mathematical reasoning:** Newton-Raphson uses the tangent line at xₙ to approximate where the function crosses zero. The slope f'(xₙ) tells us how to adjust xₙ to get closer to the root.`;

        newIterations.push({
          iteration: iteration + 1,
          x: currentX,
          f_x: fx,
          f_prime_x: fpx,
          x_next: nextX,
          error: iteration === 0 ? 0 : error,
          explanation: explanation,
        })

        if (Math.abs(fx) < tol) {
          setConverged(true)
          setResult(currentX)
          break
        }

        currentX = nextX
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
  }, [initialGuess, equation])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Newton-Raphson Method Calculator</CardTitle>
          <CardDescription>Fast convergence root finding using derivatives</CardDescription>
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
                <p className="text-xs text-slate-500 mt-1">Derivative calculated automatically</p>
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
                <Button onClick={runNewtonRaphsonMethod} disabled={isCalculating} className="flex-1">
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
                  <CardTitle>Function & Derivative Graph</CardTitle>
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
                          formatter={(value: number, name: string) => [
                            value.toFixed(4),
                            name === "y" ? "f(x)" : "f'(x)",
                          ]}
                          labelFormatter={(value: number) => `x = ${value.toFixed(4)}`}
                        />
                        <ReferenceLine y={0} stroke="#666" strokeDasharray="2 2" />
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} name="f(x)" />
                        <Line type="monotone" dataKey="dy" stroke="#82ca9d" strokeWidth={1} dot={false} name="f'(x)" />
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
                    <CardDescription>Newton-Raphson iterations: xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-center">Iteration</TableHead>
                            <TableHead className="text-center">xₙ</TableHead>
                            <TableHead className="text-center">f(xₙ)</TableHead>
                            <TableHead className="text-center">f'(xₙ)</TableHead>
                            <TableHead className="text-center">xₙ₊₁</TableHead>
                            <TableHead className="text-center">Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {iterations.map((iter) => (
                            <TableRow key={iter.iteration} className="hover:bg-gray-50">
                              <TableCell className="text-center font-medium">{iter.iteration}</TableCell>
                              <TableCell className="text-center bg-blue-50">{iter.x.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-red-50">{iter.f_x.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-green-50">{iter.f_prime_x.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-yellow-50 font-semibold">{iter.x_next.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-gray-50">{iter.error.toFixed(6)}</TableCell>
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
