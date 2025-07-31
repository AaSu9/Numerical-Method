"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, RotateCcw, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MatrixStep {
  step: number
  operation: string
  matrix: number[][]
  explanation: string
}

interface GaussJordanStep {
  iteration: number
  pivotRow: number
  pivotCol: number
  pivotValue: number
  operation: string
  matrix: number[][]
  explanation: string
}

export default function GaussJordanCalculator() {
  const [matrixSize, setMatrixSize] = useState(3)
  const [matrix, setMatrix] = useState<number[][]>([
    [2, 1, -1, 8],
    [-3, -1, 2, -11],
    [-2, 1, 2, -3]
  ])
  const [steps, setSteps] = useState<GaussJordanStep[]>([])
  const [result, setResult] = useState<number[] | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateMatrixSize = (size: number) => {
    setMatrixSize(size)
    const newMatrix: number[][] = []
    for (let i = 0; i < size; i++) {
      const row: number[] = []
      for (let j = 0; j <= size; j++) {
        row.push(0)
      }
      newMatrix.push(row)
    }
    setMatrix(newMatrix)
    setSteps([])
    setResult(null)
    setError(null)
  }

  const updateMatrixElement = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix]
    newMatrix[row][col] = parseFloat(value) || 0
    setMatrix(newMatrix)
  }

  const addRow = () => {
    const newMatrix = [...matrix]
    const newRow = new Array(matrixSize + 1).fill(0)
    newMatrix.push(newRow)
    setMatrix(newMatrix)
    setMatrixSize(matrixSize + 1)
  }

  const removeRow = () => {
    if (matrixSize > 1) {
      const newMatrix = matrix.slice(0, -1)
      setMatrix(newMatrix)
      setMatrixSize(matrixSize - 1)
    }
  }

  const gaussJordanElimination = () => {
    try {
      setIsCalculating(true)
      setError(null)
      setSteps([])

      const augmentedMatrix = matrix.map(row => [...row])
      const n = matrixSize
      const steps: GaussJordanStep[] = []
      let stepCount = 0

      // Forward elimination and backward substitution combined
      for (let i = 0; i < n; i++) {
        // Find pivot
        let maxRow = i
        for (let k = i + 1; k < n; k++) {
          if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
            maxRow = k
          }
        }

        // Swap rows if necessary
        if (maxRow !== i) {
          [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]]
          stepCount++
          steps.push({
            iteration: stepCount,
            pivotRow: i,
            pivotCol: i,
            pivotValue: augmentedMatrix[i][i],
            operation: "Row Swap",
            matrix: augmentedMatrix.map(row => [...row]),
            explanation: `📊 **Step ${stepCount} - Row Swap:**\n\n**Operation:** Swapped row ${i + 1} with row ${maxRow + 1}\n\n**Reason:** To get the largest pivot element in position (${i + 1}, ${i + 1})\n\n**Pivot Value:** ${augmentedMatrix[i][i].toFixed(6)}\n\n**Mathematical reasoning:** Choosing the largest pivot element improves numerical stability and reduces round-off errors.`
          })
        }

        // Check if pivot is zero
        if (Math.abs(augmentedMatrix[i][i]) < 1e-10) {
          setError("System has no unique solution (singular matrix)")
          setIsCalculating(false)
          return
        }

        // Make pivot 1
        const pivot = augmentedMatrix[i][i]
        if (Math.abs(pivot - 1) > 1e-10) {
          for (let j = i; j <= n; j++) {
            augmentedMatrix[i][j] /= pivot
          }
          stepCount++
          steps.push({
            iteration: stepCount,
            pivotRow: i,
            pivotCol: i,
            pivotValue: 1,
            operation: "Make Pivot 1",
            matrix: augmentedMatrix.map(row => [...row]),
            explanation: `📊 **Step ${stepCount} - Normalize Pivot:**\n\n**Operation:** Divide row ${i + 1} by pivot value ${pivot.toFixed(6)}\n\n**Formula:** R${i + 1} = R${i + 1} / ${pivot.toFixed(6)}\n\n**Result:** Pivot element at position (${i + 1}, ${i + 1}) becomes 1\n\n**Mathematical reasoning:** Normalizing the pivot to 1 simplifies the elimination process and makes the reduced row echelon form more apparent.`
          })
        }

        // Eliminate all other elements in column i
        for (let k = 0; k < n; k++) {
          if (k !== i && Math.abs(augmentedMatrix[k][i]) > 1e-10) {
            const factor = augmentedMatrix[k][i]
            for (let j = i; j <= n; j++) {
              augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j]
            }
            stepCount++
            steps.push({
              iteration: stepCount,
              pivotRow: i,
              pivotCol: i,
              pivotValue: 1,
              operation: "Elimination",
              matrix: augmentedMatrix.map(row => [...row]),
              explanation: `📊 **Step ${stepCount} - Elimination:**\n\n**Operation:** Eliminate element at position (${k + 1}, ${i + 1})\n\n**Formula:** R${k + 1} = R${k + 1} - ${factor.toFixed(6)} × R${i + 1}\n\n**Target:** Make element at (${k + 1}, ${i + 1}) equal to 0\n\n**Mathematical reasoning:** This step creates zeros in the pivot column, moving the matrix toward reduced row echelon form where each pivot is the only non-zero element in its column.`
            })
          }
        }
      }

      // Extract solution
      const solution: number[] = []
      for (let i = 0; i < n; i++) {
        solution.push(augmentedMatrix[i][n])
      }

      setSteps(steps)
      setResult(solution)
    } catch (err) {
      setError("Error in calculation. Please check your matrix.")
    } finally {
      setIsCalculating(false)
    }
  }

  const resetCalculation = () => {
    setSteps([])
    setResult(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gauss-Jordan Elimination Calculator</CardTitle>
          <CardDescription>
            Solve systems of linear equations using Gauss-Jordan elimination method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label>Matrix Size</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateMatrixSize(Math.max(1, matrixSize - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{matrixSize}×{matrixSize}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateMatrixSize(matrixSize + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div>
                <Label>Augmented Matrix [A|b]</Label>
                <div className="mt-2 space-y-2">
                  {matrix.map((row, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      {row.map((element, j) => (
                        <Input
                          key={j}
                          value={element}
                          onChange={(e) => updateMatrixElement(i, j, e.target.value)}
                          className="w-16 text-center"
                          type="number"
                          step="0.1"
                        />
                      ))}
                      {j === matrixSize - 1 && <span className="text-gray-500">|</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={addRow} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Row
                </Button>
                <Button onClick={removeRow} variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove Row
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button onClick={gaussJordanElimination} disabled={isCalculating}>
                  <Play className="w-4 h-4 mr-2" />
                  {isCalculating ? "Calculating..." : "Solve"}
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
                  <div className="space-y-1">
                    {result.map((value, index) => (
                      <p key={index} className="text-sm">
                        x{index + 1} = {value.toFixed(6)}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Steps Table */}
              {steps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Gauss-Jordan Steps</CardTitle>
                    <CardDescription>Step-by-step elimination process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">Step {step.iteration}</Badge>
                              <Badge variant="secondary">{step.operation}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Pivot: ({step.pivotRow + 1}, {step.pivotCol + 1}) = {step.pivotValue.toFixed(6)}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <h4 className="font-semibold mb-2">Matrix after step {step.iteration}:</h4>
                            <div className="overflow-x-auto">
                              <Table>
                                <TableBody>
                                  {step.matrix.map((row, i) => (
                                    <TableRow key={i}>
                                      {row.map((element, j) => (
                                        <TableCell key={j} className="text-center">
                                          {element.toFixed(4)}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                          <div className="whitespace-pre-line text-sm leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded">
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