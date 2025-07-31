"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { evaluate, derivative } from "mathjs"

export default function NumericalDifferentiationCalculator() {
  const [equation, setEquation] = useState("x^3 - 2*x^2 + x")
  const [xValue, setXValue] = useState("2")
  const [stepSize, setStepSize] = useState("0.1")
  const [method, setMethod] = useState("central")
  const [result, setResult] = useState<{
    numerical: number
    analytical: number
    error: number
    method: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number; derivative: number }>>([])
  const [stepAnalysis, setStepAnalysis] = useState<Array<{ h: number; numerical: number; error: number }>>([])

  const evaluateFunction = (x: number): number => {
    try {
      return evaluate(equation.replace(/x/g, `(${x})`))
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const evaluateAnalyticalDerivative = (x: number): number => {
    try {
      const expr = derivative(equation, "x")
      return evaluate(expr.toString().replace(/x/g, `(${x})`))
    } catch (err) {
      return Number.NaN
    }
  }

  const calculateNumericalDerivative = (x: number, h: number, method: string): number => {
    switch (method) {
      case "forward":
        return (evaluateFunction(x + h) - evaluateFunction(x)) / h
      case "backward":
        return (evaluateFunction(x) - evaluateFunction(x - h)) / h
      case "central":
        return (evaluateFunction(x + h) - evaluateFunction(x - h)) / (2 * h)
      default:
        return 0
    }
  }

  const calculateDerivative = () => {
    try {
      setError(null)

      const x = Number.parseFloat(xValue)
      const h = Number.parseFloat(stepSize)

      if (h <= 0) {
        setError("Step size must be positive!")
        return
      }

      // Calculate numerical derivative
      const numerical = calculateNumericalDerivative(x, h, method)

      // Calculate analytical derivative for comparison
      const analytical = evaluateAnalyticalDerivative(x)

      // Calculate error
      const errorValue = Math.abs(numerical - analytical)

      setResult({
        numerical,
        analytical: isNaN(analytical) ? numerical : analytical,
        error: isNaN(analytical) ? 0 : errorValue,
        method,
      })

      // Generate graph data
      const range = 2
      const step = 0.1
      const data = []

      for (let xi = x - range; xi <= x + range; xi += step) {
        data.push({
          x: xi,
          y: evaluateFunction(xi),
          derivative: isNaN(evaluateAnalyticalDerivative(xi))
            ? calculateNumericalDerivative(xi, h, method)
            : evaluateAnalyticalDerivative(xi),
        })
      }

      setGraphData(data)

      // Step size analysis
      const stepSizes = [0.1, 0.05, 0.01, 0.005, 0.001]
      const analysis = stepSizes.map((stepH) => {
        const num = calculateNumericalDerivative(x, stepH, method)
        const err = isNaN(analytical) ? 0 : Math.abs(num - analytical)
        return { h: stepH, numerical: num, error: err }
      })

      setStepAnalysis(analysis)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
    setGraphData([])
    setStepAnalysis([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Numerical Differentiation Calculator</CardTitle>
          <CardDescription>Calculate derivatives using finite difference methods</CardDescription>
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
                  placeholder="x^3 - 2*x^2 + x"
                />
              </div>

              <div>
                <Label htmlFor="xvalue">Point (x)</Label>
                <Input
                  id="xvalue"
                  value={xValue}
                  onChange={(e) => setXValue(e.target.value)}
                  type="number"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="stepsize">Step Size (h)</Label>
                <Input
                  id="stepsize"
                  value={stepSize}
                  onChange={(e) => setStepSize(e.target.value)}
                  type="number"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="method">Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forward">Forward Difference</SelectItem>
                    <SelectItem value="backward">Backward Difference</SelectItem>
                    <SelectItem value="central">Central Difference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button onClick={calculateDerivative} className="flex-1">
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
                  <p className="text-sm">
                    <strong>Numerical:</strong> {result.numerical.toFixed(6)}
                  </p>
                  {!isNaN(result.analytical) && (
                    <>
                      <p className="text-sm">
                        <strong>Analytical:</strong> {result.analytical.toFixed(6)}
                      </p>
                      <p className="text-sm">
                        <strong>Error:</strong> {result.error.toFixed(6)}
                      </p>
                    </>
                  )}
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Method: {result.method} difference</p>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Function and Derivative</CardTitle>
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
                        <Line type="monotone" dataKey="y" stroke="#8884d8" strokeWidth={2} dot={false} name="f(x)" />
                        <Line
                          type="monotone"
                          dataKey="derivative"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          dot={false}
                          name="f'(x)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Step Size Analysis */}
              {stepAnalysis.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Step Size Analysis</CardTitle>
                    <CardDescription>Effect of step size on accuracy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Step Size (h)</TableHead>
                            <TableHead>Numerical Derivative</TableHead>
                            <TableHead>Absolute Error</TableHead>
                            <TableHead>Relative Error (%)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stepAnalysis.map((analysis, index) => (
                            <TableRow key={index}>
                              <TableCell>{analysis.h}</TableCell>
                              <TableCell>{analysis.numerical.toFixed(6)}</TableCell>
                              <TableCell>{analysis.error.toFixed(6)}</TableCell>
                              <TableCell>
                                {result?.analytical && result.analytical !== 0
                                  ? ((analysis.error / Math.abs(result.analytical)) * 100).toFixed(2)
                                  : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Formula Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Finite Difference Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                        <h4 className="font-semibold mb-2">Forward Difference</h4>
                        <code className="text-sm">f'(x) ≈ [f(x+h) - f(x)] / h</code>
                        <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">Error: O(h)</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                        <h4 className="font-semibold mb-2">Backward Difference</h4>
                        <code className="text-sm">f'(x) ≈ [f(x) - f(x-h)] / h</code>
                        <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">Error: O(h)</p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                        <h4 className="font-semibold mb-2">Central Difference</h4>
                        <code className="text-sm">f'(x) ≈ [f(x+h) - f(x-h)] / (2h)</code>
                        <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">Error: O(h²)</p>
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
