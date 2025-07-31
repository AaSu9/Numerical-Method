"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw, Plus, Minus } from "lucide-react"

interface JacobiIteration {
  iteration: number
  x: number[]
  error: number
}

export default function JacobiCalculator() {
  const [size, setSize] = useState(3)
  const [matrix, setMatrix] = useState<number[][]>([
    [4, -1, 0],
    [-1, 4, -1],
    [0, -1, 4],
  ])
  const [constants, setConstants] = useState<number[]>([15, 10, 10])
  const [initialGuess, setInitialGuess] = useState<number[]>([0, 0, 0])
  const [tolerance, setTolerance] = useState("0.0001")
  const [maxIterations, setMaxIterations] = useState("50")
  const [result, setResult] = useState<{
    solution: number[]
    iterations: JacobiIteration[]
    converged: boolean
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateMatrixSize = (newSize: number) => {
    setSize(newSize)
    const newMatrix = Array(newSize)
      .fill(null)
      .map((_, i) =>
        Array(newSize)
          .fill(null)
          .map((_, j) => (i < matrix.length && j < matrix[0]?.length ? matrix[i][j] : i === j ? 4 : -1)),
      )
    const newConstants = Array(newSize)
      .fill(null)
      .map((_, i) => (i < constants.length ? constants[i] : 10))
    const newGuess = Array(newSize).fill(0)
    setMatrix(newMatrix)
    setConstants(newConstants)
    setInitialGuess(newGuess)
  }

  const updateMatrixElement = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix]
    newMatrix[row][col] = Number.parseFloat(value) || 0
    setMatrix(newMatrix)
  }

  const updateConstant = (row: number, value: string) => {
    const newConstants = [...constants]
    newConstants[row] = Number.parseFloat(value) || 0
    setConstants(newConstants)
  }

  const updateInitialGuess = (index: number, value: string) => {
    const newGuess = [...initialGuess]
    newGuess[index] = Number.parseFloat(value) || 0
    setInitialGuess(newGuess)
  }

  const checkDiagonalDominance = (): boolean => {
    for (let i = 0; i < size; i++) {
      let sum = 0
      for (let j = 0; j < size; j++) {
        if (i !== j) {
          sum += Math.abs(matrix[i][j])
        }
      }
      if (Math.abs(matrix[i][i]) < sum) {
        return false
      }
    }
    return true
  }

  const calculateJacobi = () => {
    try {
      setError(null)

      const tol = Number.parseFloat(tolerance)
      const maxIter = Number.parseInt(maxIterations)

      // Check for zero diagonal elements
      for (let i = 0; i < size; i++) {
        if (Math.abs(matrix[i][i]) < 1e-10) {
          setError(`Diagonal element at position (${i + 1}, ${i + 1}) is zero!`)
          return
        }
      }

      // Check diagonal dominance
      if (!checkDiagonalDominance()) {
        setError("Warning: Matrix is not diagonally dominant. Convergence is not guaranteed.")
      }

      const iterations: JacobiIteration[] = []
      let x = [...initialGuess]
      let iteration = 0
      let converged = false

      while (iteration < maxIter && !converged) {
        const xNew = new Array(size).fill(0)

        // Jacobi iteration: x_i^(k+1) = (b_i - Σ(a_ij * x_j^(k))) / a_ii
        for (let i = 0; i < size; i++) {
          let sum = 0
          for (let j = 0; j < size; j++) {
            if (i !== j) {
              sum += matrix[i][j] * x[j]
            }
          }
          xNew[i] = (constants[i] - sum) / matrix[i][i]
        }

        // Calculate error (infinity norm)
        let maxError = 0
        for (let i = 0; i < size; i++) {
          const error = Math.abs(xNew[i] - x[i])
          if (error > maxError) {
            maxError = error
          }
        }

        iterations.push({
          iteration: iteration + 1,
          x: [...xNew],
          error: maxError,
        })

        if (maxError < tol) {
          converged = true
        }

        x = xNew
        iteration++
      }

      setResult({
        solution: x,
        iterations: iterations,
        converged: converged,
      })
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
          <CardTitle>Jacobi Method Calculator</CardTitle>
          <CardDescription>Solve linear systems using Jacobi iterative method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="size">Matrix Size</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => size > 2 && updateMatrixSize(size - 1)}
                    disabled={size <= 2}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{size}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => size < 5 && updateMatrixSize(size + 1)}
                    disabled={size >= 5}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Coefficient Matrix A</Label>
                <div className="grid gap-1 mt-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                  {matrix.map((row, i) =>
                    row.map((val, j) => (
                      <Input
                        key={`${i}-${j}`}
                        value={val.toString()}
                        onChange={(e) => updateMatrixElement(i, j, e.target.value)}
                        type="number"
                        step="0.1"
                        className="text-center text-sm"
                      />
                    )),
                  )}
                </div>
              </div>

              <div>
                <Label>Constants Vector b</Label>
                <div className="grid gap-1 mt-2">
                  {constants.map((val, i) => (
                    <Input
                      key={i}
                      value={val.toString()}
                      onChange={(e) => updateConstant(i, e.target.value)}
                      type="number"
                      step="0.1"
                      className="text-center"
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Initial Guess</Label>
                <div className="grid gap-1 mt-2">
                  {initialGuess.map((val, i) => (
                    <Input
                      key={i}
                      value={val.toString()}
                      onChange={(e) => updateInitialGuess(i, e.target.value)}
                      type="number"
                      step="0.1"
                      className="text-center"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
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
                  <Label htmlFor="maxiter">Max Iterations</Label>
                  <Input
                    id="maxiter"
                    value={maxIterations}
                    onChange={(e) => setMaxIterations(e.target.value)}
                    type="number"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={calculateJacobi} className="flex-1">
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

              {result && !error && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Solution</h4>
                  {result.solution.map((val, i) => (
                    <p key={i} className="text-sm font-mono">
                      x{i + 1} = {val.toFixed(6)}
                    </p>
                  ))}
                  <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                    <p>{result.converged ? "✓ Converged" : "⚠ Max iterations reached"}</p>
                    <p>Iterations: {result.iterations.length}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Iteration Table */}
              {result && result.iterations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Jacobi Iterations</CardTitle>
                    <CardDescription>Convergence history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto max-h-96">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>k</TableHead>
                            {Array.from({ length: size }, (_, i) => (
                              <TableHead key={i}>x{i + 1}⁽ᵏ⁾</TableHead>
                            ))}
                            <TableHead>Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>0</TableCell>
                            {initialGuess.map((val, i) => (
                              <TableCell key={i}>{val.toFixed(6)}</TableCell>
                            ))}
                            <TableCell>-</TableCell>
                          </TableRow>
                          {result.iterations.map((iter) => (
                            <TableRow key={iter.iteration}>
                              <TableCell>{iter.iteration}</TableCell>
                              {iter.x.map((val, i) => (
                                <TableCell key={i}>{val.toFixed(6)}</TableCell>
                              ))}
                              <TableCell>{iter.error.toFixed(6)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Formula */}
              <Card>
                <CardHeader>
                  <CardTitle>Jacobi Method Formula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <code className="text-lg">x_i^(k+1) = (b_i - Σ(a_ij × x_j^(k))) / a_ii</code>
                    </div>
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Requirements:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Non-zero diagonal elements</li>
                        <li>Preferably diagonally dominant matrix</li>
                        <li>|a_ii| ≥ Σ|a_ij| for all i ≠ j</li>
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
