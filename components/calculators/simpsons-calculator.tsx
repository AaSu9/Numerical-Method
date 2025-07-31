"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { evaluate } from "mathjs"

interface SimpsonsData {
  i: number
  x: number
  fx: number
  weight: number
  contribution: number
}

export default function SimpsonsCalculator() {
  const [equation, setEquation] = useState("x^3")
  const [lowerLimit, setLowerLimit] = useState("0")
  const [upperLimit, setUpperLimit] = useState("3")
  const [intervals, setIntervals] = useState("6")
  const [rule, setRule] = useState("1/3")
  const [result, setResult] = useState<{
    integral: number
    stepSize: number
    intervals: number
    rule: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])
  const [simpsonsData, setSimpsonsData] = useState<SimpsonsData[]>([])

  const evaluateFunction = (x: number): number => {
    try {
      return evaluate(equation.replace(/x/g, `(${x})`))
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const calculateSimpsonsRule = () => {
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

      // Check interval requirements
      if (rule === "1/3" && n % 2 !== 0) {
        setError("Simpson's 1/3 rule requires even number of intervals!")
        return
      }

      if (rule === "3/8" && n % 3 !== 0) {
        setError("Simpson's 3/8 rule requires intervals divisible by 3!")
        return
      }

      const h = (b - a) / n
      let integral = 0
      const simpData: SimpsonsData[] = []

      if (rule === "1/3") {
        // Simpson's 1/3 rule
        for (let i = 0; i <= n; i++) {
          const x = a + i * h
          const fx = evaluateFunction(x)
          let weight = 1

          if (i === 0 || i === n) {
            weight = 1
          } else if (i % 2 === 1) {
            weight = 4
          } else {
            weight = 2
          }

          const contribution = weight * fx
          integral += contribution

          simpData.push({ i, x, fx, weight, contribution })
        }

        integral *= h / 3
      } else if (rule === "3/8") {
        // Simpson's 3/8 rule
        for (let i = 0; i <= n; i++) {
          const x = a + i * h
          const fx = evaluateFunction(x)
          let weight = 1

          if (i === 0 || i === n) {
            weight = 1
          } else if (i % 3 === 0) {
            weight = 2
          } else {
            weight = 3
          }

          const contribution = weight * fx
          integral += contribution

          simpData.push({ i, x, fx, weight, contribution })
        }

        integral *= (3 * h) / 8
      }

      setResult({ integral, stepSize: h, intervals: n, rule })
      setSimpsonsData(simpData)

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
    setSimpsonsData([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simpson's Rules Calculator</CardTitle>
          <CardDescription>Numerical integration using Simpson's 1/3 and 3/8 rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="equation">Function f(x)</Label>
                <Input id="equation" value={equation} onChange={(e) => setEquation(e.target.value)} placeholder="x^3" />
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

              <div>
                <Label htmlFor="rule">Simpson's Rule</Label>
                <Select value={rule} onValueChange={setRule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1/3">Simpson's 1/3 Rule</SelectItem>
                    <SelectItem value="3/8">Simpson's 3/8 Rule</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  {rule === "1/3" ? "Requires even intervals" : "Requires intervals divisible by 3"}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button onClick={calculateSimpsonsRule} className="flex-1">
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
                    <p>Rule: Simpson's {result.rule}</p>
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
                  <CardTitle>Simpson's Rule Approximation</CardTitle>
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
              {simpsonsData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Simpson's {result?.rule} Rule Calculation</CardTitle>
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
                            <TableHead>Weighted f(x_i)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {simpsonsData.map((data) => (
                            <TableRow key={data.i}>
                              <TableCell>{data.i}</TableCell>
                              <TableCell>{data.x.toFixed(4)}</TableCell>
                              <TableCell>{data.fx.toFixed(6)}</TableCell>
                              <TableCell>{data.weight}</TableCell>
                              <TableCell>{data.contribution.toFixed(6)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <div className="text-sm space-y-1">
                        {rule === "1/3" ? (
                          <>
                            <p>
                              <strong>Simpson's 1/3 Rule:</strong> ∫f(x)dx ≈ (h/3)[f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) +
                              ... + f(xₙ)]
                            </p>
                            <p>
                              <strong>Pattern:</strong> 1, 4, 2, 4, 2, ..., 4, 1
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              <strong>Simpson's 3/8 Rule:</strong> ∫f(x)dx ≈ (3h/8)[f(x₀) + 3f(x₁) + 3f(x₂) + 2f(x₃) +
                              ... + f(xₙ)]
                            </p>
                            <p>
                              <strong>Pattern:</strong> 1, 3, 3, 2, 3, 3, 2, ..., 3, 3, 1
                            </p>
                          </>
                        )}
                        <p>
                          <strong>Sum:</strong> {simpsonsData.reduce((sum, d) => sum + d.contribution, 0).toFixed(6)}
                        </p>
                        <p>
                          <strong>Result:</strong> {result?.integral.toFixed(6)}
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
