"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { evaluate } from "mathjs"

interface TrapezoidData {
  i: number
  x: number
  fx: number
  area: number
}

interface TrapezoidalStep {
  i: number
  x: number
  y: number
  area: number
  cumulativeArea: number
  explanation: string
}

export default function TrapezoidalCalculator() {
  const [equation, setEquation] = useState("x^2")
  const [lowerLimit, setLowerLimit] = useState("0")
  const [upperLimit, setUpperLimit] = useState("2")
  const [intervals, setIntervals] = useState("4")
  const [result, setResult] = useState<{
    integral: number
    stepSize: number
    intervals: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])
  const [trapezoidData, setTrapezoidData] = useState<TrapezoidData[]>([])
  const [areaData, setAreaData] = useState<Array<{ x: number; y: number }>>([])

  const evaluateFunction = (x: number): number => {
    try {
      return evaluate(equation.replace(/x/g, `(${x})`))
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const calculateTrapezoidalRule = () => {
    try {
      setError(null)

      const a = Number.parseFloat(lowerLimit)
      const b = Number.parseFloat(upperLimit)
      const n = Number.parseInt(intervals)

      if (a >= b) {
        setError("Upper limit must be greater than lower limit!")
        return
      }

      if (n <= 0) {
        setError("Number of intervals must be positive!")
        return
      }

      const h = (b - a) / n
      let integral = 0
      const trapData: TrapezoidalStep[] = []
      let cumulativeArea = 0

      // Calculate trapezoidal rule
      for (let i = 0; i <= n; i++) {
        const x = a + i * h
        const fx = evaluateFunction(x)

        let area = 0
        let explanation = ""

        if (i === 0 || i === n) {
          integral += fx / 2
          area = (fx * h) / 2
          explanation = `📊 **Interval ${i} (Endpoint):**\n\n`;
          explanation += `**Step 1 - Calculate x-coordinate:** x = a + i × h = ${a} + ${i} × ${h.toFixed(6)} = ${x.toFixed(6)}\n\n`;
          explanation += `**Step 2 - Evaluate function:** f(x) = f(${x.toFixed(6)}) = ${fx.toFixed(6)}\n\n`;
          explanation += `**Step 3 - Apply endpoint rule:** Since this is an endpoint (i = ${i}), we use weight = 1/2\n`;
          explanation += `• Contribution to integral = f(x) × h × (1/2) = ${fx.toFixed(6)} × ${h.toFixed(6)} × 0.5 = ${area.toFixed(6)}\n\n`;
          explanation += `**Step 4 - Update cumulative area:** Total area so far = ${cumulativeArea.toFixed(6)} + ${area.toFixed(6)} = ${(cumulativeArea + area).toFixed(6)}\n\n`;
          explanation += `**Mathematical reasoning:** Endpoints get half weight because they're shared with adjacent intervals.`;
        } else {
          integral += fx
          area = fx * h
          explanation = `📊 **Interval ${i} (Internal):**\n\n`;
          explanation += `**Step 1 - Calculate x-coordinate:** x = a + i × h = ${a} + ${i} × ${h.toFixed(6)} = ${x.toFixed(6)}\n\n`;
          explanation += `**Step 2 - Evaluate function:** f(x) = f(${x.toFixed(6)}) = ${fx.toFixed(6)}\n\n`;
          explanation += `**Step 3 - Apply internal point rule:** Since this is an internal point, we use weight = 1\n`;
          explanation += `• Contribution to integral = f(x) × h × 1 = ${fx.toFixed(6)} × ${h.toFixed(6)} = ${area.toFixed(6)}\n\n`;
          explanation += `**Step 4 - Update cumulative area:** Total area so far = ${cumulativeArea.toFixed(6)} + ${area.toFixed(6)} = ${(cumulativeArea + area).toFixed(6)}\n\n`;
          explanation += `**Mathematical reasoning:** Internal points get full weight because they contribute to the area of the trapezoid.`;
        }

        cumulativeArea += area
        trapData.push({ i, x, y: fx, area, cumulativeArea, explanation })
      }

      integral *= h
      setResult({ integral, stepSize: h, intervals: n })
      setTrapezoidData(trapData)

      // Generate graph data
      const step = (b - a) / 200
      const functionData = []

      for (let x = a; x <= b; x += step) {
        functionData.push({ x, y: evaluateFunction(x) })
      }

      setGraphData(functionData)

      // Generate area visualization data
      const areaVisualization = []
      for (let i = 0; i < n; i++) {
        const x1 = a + i * h
        const x2 = a + (i + 1) * h
        const y1 = evaluateFunction(x1)
        const y2 = evaluateFunction(x2)

        // Add points for trapezoid
        areaVisualization.push({ x: x1, y: 0 })
        areaVisualization.push({ x: x1, y: y1 })
        areaVisualization.push({ x: x2, y: y2 })
        areaVisualization.push({ x: x2, y: 0 })
      }

      setAreaData(areaVisualization)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
    setGraphData([])
    setTrapezoidData([])
    setAreaData([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trapezoidal Rule Calculator</CardTitle>
          <CardDescription>Numerical integration using trapezoidal approximation</CardDescription>
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
                <Label htmlFor="intervals">Number of Intervals (n)</Label>
                <Input
                  id="intervals"
                  value={intervals}
                  onChange={(e) => setIntervals(e.target.value)}
                  type="number"
                  min="1"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={calculateTrapezoidalRule} className="flex-1">
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
                    <p>Step size (h): {result.stepSize.toFixed(6)}</p>
                    <p>Intervals: {result.intervals}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>Trapezoidal Approximation</CardTitle>
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
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Calculation Table */}
              {trapezoidData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Trapezoidal Rule Calculation</CardTitle>
                    <CardDescription>Step-by-step calculation breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>i</TableHead>
                            <TableHead>x_i</TableHead>
                            <TableHead>f(x_i)</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Contribution</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trapezoidData.map((data) => (
                            <TableRow key={data.i}>
                              <TableCell>{data.i}</TableCell>
                              <TableCell>{data.x.toFixed(4)}</TableCell>
                              <TableCell>{data.y.toFixed(6)}</TableCell>
                              <TableCell>{data.i === 0 || data.i === trapezoidData.length - 1 ? "1/2" : "1"}</TableCell>
                              <TableCell>
                                {data.i === 0 || data.i === trapezoidData.length - 1
                                  ? (data.y / 2).toFixed(6)
                                  : data.y.toFixed(6)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <p className="text-sm">
                        <strong>Formula:</strong> ∫f(x)dx ≈ (h/2)[f(x₀) + 2f(x₁) + 2f(x₂) + ... + 2f(xₙ₋₁) + f(xₙ)]
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Result:</strong> {result?.stepSize.toFixed(6)} × [
                        {trapezoidData
                          .map((d, i) =>
                            i === 0 || i === trapezoidData.length - 1 ? (d.y / 2).toFixed(3) : d.y.toFixed(3),
                          )
                          .join(" + ")}
                        ] = {result?.integral.toFixed(6)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Explanations */}
              {trapezoidData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Step-by-Step Explanation</CardTitle>
                    <CardDescription>Detailed mathematical process and reasoning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {trapezoidData.map((data, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          <div className="whitespace-pre-line text-sm leading-relaxed">
                            {data.explanation}
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
