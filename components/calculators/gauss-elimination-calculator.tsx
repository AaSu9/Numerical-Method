"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, RotateCcw, Plus, Minus } from "lucide-react"

interface Matrix {
  data: number[][]
  rows: number
  cols: number
}

interface EliminationStep {
  step: number
  description: string
  matrix: number[][]
  constants: number[]
}

export default function GaussEliminationCalculator() {
  const [size, setSize] = useState(3)
  const [matrix, setMatrix] = useState<number[][]>([
    [2, 1, -1],
    [-3, -1, 2],
    [-2, 1, 2],
  ])
  const [constants, setConstants] = useState<number[]>([8, -11, -3])
  const [solution, setSolution] = useState<number[] | null>(null)
  const [steps, setSteps] = useState<EliminationStep[]>([])
  const [error, setError] = useState<string | null>(null)

  const updateMatrixSize = (newSize: number) => {
    setSize(newSize)
    const newMatrix = Array(newSize)
      .fill(null)
      .map((_, i) =>
        Array(newSize)
          .fill(null)
          .map((_, j) => (i < matrix.length && j < matrix[0]?.length ? matrix[i][j] : 0)),
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

  const copyMatrix = (mat: number[][]): number[][] => {
    return mat.map((row) => [...row])
  }

  const gaussElimination = () => {
    try {
      setError(null)
      const eliminationSteps: EliminationStep[] = []

      // Create augmented matrix
      const augMatrix = copyMatrix(matrix)
      const b = [...constants]

      eliminationSteps.push({
        step: 0,
        description: "Initial augmented matrix",
        matrix: copyMatrix(augMatrix),
        constants: [...b],
      })

      const n = size

      // Forward elimination
      for (let i = 0; i < n; i++) {
        // Find pivot
        let maxRow = i
        for (let k = i + 1; k < n; k++) {
          if (Math.abs(augMatrix[k][i]) > Math.abs(augMatrix[maxRow][i])) {
            maxRow = k
          }
        }

        // Swap rows if needed
        if (maxRow !== i) {
          ;[augMatrix[i], augMatrix[maxRow]] = [augMatrix[maxRow], augMatrix[i]]
          ;[b[i], b[maxRow]] = [b[maxRow], b[i]]

          eliminationSteps.push({
            step: eliminationSteps.length,
            description: `Swap rows ${i + 1} and ${maxRow + 1} for pivoting`,
            matrix: copyMatrix(augMatrix),
            constants: [...b],
          })
        }

        // Check for singular matrix
        if (Math.abs(augMatrix[i][i]) < 1e-10) {
          setError("Matrix is singular or nearly singular!")
          return
        }

        // Eliminate column
        for (let k = i + 1; k < n; k++) {
          const factor = augMatrix[k][i] / augMatrix[i][i]

          for (let j = i; j < n; j++) {
            augMatrix[k][j] -= factor * augMatrix[i][j]
          }
          b[k] -= factor * b[i]
        }

        eliminationSteps.push({
          step: eliminationSteps.length,
          description: `Eliminate column ${i + 1}`,
          matrix: copyMatrix(augMatrix),
          constants: [...b],
        })
      }

      // Back substitution
      const x = new Array(n).fill(0)

      for (let i = n - 1; i >= 0; i--) {
        x[i] = b[i]
        for (let j = i + 1; j < n; j++) {
          x[i] -= augMatrix[i][j] * x[j]
        }
        x[i] /= augMatrix[i][i]
      }

      setSolution(x)
      setSteps(eliminationSteps)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setSolution(null)
    setSteps([])
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gauss Elimination Calculator</CardTitle>
          <CardDescription>Solve linear systems using Gaussian elimination with partial pivoting</CardDescription>
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
                    onClick={() => size < 6 && updateMatrixSize(size + 1)}
                    disabled={size >= 6}
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
                <Button onClick={gaussElimination} className="flex-1">
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

              {solution && !error && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Solution</h4>
                  {solution.map((val, i) => (
                    <p key={i} className="text-sm font-mono">
                      x{i + 1} = {val.toFixed(6)}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* System Display */}
              <Card>
                <CardHeader>
                  <CardTitle>Linear System</CardTitle>
                  <CardDescription>Ax = b</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-sm">
                    {matrix.map((row, i) => (
                      <div key={i} className="mb-1">
                        {row.map((val, j) => (
                          <span key={j}>
                            {j > 0 && val >= 0 ? " + " : j > 0 ? " - " : ""}
                            {j > 0 && val < 0 ? Math.abs(val) : val}x{j + 1}
                          </span>
                        ))}
                        {" = "}
                        {constants[i]}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Elimination Steps */}
              {steps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Elimination Steps</CardTitle>
                    <CardDescription>Forward elimination with partial pivoting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {steps.map((step) => (
                        <div key={step.step} className="border rounded-lg p-3">
                          <h4 className="font-semibold mb-2">
                            Step {step.step}: {step.description}
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <tbody>
                                {step.matrix.map((row, i) => (
                                  <tr key={i}>
                                    {row.map((val, j) => (
                                      <td key={j} className="px-2 py-1 text-center border">
                                        {val.toFixed(3)}
                                      </td>
                                    ))}
                                    <td className="px-2 py-1 text-center border font-semibold">
                                      {step.constants[i].toFixed(3)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
