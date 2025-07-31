"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, RotateCcw } from "lucide-react"

export default function FiniteDifferenceCalculator() {
  const [gridSize, setGridSize] = useState("5")
  const [boundaryType, setBoundaryType] = useState("dirichlet")
  const [boundaryValue, setBoundaryValue] = useState("0")
  const [sourceFunction, setSourceFunction] = useState("1")
  const [result, setResult] = useState<number[][] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const solveLaplaceEquation = () => {
    try {
      setError(null)
      const n = Number.parseInt(gridSize)
      const h = 1.0 / (n + 1) // Grid spacing
      const boundary = Number.parseFloat(boundaryValue)
      const source = Number.parseFloat(sourceFunction)

      // Initialize grid
      const u = Array(n + 2)
        .fill(null)
        .map(() => Array(n + 2).fill(0))

      // Set boundary conditions
      for (let i = 0; i <= n + 1; i++) {
        u[0][i] = boundary // Bottom boundary
        u[n + 1][i] = boundary // Top boundary
        u[i][0] = boundary // Left boundary
        u[i][n + 1] = boundary // Right boundary
      }

      // Gauss-Seidel iteration for interior points
      const maxIterations = 1000
      const tolerance = 1e-6
      let converged = false

      for (let iter = 0; iter < maxIterations && !converged; iter++) {
        let maxChange = 0

        for (let i = 1; i <= n; i++) {
          for (let j = 1; j <= n; j++) {
            const oldValue = u[i][j]
            // Five-point stencil: ∇²u = f
            u[i][j] = 0.25 * (u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1] + h * h * source)
            maxChange = Math.max(maxChange, Math.abs(u[i][j] - oldValue))
          }
        }

        if (maxChange < tolerance) {
          converged = true
        }
      }

      if (!converged) {
        setError("Solution did not converge within maximum iterations")
      }

      setResult(u)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Finite Difference PDE Solver</CardTitle>
          <CardDescription>Solve Poisson equation: ∇²u = f with boundary conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="gridsize">Grid Size (n×n)</Label>
                <Select value={gridSize} onValueChange={setGridSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3×3</SelectItem>
                    <SelectItem value="5">5×5</SelectItem>
                    <SelectItem value="7">7×7</SelectItem>
                    <SelectItem value="10">10×10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="boundary-type">Boundary Type</Label>
                <Select value={boundaryType} onValueChange={setBoundaryType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dirichlet">Dirichlet (u = constant)</SelectItem>
                    <SelectItem value="neumann">Neumann (∂u/∂n = constant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="boundary-value">Boundary Value</Label>
                <Input
                  id="boundary-value"
                  value={boundaryValue}
                  onChange={(e) => setBoundaryValue(e.target.value)}
                  type="number"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="source">Source Function f</Label>
                <Input
                  id="source"
                  value={sourceFunction}
                  onChange={(e) => setSourceFunction(e.target.value)}
                  type="number"
                  step="0.1"
                />
                <p className="text-xs text-slate-500 mt-1">Constant source term for ∇²u = f</p>
              </div>

              <div className="flex space-x-2">
                <Button onClick={solveLaplaceEquation} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Solve
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
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Solution Grid */}
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle>Solution Grid</CardTitle>
                    <CardDescription>Numerical solution u(x,y)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <div
                        className="grid gap-1 text-xs"
                        style={{
                          gridTemplateColumns: `repeat(${result[0].length}, minmax(0, 1fr))`,
                        }}
                      >
                        {result.map((row, i) =>
                          row.map((value, j) => (
                            <div
                              key={`${i}-${j}`}
                              className={`p-2 text-center border rounded ${
                                i === 0 || i === result.length - 1 || j === 0 || j === row.length - 1
                                  ? "bg-blue-100 dark:bg-blue-900/20 font-semibold"
                                  : "bg-slate-50 dark:bg-slate-800"
                              }`}
                            >
                              {value.toFixed(3)}
                            </div>
                          )),
                        )}
                      </div>
                    </div>
                    <div className="mt-4 text-sm">
                      <p>
                        <span className="inline-block w-4 h-4 bg-blue-100 dark:bg-blue-900/20 border rounded mr-2"></span>
                        Boundary points
                      </p>
                      <p>
                        <span className="inline-block w-4 h-4 bg-slate-50 dark:bg-slate-800 border rounded mr-2"></span>
                        Interior points
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Method Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Finite Difference Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Five-Point Stencil</h4>
                      <div className="text-center font-mono text-sm mb-2">
                        {"∇²u = (u_{i+1,j} + u_{i-1,j} + u_{i,j+1} + u_{i,j-1} - 4u_{i,j}) / h²"}
                      </div>
                      <p className="text-sm">
                        This discretization converts the PDE into a system of linear algebraic equations.
                      </p>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Gauss-Seidel Iteration</h4>
                      <div className="text-center font-mono text-sm mb-2">
                        {
                          "u_{i,j}^{k+1} = (u_{i+1,j}^k + u_{i-1,j}^{k+1} + u_{i,j+1}^k + u_{i,j-1}^{k+1} + h²f_{i,j}) / 4"
                        }
                      </div>
                      <p className="text-sm">
                        Iterative method that uses updated values immediately for faster convergence.
                      </p>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Boundary Conditions</h4>
                      <ul className="text-sm space-y-1">
                        <li>
                          • <strong>Dirichlet:</strong> u = g on boundary (specified values)
                        </li>
                        <li>
                          • <strong>Neumann:</strong> ∂u/∂n = g on boundary (specified derivatives)
                        </li>
                        <li>
                          • <strong>Mixed:</strong> Combination of Dirichlet and Neumann
                        </li>
                      </ul>
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
