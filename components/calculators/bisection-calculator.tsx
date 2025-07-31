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
  a: number
  b: number
  c: number
  fa: number
  fb: number
  fc: number
  error: number
}

export default function BisectionCalculator() {
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
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Array<{
    iteration: number;
    a: number;
    b: number;
    c: number;
    f_a: number;
    f_b: number;
    f_c: number;
    error: number;
    explanation: string;
  }>>([]);

  const evaluateFunction = (x: number): number => {
    try {
      return evaluate(equation.replace(/x/g, `(${x})`))
    } catch (err) {
      throw new Error("Invalid function")
    }
  }

  const generateGraphData = () => {
    try {
      const a = Number.parseFloat(lowerBound)
      const b = Number.parseFloat(upperBound)
      const data = []
      const step = (b - a) / 100

      for (let x = a - 0.5; x <= b + 0.5; x += step) {
        data.push({ x: x, y: evaluateFunction(x) })
      }
      setGraphData(data)
      setError(null)
    } catch (err) {
      setError("Invalid function or bounds")
    }
  }

  const bisectionMethod = (func: string, a: number, b: number, tol: number, maxIter: number) => {
    const f = (x: number) => {
      try {
        // Replace common mathematical functions
        const safeFunc = func
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/log/g, 'Math.log')
          .replace(/exp/g, 'Math.exp')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/pow/g, 'Math.pow');
        return eval(safeFunc);
      } catch {
        return NaN;
      }
    };

    const results: Array<{
      iteration: number;
      a: number;
      b: number;
      c: number;
      f_a: number;
      f_b: number;
      f_c: number;
      error: number;
      explanation: string;
    }> = [];

    let iteration = 0;
    let currentA = a;
    let currentB = b;

    // Check if f(a) and f(b) have opposite signs (Bisection Theorem)
    const f_a = f(currentA);
    const f_b = f(currentB);
    
         if (f_a * f_b > 0) {
       setResults([{
         iteration: 0,
         a: currentA,
         b: currentB,
         c: 0,
         f_a: f_a,
         f_b: f_b,
         f_c: 0,
         error: 0,
         explanation: `❌ Bisection method cannot be applied! f(${currentA}) = ${f_a.toFixed(6)} and f(${currentB}) = ${f_b.toFixed(6)} have the same sign. The function must change sign between the bounds for the method to work.`
       }]);
       return;
     }

    while (iteration < maxIter) {
      iteration++;
      
      // Step 1: Calculate midpoint c = (a + b) / 2
      const c = (currentA + currentB) / 2;
      const f_c = f(c);
      
      // Step 2: Calculate relative error
      const error = Math.abs((currentB - currentA) / 2);
      
      // Step 3: Determine which half to keep
      let explanation = `📊 **Iteration ${iteration}:**\n\n`;
      explanation += `**Step 1 - Calculate midpoint:** c = (a + b) / 2 = (${currentA} + ${currentB}) / 2 = ${c.toFixed(6)}\n\n`;
      explanation += `**Step 2 - Evaluate function at points:**\n`;
      explanation += `• f(a) = f(${currentA}) = ${f(currentA).toFixed(6)}\n`;
      explanation += `• f(b) = f(${currentB}) = ${f(currentB).toFixed(6)}\n`;
      explanation += `• f(c) = f(${c.toFixed(6)}) = ${f_c.toFixed(6)}\n\n`;
      explanation += `**Step 3 - Check sign changes:**\n`;
      
      if (f_c === 0) {
        explanation += `🎯 **Root found exactly!** f(c) = 0, so c = ${c.toFixed(6)} is the exact root.\n\n`;
        explanation += `**Final Result:** Root = ${c.toFixed(6)} (found in ${iteration} iterations)`;
        results.push({
          iteration,
          a: currentA,
          b: currentB,
          c,
          f_a: f(currentA),
          f_b: f(currentB),
          f_c,
          error,
          explanation
        });
        break;
      } else if (f(currentA) * f_c < 0) {
        explanation += `• f(a) × f(c) = ${f(currentA).toFixed(6)} × ${f_c.toFixed(6)} < 0 ✓\n`;
        explanation += `• Root lies in left half [a, c]\n`;
        explanation += `• **Update:** b = c = ${c.toFixed(6)}\n\n`;
        currentB = c;
      } else {
        explanation += `• f(b) × f(c) = ${f(currentB).toFixed(6)} × ${f_c.toFixed(6)} < 0 ✓\n`;
        explanation += `• Root lies in right half [c, b]\n`;
        explanation += `• **Update:** a = c = ${c.toFixed(6)}\n\n`;
        currentA = c;
      }
      
      explanation += `**Step 4 - Check convergence:**\n`;
      explanation += `• Current error = |b - a| / 2 = |${currentB} - ${currentA}| / 2 = ${error.toFixed(6)}\n`;
      explanation += `• Tolerance = ${tol}\n`;
      
      if (error < tol) {
        explanation += `• ✅ Error < Tolerance: Method converged!\n\n`;
        explanation += `**Final Result:** Root ≈ ${c.toFixed(6)} (converged in ${iteration} iterations)`;
      } else {
        explanation += `• ⏳ Error > Tolerance: Continue to next iteration\n\n`;
        explanation += `**Next iteration:** [a, b] = [${currentA.toFixed(6)}, ${currentB.toFixed(6)}]`;
      }

      results.push({
        iteration,
        a: currentA,
        b: currentB,
        c,
        f_a: f(currentA),
        f_b: f(currentB),
        f_c,
        error,
        explanation
      });

      if (error < tol) break;
    }

    if (iteration >= maxIter) {
      const lastResult = results[results.length - 1];
      lastResult.explanation += `\n\n⚠️ **Maximum iterations reached!** The method did not converge within ${maxIter} iterations.`;
    }

    setResults(results);
  };

  const runBisectionMethod = () => {
    try {
      setIsCalculating(true)
      setError(null)

      const a = Number.parseFloat(lowerBound)
      const b = Number.parseFloat(upperBound)
      const tol = Number.parseFloat(tolerance)
      const maxIter = Number.parseInt(maxIterations)

      // Generate graph data
      generateGraphData()

      // Run the detailed bisection method with explanations
      bisectionMethod(equation, a, b, tol, maxIter)
      
      // Set the final result from the last iteration
      if (results.length > 0) {
        const lastResult = results[results.length - 1]
        setResult(lastResult.c)
        setConverged(lastResult.error < tol)
      }
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
    setResults([])
  }

  useEffect(() => {
    generateGraphData()
  }, [lowerBound, upperBound, equation])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bisection Method Calculator</CardTitle>
          <CardDescription>Find roots using the reliable bisection algorithm</CardDescription>
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
                <p className="text-xs text-slate-500 mt-1">Use ^ for powers, * for multiplication</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="lower">Lower Bound (a)</Label>
                  <Input
                    id="lower"
                    value={lowerBound}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty, minus sign, numbers, and decimal points
                      if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                        setLowerBound(value);
                      }
                    }}
                    type="text"
                    placeholder="e.g., -2, 0, 1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="upper">Upper Bound (b)</Label>
                  <Input
                    id="upper"
                    value={upperBound}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty, minus sign, numbers, and decimal points
                      if (value === '' || value === '-' || /^-?\d*\.?\d*$/.test(value)) {
                        setUpperBound(value);
                      }
                    }}
                    type="text"
                    placeholder="e.g., -1, 2, 3.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tolerance">Tolerance</Label>
                <Input
                  id="tolerance"
                  value={tolerance}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty, numbers, and decimal points (tolerance should be positive)
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setTolerance(value);
                    }
                  }}
                  type="text"
                  placeholder="e.g., 0.0001"
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
                            <TableHead className="text-center">Iteration</TableHead>
                            <TableHead className="text-center">a</TableHead>
                            <TableHead className="text-center">b</TableHead>
                            <TableHead className="text-center">c</TableHead>
                            <TableHead className="text-center">f(a)</TableHead>
                            <TableHead className="text-center">f(b)</TableHead>
                            <TableHead className="text-center">f(c)</TableHead>
                            <TableHead className="text-center">Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {iterations.map((iter) => (
                            <TableRow key={iter.iteration} className="hover:bg-gray-50">
                              <TableCell className="text-center font-medium">{iter.iteration}</TableCell>
                              <TableCell className="text-center bg-blue-50">{iter.a.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-green-50">{iter.b.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-yellow-50 font-semibold">{iter.c.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-red-50">{iter.fa.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-purple-50">{iter.fb.toFixed(6)}</TableCell>
                              <TableCell className="text-center bg-orange-50 font-semibold">{iter.fc.toFixed(6)}</TableCell>
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
              {results.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Step-by-Step Explanation</CardTitle>
                    <CardDescription>Detailed mathematical process and reasoning</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                          <div className="whitespace-pre-line text-sm leading-relaxed">
                            {result.explanation}
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
