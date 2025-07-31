"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, RotateCcw, Plus, Minus } from "lucide-react"

export default function LUDecompositionCalculator() {
  const [size, setSize] = useState(3)
  const [matrix, setMatrix] = useState<number[][]>([
    [4, 3, 2],
    [3, 4, -1],
    [2, -1, 4],
  ])
  const [constants, setConstants] = useState<number[]>([25, 10, 16])
  const [result, setResult] = useState<{
    L: number[][]
    U: number[][]
    solution: number[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const updateMatrixSize = (newSize: number) => {
    setSize(newSize)
    const newMatrix = Array(newSize)
      .fill(null)
      .map((_, i) =>
        Array(newSize)
          .fill(null)
          .map((_, j) => (i < matrix.length && j < matrix[0]?.length ? matrix[i][j] : i === j ? 1 : 0)),
      )
    const newConstants = Array(newSize)
      .fill(null)
      .map((_, i) => (i < constants.length ? constants[i] : 0))
    setMatrix(newMatrix)
    setConstants(newConstants)
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

  const luDecomposition = () => {
    try {
      setError(null)
      const n = size

      // Initialize L and U matrices
      const L = Array(n)
        .fill(null)
        .map(() => Array(n).fill(0))
      const U = Array(n)
        .fill(null)
        .map(() => Array(n).fill(0))

      // Copy original matrix to U
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          U[i][j] = matrix[i][j]
        }
        L[i][i] = 1 // Diagonal of L is 1
      }

      // Perform LU decomposition using Doolittle method
      for (let k = 0; k < n - 1; k++) {
        // Check for zero pivot
        if (Math.abs(U[k][k]) < 1e-10) {
          setError("Matrix is singular or nearly singular!")
          return
        }

        for (let i = k + 1; i < n; i++) {
          const factor = U[i][k] / U[k][k]
          L[i][k] = factor

          for (let j = k; j < n; j++) {
            U[i][j] -= factor * U[k][j]
          }
        }
      }

      // Forward substitution: Ly = b
      const y = new Array(n).fill(0)
      for (let i = 0; i < n; i++) {
        y[i] = constants[i]
        for (let j = 0; j < i; j++) {
          y[i] -= L[i][j] * y[j]
        }
      }

      // Back substitution: Ux = y
      const x = new Array(n).fill(0)
      for (let i = n - 1; i >= 0; i--) {
        x[i] = y[i]
        for (let j = i + 1; j < n; j++) {
          x[i] -= U[i][j] * x[j]
        }
        x[i] /= U[i][i]
      }

      setResult({ L, U, solution: x })
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
          <CardTitle>LU Decomposition Calculator</CardTitle>
          <CardDescription>Solve linear systems using LU factorization (Doolittle method)</CardDescription>
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

              <div className="flex space-x-2">
                <Button onClick={luDecomposition} className="flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Decompose
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
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* L and U Matrices */}
              {result && (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Lower Matrix (L)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <tbody>
                              {result.L.map((row, i) => (
                                <tr key={i}>
                                  {row.map((val, j) => (
                                    <td key={j} className="px-2 py-1 text-center border">
                                      {val.toFixed(3)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Upper Matrix (U)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <tbody>
                              {result.U.map((row, i) => (
                                <tr key={i}>
                                  {row.map((val, j) => (
                                    <td key={j} className="px-2 py-1 text-center border">
                                      {val.toFixed(3)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Solution Process</CardTitle>
                      <CardDescription>A = LU, then solve Ly = b and Ux = y</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Step 1: LU Decomposition</h4>
                          <p className="text-sm">
                            Matrix A is factored into L (lower triangular) and U (upper triangular) matrices where A =
                            LU
                          </p>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Step 2: Forward Substitution</h4>
                          <p className="text-sm">Solve Ly = b for y using forward substitution</p>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Step 3: Back Substitution</h4>
                          <p className="text-sm">Solve Ux = y for x using back substitution</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
