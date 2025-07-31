"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw, Plus, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MathBlock, MathInline } from "@/components/ui/math"

interface RKStep {
  step: number
  x: number
  y: number
  k1: number
  k2: number
  k3?: number
  k4?: number
  yNext: number
  explanation: string
}

export default function RungeKuttaCalculator() {
  const [equation, setEquation] = useState("x + y")
  const [x0, setX0] = useState("0")
  const [y0, setY0] = useState("1")
  const [h, setH] = useState("0.1")
  const [steps, setSteps] = useState("10")
  const [method, setMethod] = useState<"RK2" | "RK4">("RK4")
  const [results, setResults] = useState<RKStep[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rungeKuttaMethod = () => {
    setIsCalculating(true)
    setError(null)
    
    try {
      const x0Val = parseFloat(x0)
      const y0Val = parseFloat(y0)
      const hVal = parseFloat(h)
      const numSteps = parseInt(steps)
      
      if (isNaN(x0Val) || isNaN(y0Val) || isNaN(hVal) || isNaN(numSteps)) {
        throw new Error("Please enter valid numbers")
      }
      
      if (hVal <= 0) {
        throw new Error("Step size must be positive")
      }
      
      const results: RKStep[] = []
      let currentX = x0Val
      let currentY = y0Val
      
      // Function to evaluate dy/dx = f(x,y)
      const f = (x: number, y: number): number => {
        try {
          // Replace x and y in the equation
          const expr = equation.replace(/x/g, x.toString()).replace(/y/g, y.toString())
          return eval(expr)
        } catch {
          throw new Error("Invalid equation format")
        }
      }
      
             for (let i = 0; i < numSteps; i++) {
         let k1, k2, k3, k4, yNext, explanation
         
         if (method === "RK2") {
           // RK2 (Heun's method)
           k1 = hVal * f(currentX, currentY)
           k2 = hVal * f(currentX + hVal, currentY + k1)
           yNext = currentY + (k1 + k2) / 2
           
           // Generate detailed explanation for RK2
           explanation = `📊 **Step ${i + 1} (RK2 - Heun's Method):**\n\n`
           explanation += `**Current Point:** (xₙ, yₙ) = (${currentX.toFixed(6)}, ${currentY.toFixed(6)})\n\n`
           explanation += `**Step 1 - Calculate K₁:**\n`
           explanation += `K₁ = h × f(xₙ, yₙ) = ${hVal} × f(${currentX.toFixed(6)}, ${currentY.toFixed(6)})\n`
           explanation += `K₁ = ${hVal} × ${f(currentX, currentY).toFixed(6)} = ${k1.toFixed(6)}\n\n`
           explanation += `**Step 2 - Calculate K₂:**\n`
           explanation += `K₂ = h × f(xₙ + h, yₙ + K₁) = ${hVal} × f(${(currentX + hVal).toFixed(6)}, ${(currentY + k1).toFixed(6)})\n`
           explanation += `K₂ = ${hVal} × ${f(currentX + hVal, currentY + k1).toFixed(6)} = ${k2.toFixed(6)}\n\n`
           explanation += `**Step 3 - Calculate Next Value:**\n`
           explanation += `yₙ₊₁ = yₙ + (K₁ + K₂)/2\n`
           explanation += `yₙ₊₁ = ${currentY.toFixed(6)} + (${k1.toFixed(6)} + ${k2.toFixed(6)})/2\n`
           explanation += `yₙ₊₁ = ${currentY.toFixed(6)} + ${(k1 + k2).toFixed(6)}/2 = ${yNext.toFixed(6)}\n\n`
           explanation += `**Result:** (xₙ₊₁, yₙ₊₁) = (${(currentX + hVal).toFixed(6)}, ${yNext.toFixed(6)})`
           
           results.push({
             step: i + 1,
             x: currentX,
             y: currentY,
             k1: k1,
             k2: k2,
             yNext: yNext,
             explanation: explanation
           })
         } else {
           // RK4 method
           k1 = hVal * f(currentX, currentY)
           k2 = hVal * f(currentX + hVal/2, currentY + k1/2)
           k3 = hVal * f(currentX + hVal/2, currentY + k2/2)
           k4 = hVal * f(currentX + hVal, currentY + k3)
           yNext = currentY + (k1 + 2*k2 + 2*k3 + k4) / 6
           
           // Generate detailed explanation for RK4
           explanation = `📊 **Step ${i + 1} (RK4 - 4th Order):**\n\n`
           explanation += `**Current Point:** (xₙ, yₙ) = (${currentX.toFixed(6)}, ${currentY.toFixed(6)})\n\n`
           explanation += `**Step 1 - Calculate K₁:**\n`
           explanation += `K₁ = h × f(xₙ, yₙ) = ${hVal} × f(${currentX.toFixed(6)}, ${currentY.toFixed(6)})\n`
           explanation += `K₁ = ${hVal} × ${f(currentX, currentY).toFixed(6)} = ${k1.toFixed(6)}\n\n`
           explanation += `**Step 2 - Calculate K₂:**\n`
           explanation += `K₂ = h × f(xₙ + h/2, yₙ + K₁/2) = ${hVal} × f(${(currentX + hVal/2).toFixed(6)}, ${(currentY + k1/2).toFixed(6)})\n`
           explanation += `K₂ = ${hVal} × ${f(currentX + hVal/2, currentY + k1/2).toFixed(6)} = ${k2.toFixed(6)}\n\n`
           explanation += `**Step 3 - Calculate K₃:**\n`
           explanation += `K₃ = h × f(xₙ + h/2, yₙ + K₂/2) = ${hVal} × f(${(currentX + hVal/2).toFixed(6)}, ${(currentY + k2/2).toFixed(6)})\n`
           explanation += `K₃ = ${hVal} × ${f(currentX + hVal/2, currentY + k2/2).toFixed(6)} = ${k3.toFixed(6)}\n\n`
           explanation += `**Step 4 - Calculate K₄:**\n`
           explanation += `K₄ = h × f(xₙ + h, yₙ + K₃) = ${hVal} × f(${(currentX + hVal).toFixed(6)}, ${(currentY + k3).toFixed(6)})\n`
           explanation += `K₄ = ${hVal} × ${f(currentX + hVal, currentY + k3).toFixed(6)} = ${k4.toFixed(6)}\n\n`
           explanation += `**Step 5 - Calculate Next Value:**\n`
           explanation += `yₙ₊₁ = yₙ + (K₁ + 2K₂ + 2K₃ + K₄)/6\n`
           explanation += `yₙ₊₁ = ${currentY.toFixed(6)} + (${k1.toFixed(6)} + 2×${k2.toFixed(6)} + 2×${k3.toFixed(6)} + ${k4.toFixed(6)})/6\n`
           explanation += `yₙ₊₁ = ${currentY.toFixed(6)} + ${(k1 + 2*k2 + 2*k3 + k4).toFixed(6)}/6 = ${yNext.toFixed(6)}\n\n`
           explanation += `**Result:** (xₙ₊₁, yₙ₊₁) = (${(currentX + hVal).toFixed(6)}, ${yNext.toFixed(6)})`
           
           results.push({
             step: i + 1,
             x: currentX,
             y: currentY,
             k1: k1,
             k2: k2,
             k3: k3,
             k4: k4,
             yNext: yNext,
             explanation: explanation
           })
         }
        
        currentX += hVal
        currentY = yNext
      }
      
      setResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculation = () => {
    setResults([])
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Runge-Kutta Methods</span>
            <Badge variant="secondary">{method === "RK2" ? "2nd Order" : "4th Order"}</Badge>
          </CardTitle>
          <CardDescription>
            Solve ordinary differential equations using Runge-Kutta methods with detailed K₁, K₂ calculations (RK2) or K₁, K₂, K₃, K₄ calculations (RK4)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value as "RK2" | "RK4")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="RK2">RK2 (Heun's Method) - 2nd Order</option>
                <option value="RK4">RK4 (Classical) - 4th Order</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="equation">Differential Equation (dy/dx =)</Label>
              <Input
                id="equation"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="e.g., x + y, x^2 + y, sin(x)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="x0">Initial x (x₀)</Label>
              <Input
                id="x0"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                placeholder="e.g., 0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y0">Initial y (y₀)</Label>
              <Input
                id="y0"
                value={y0}
                onChange={(e) => setY0(e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="h">Step Size (h)</Label>
              <Input
                id="h"
                value={h}
                onChange={(e) => setH(e.target.value)}
                placeholder="e.g., 0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="steps">Number of Steps</Label>
              <Input
                id="steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={rungeKuttaMethod} disabled={isCalculating}>
              <Play className="w-4 h-4 mr-2" />
              {isCalculating ? "Calculating..." : "Calculate"}
            </Button>
            <Button variant="outline" onClick={resetCalculation}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Results Table</CardTitle>
              <CardDescription>
                Step-by-step Runge-Kutta {method === "RK2" ? "2nd" : "4th"} order method calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Step</TableHead>
                      <TableHead className="text-center">x</TableHead>
                      <TableHead className="text-center">y</TableHead>
                      <TableHead className="text-center">K₁</TableHead>
                      <TableHead className="text-center">K₂</TableHead>
                      {method === "RK4" && <TableHead className="text-center">K₃</TableHead>}
                      {method === "RK4" && <TableHead className="text-center">K₄</TableHead>}
                      <TableHead className="text-center">yₙ₊₁</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-center font-medium">{result.step}</TableCell>
                        <TableCell className="text-center bg-blue-50">{result.x.toFixed(6)}</TableCell>
                        <TableCell className="text-center bg-green-50">{result.y.toFixed(6)}</TableCell>
                        <TableCell className="text-center bg-blue-50">{result.k1.toFixed(6)}</TableCell>
                        <TableCell className="text-center bg-green-50">{result.k2.toFixed(6)}</TableCell>
                        {method === "RK4" && <TableCell className="text-center bg-yellow-50">{result.k3?.toFixed(6)}</TableCell>}
                        {method === "RK4" && <TableCell className="text-center bg-red-50">{result.k4?.toFixed(6)}</TableCell>}
                        <TableCell className="text-center font-semibold bg-purple-50">{result.yNext.toFixed(6)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Step-by-Step Explanations</CardTitle>
              <CardDescription>
                Complete mathematical reasoning for each step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
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
        </>
      )}
    </div>
  )
}
