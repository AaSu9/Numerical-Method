"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { evaluate } from "mathjs"

interface EulerStep {
  n: number
  x: number
  y: number
  dydx: number
  yNext: number
  explanation: string
}

export default function EulerMethodCalculator() {
  const [equation, setEquation] = useState("x + y")
  const [x0, setX0] = useState("0")
  const [y0, setY0] = useState("1")
  const [xEnd, setXEnd] = useState("1")
  const [stepSize, setStepSize] = useState("0.1")
  const [result, setResult] = useState<{
    finalY: number
    steps: EulerStep[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])

  const evaluateFunction = (x: number, y: number): number => {
    try {
      return evaluate(equation.replace(/x/g, `(${x})`).replace(/y/g, `(${y})`))
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const calculateEulerMethod = () => {
    try {
      setError(null)

      const x0Val = Number.parseFloat(x0)
      const y0Val = Number.parseFloat(y0)
      const xEndVal = Number.parseFloat(xEnd)
      const h = Number.parseFloat(stepSize)

      if (h <= 0) {
        setError("Step size must be positive!")
        return
      }

      if (xEndVal <= x0Val) {
        setError("End point must be greater than start point!")
        return
      }

      const steps: EulerStep[] = []
      let currentX = x0Val
      let currentY = y0Val
      let n = 0

      const graphPoints = [{ x: currentX, y: currentY }]

      while (currentX < xEndVal) {
        const dydx = evaluateFunction(currentX, currentY)
        const yNext = currentY + h * dydx

        let explanation = `📊 **Step ${n + 1}:**\n\n`;
        explanation += `**Step 1 - Current point:** (xₙ, yₙ) = (${currentX.toFixed(6)}, ${currentY.toFixed(6)})\n\n`;
        explanation += `**Step 2 - Calculate derivative:** dy/dx = f(x, y) = ${equation}\n`;
        explanation += `• At (${currentX.toFixed(6)}, ${currentY.toFixed(6)}): dy/dx = ${dydx.toFixed(6)}\n\n`;
        explanation += `**Step 3 - Euler formula:** yₙ₊₁ = yₙ + h × dy/dx\n`;
        explanation += `• yₙ₊₁ = ${currentY.toFixed(6)} + ${h} × ${dydx.toFixed(6)}\n`;
        explanation += `• yₙ₊₁ = ${currentY.toFixed(6)} + ${(h * dydx).toFixed(6)}\n`;
        explanation += `• yₙ₊₁ = ${yNext.toFixed(6)}\n\n`;
        explanation += `**Step 4 - Next point:** (xₙ₊₁, yₙ₊₁) = (${(currentX + h).toFixed(6)}, ${yNext.toFixed(6)})\n\n`;
        explanation += `**Mathematical reasoning:** The Euler method approximates the solution by following the tangent line at each point. The slope dy/dx tells us how y changes with respect to x, and we use this to predict the next value.`;

        steps.push({
          n: n,
          x: currentX,
          y: currentY,
          dydx: dydx,
          yNext: yNext,
          explanation: explanation,
        })

        currentX += h
        currentY = yNext
        n++

        graphPoints.push({ x: currentX, y: currentY })

        // Safety check to prevent infinite loops
        if (n > 1000) {
          setError("Too many steps! Reduce step size or interval.")
          return
        }
      }

      setResult({
        finalY: currentY,
        steps: steps,
      })

      setGraphData(graphPoints)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
    setGraphData([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Euler's Method Calculator</CardTitle>
          <CardDescription>Solve first-order ODEs using Euler's method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="equation">dy/dx = f(x,y)</Label>
                <Input
                  id="equation"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  placeholder="x + y"
                />
                <p className="text-xs text-slate-500 mt-1">Use x and y as variables</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="x0">Initial x (x₀)</Label>
                  <Input id="x0" value={x0} onChange={(e) => setX0(e.target.value)} type="number" step="0.1" />
                </div>
                <div>
                  <Label htmlFor="y0">Initial y (y₀)</Label>
                  <Input id="y0" value={y0} onChange={(e) => setY0(e.target.value)} type="number" step="0.1" />
                </div>
              </div>

              <div>
                <Label htmlFor="xend">End Point (x)</Label>
                <Input id="xend" value={xEnd} onChange={(e) => setXEnd(e.target.value)} type="number" step="0.1" />
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

              <div className="flex space-x-2">
                <Button onClick={calculateEulerMethod} className="flex-1">
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
                  <p className="text-lg font-mono">
                    y({xEnd}) ≈ {result.finalY.toFixed(6)}
                  </p>
                  <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                    <p>Steps: {result.steps.length}</p>
                    <p>Step size: {stepSize}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Solution Curve</CardTitle>
                  <CardDescription>
                    dy/dx = {equation}, y({x0}) = {y0}
                  </CardDescription>
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
                        <Line
                          type="monotone"
                          dataKey="y"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={true}
                          dotFill="#8884d8"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Steps Table */}
              {result && result.steps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Euler's Method Steps</CardTitle>
                    <CardDescription>yₙ₊₁ = yₙ + h·f(xₙ, yₙ)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto max-h-96">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>n</TableHead>
                            <TableHead>xₙ</TableHead>
                            <TableHead>yₙ</TableHead>
                            <TableHead>f(xₙ,yₙ)</TableHead>
                            <TableHead>yₙ₊₁</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.steps.map((step) => (
                            <TableRow key={step.n}>
                              <TableCell>{step.n}</TableCell>
                              <TableCell>{step.x.toFixed(4)}</TableCell>
                              <TableCell>{step.y.toFixed(6)}</TableCell>
                              <TableCell>{step.dydx.toFixed(6)}</TableCell>
                              <TableCell>{step.yNext.toFixed(6)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Explanations */}
              {result && result.steps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Step-by-Step Explanation</CardTitle>
                    <CardDescription>Detailed mathematical process and reasoning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {result.steps.map((step, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          <div className="whitespace-pre-line text-sm leading-relaxed">
                            {step.explanation}
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
