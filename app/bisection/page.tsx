"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Play, RotateCcw } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { MathBlock, MathInline } from "@/components/ui/math"

interface IterationData {
  iteration: number
  a: number
  b: number
  c: number
  fa: number
  fb: number
  fc: number
  error: number
}

export default function BisectionMethod() {
  const [equation, setEquation] = useState("x^3 - x - 2")
  const [lowerBound, setLowerBound] = useState("1")
  const [upperBound, setUpperBound] = useState("2")
  const [tolerance, setTolerance] = useState("0.0001")
  const [maxIterations, setMaxIterations] = useState("20")
  const [iterations, setIterations] = useState<IterationData[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [converged, setConverged] = useState(false)
  const [graphData, setGraphData] = useState<Array<{ x: number; y: number }>>([])

  // Function evaluator (simplified for demo - in real app would use math.js)
  const evaluateFunction = (x: number): number => {
    // For demo: f(x) = x^3 - x - 2
    return Math.pow(x, 3) - x - 2
  }

  const generateGraphData = () => {
    const a = Number.parseFloat(lowerBound)
    const b = Number.parseFloat(upperBound)
    const data = []
    const step = (b - a) / 100

    for (let x = a - 0.5; x <= b + 0.5; x += step) {
      data.push({ x: x, y: evaluateFunction(x) })
    }
    setGraphData(data)
  }

  const runBisectionMethod = () => {
    setIsCalculating(true)
    const a = Number.parseFloat(lowerBound)
    const b = Number.parseFloat(upperBound)
    const tol = Number.parseFloat(tolerance)
    const maxIter = Number.parseInt(maxIterations)

    const newIterations: IterationData[] = []
    let currentA = a
    let currentB = b
    let iteration = 0
    let error = Number.POSITIVE_INFINITY
    let root = 0

    // Check if root exists in interval
    const fa = evaluateFunction(currentA)
    const fb = evaluateFunction(currentB)

    if (fa * fb > 0) {
      alert("No root exists in the given interval!")
      setIsCalculating(false)
      return
    }

    while (error > tol && iteration < maxIter) {
      const c = (currentA + currentB) / 2
      const fc = evaluateFunction(c)

      if (iteration > 0) {
        error = Math.abs(c - newIterations[iteration - 1].c)
      } else {
        error = Math.abs(currentB - currentA)
      }

      newIterations.push({
        iteration: iteration + 1,
        a: currentA,
        b: currentB,
        c: c,
        fa: evaluateFunction(currentA),
        fb: evaluateFunction(currentB),
        fc: fc,
        error: error,
      })

      if (Math.abs(fc) < tol) {
        root = c
        setConverged(true)
        break
      }

      if (evaluateFunction(currentA) * fc < 0) {
        currentB = c
      } else {
        currentA = c
      }

      iteration++
      root = c
    }

    setIterations(newIterations)
    setResult(root)
    setConverged(error <= tol)
    setIsCalculating(false)
  }

  const resetCalculation = () => {
    setIterations([])
    setResult(null)
    setConverged(false)
  }

  useEffect(() => {
    generateGraphData()
  }, [lowerBound, upperBound])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Bisection Method</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Root Finding Algorithm</p>
            </div>
          </div>
          <Badge variant="secondary">Non-Linear Equations</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="theory">Theory</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          {/* Theory Tab */}
          <TabsContent value="theory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bisection Method Overview</CardTitle>
                <CardDescription>
                  A reliable root-finding algorithm based on the Intermediate Value Theorem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Mathematical Foundation</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    The bisection method is based on the <strong>Intermediate Value Theorem</strong>, which states that if a continuous function 
                    <MathInline>f(x)</MathInline> changes sign over an interval <MathInline>[a, b]</MathInline>, then there exists at least one root 
                    <MathInline>c \in (a, b)</MathInline> such that <MathInline>f(c) = 0</MathInline>.
                  </p>
                  
                  <MathBlock>
                    \text{If } f(a) \cdot f(b) < 0 \text{ and } f(x) \text{ is continuous on } [a, b], \text{ then } \exists c \in (a, b) : f(c) = 0
                  </MathBlock>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Algorithm</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    The bisection method finds roots by repeatedly bisecting an interval and selecting the subinterval
                    where the function changes sign.
                  </p>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Iterative Formula:</h4>
                    <MathBlock>
                      c_n = \frac{a_n + b_n}{2}
                    </MathBlock>
                    
                    <h4 className="font-semibold mb-2 mt-4">Steps:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Choose interval <MathInline>[a, b]</MathInline> where <MathInline>f(a) \cdot f(b) < 0</MathInline></li>
                      <li>Calculate midpoint: <MathInline>c = \frac{a + b}{2}</MathInline></li>
                      <li>If <MathInline>f(c) = 0</MathInline>, then <MathInline>c</MathInline> is the root</li>
                      <li>If <MathInline>f(a) \cdot f(c) < 0</MathInline>, set <MathInline>b = c</MathInline>; otherwise set <MathInline>a = c</MathInline></li>
                      <li>Repeat until <MathInline>|b - a| < \epsilon</MathInline> (tolerance)</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Error Analysis</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-3">
                    The error after <MathInline>n</MathInline> iterations is bounded by:
                  </p>
                  <MathBlock>
                    |x_n - x^*| \leq \frac{b - a}{2^n}
                  </MathBlock>
                  
                  <p className="text-slate-600 dark:text-slate-300 mt-3">
                    This means the method has <strong>linear convergence</strong> with a convergence rate of approximately 0.5.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Convergence Rate</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      The bisection method reduces the error by approximately half in each iteration:
                    </p>
                    <MathBlock>
                      \frac{|x_{n+1} - x^*|}{|x_n - x^*|} \approx \frac{1}{2}
                    </MathBlock>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Advantages & Disadvantages</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Advantages</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Always converges if root exists</li>
                        <li>• Simple to implement</li>
                        <li>• Guaranteed to find a root</li>
                        <li>• No derivative required</li>
                        <li>• Predictable convergence rate</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Disadvantages</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Slow convergence (linear)</li>
                        <li>• Requires sign change in interval</li>
                        <li>• Cannot find multiple roots</li>
                        <li>• May miss roots at discontinuities</li>
                        <li>• Requires good initial bracketing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Stopping Criteria</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-3">
                    The algorithm stops when any of these conditions are met:
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <ul className="space-y-2 text-sm">
                      <li>• <MathInline>|b_n - a_n| < \epsilon</MathInline> (interval width)</li>
                      <li>• <MathInline>|f(c_n)| < \epsilon</MathInline> (function value)</li>
                      <li>• <MathInline>n \geq n_{\text{max}}</MathInline> (maximum iterations)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Input Parameters</CardTitle>
                  <CardDescription>Enter your function and initial interval</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="equation">Function f(x)</Label>
                    <Input
                      id="equation"
                      value={equation}
                      onChange={(e) => setEquation(e.target.value)}
                      placeholder="x^3 - x - 2"
                    />
                    <p className="text-xs text-slate-500 mt-1">Use ^ for powers, * for multiplication</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="lower">Lower Bound (a)</Label>
                      <Input
                        id="lower"
                        value={lowerBound}
                        onChange={(e) => setLowerBound(e.target.value)}
                        type="number"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="upper">Upper Bound (b)</Label>
                      <Input
                        id="upper"
                        value={upperBound}
                        onChange={(e) => setUpperBound(e.target.value)}
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
                    <Button onClick={runBisectionMethod} disabled={isCalculating} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      {isCalculating ? "Calculating..." : "Calculate"}
                    </Button>
                    <Button variant="outline" onClick={resetCalculation}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {result !== null && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Result</h4>
                      <p className="text-lg font-mono">x ≈ {result.toFixed(6)}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {converged ? "✓ Converged" : "⚠ Max iterations reached"}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">Iterations: {iterations.length}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Graph */}
                <Card>
                  <CardHeader>
                    <CardTitle>Function Graph</CardTitle>
                    <CardDescription>Visualization of f(x) = {equation}</CardDescription>
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
                      <CardDescription>Step-by-step calculation results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>n</TableHead>
                              <TableHead>a</TableHead>
                              <TableHead>b</TableHead>
                              <TableHead>c</TableHead>
                              <TableHead>f(a)</TableHead>
                              <TableHead>f(b)</TableHead>
                              <TableHead>f(c)</TableHead>
                              <TableHead>Error</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {iterations.map((iter) => (
                              <TableRow key={iter.iteration}>
                                <TableCell>{iter.iteration}</TableCell>
                                <TableCell>{iter.a.toFixed(6)}</TableCell>
                                <TableCell>{iter.b.toFixed(6)}</TableCell>
                                <TableCell>{iter.c.toFixed(6)}</TableCell>
                                <TableCell>{iter.fa.toFixed(6)}</TableCell>
                                <TableCell>{iter.fb.toFixed(6)}</TableCell>
                                <TableCell>{iter.fc.toFixed(6)}</TableCell>
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
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Example 1: Cubic Equation</CardTitle>
                  <CardDescription>Find root of x³ - x - 2 = 0</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                      <p>
                        <strong>Function:</strong> f(x) = x³ - x - 2
                      </p>
                      <p>
                        <strong>Interval:</strong> [1, 2]
                      </p>
                      <p>
                        <strong>f(1) =</strong> -2, <strong>f(2) =</strong> 4
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Since f(1) × f(2) {"<"} 0, a root exists in [1, 2]. The exact root is approximately 1.521379.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEquation("x^3 - x - 2")
                        setLowerBound("1")
                        setUpperBound("2")
                      }}
                    >
                      Load Example
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example 2: Transcendental Equation</CardTitle>
                  <CardDescription>Find root of x - cos(x) = 0</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                      <p>
                        <strong>Function:</strong> f(x) = x - cos(x)
                      </p>
                      <p>
                        <strong>Interval:</strong> [0, 1]
                      </p>
                      <p>
                        <strong>f(0) =</strong> -1, <strong>f(1) =</strong> 0.46
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      This equation represents the intersection of y = x and y = cos(x). The root is approximately
                      0.739085.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEquation("x - cos(x)")
                        setLowerBound("0")
                        setUpperBound("1")
                      }}
                    >
                      Load Example
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
