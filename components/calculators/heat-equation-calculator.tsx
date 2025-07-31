"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, RotateCcw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HeatSolution {
  time: number
  temperature: number[]
}

export default function HeatEquationCalculator() {
  const [gridPoints, setGridPoints] = useState("10")
  const [timeSteps, setTimeSteps] = useState("20")
  const [diffusivity, setDiffusivity] = useState("0.1")
  const [method, setMethod] = useState("explicit")
  const [initialTemp, setInitialTemp] = useState("100")
  const [boundaryTemp, setBoundaryTemp] = useState("0")
  const [result, setResult] = useState<HeatSolution[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [graphData, setGraphData] = useState<Array<{ x: number; [key: string]: number }>>([])

  const solveHeatEquation = () => {
    try {
      setError(null)

      const nx = Number.parseInt(gridPoints)
      const nt = Number.parseInt(timeSteps)
      const alpha = Number.parseFloat(diffusivity)
      const T_init = Number.parseFloat(initialTemp)
      const T_boundary = Number.parseFloat(boundaryTemp)

      const L = 1.0 // Length of domain
      const T_final = 1.0 // Final time
      const dx = L / (nx - 1)
      const dt = T_final / nt
      const r = (alpha * dt) / (dx * dx) // Stability parameter

      // Check stability for explicit method
      if (method === "explicit" && r > 0.5) {
        setError(`Unstable! r = ${r.toFixed(4)} > 0.5. Reduce time step or increase grid points.`)
        return
      }

      // Initialize temperature array
      let T = new Array(nx).fill(T_init)
      T[0] = T_boundary // Left boundary
      T[nx - 1] = T_boundary // Right boundary

      const solutions: HeatSolution[] = []

      // Store initial condition
      solutions.push({
        time: 0,
        temperature: [...T],
      })

      // Time stepping
      for (let n = 0; n < nt; n++) {
        const T_new = [...T]

        if (method === "explicit") {
          // Forward Euler (explicit)
          for (let i = 1; i < nx - 1; i++) {
            T_new[i] = T[i] + r * (T[i + 1] - 2 * T[i] + T[i - 1])
          }
        } else {
          // Backward Euler (implicit) - simplified tridiagonal solve
          const a = new Array(nx).fill(-r)
          const b = new Array(nx).fill(1 + 2 * r)
          const c = new Array(nx).fill(-r)
          const d = [...T]

          // Boundary conditions
          b[0] = 1
          c[0] = 0
          d[0] = T_boundary
          a[nx - 1] = 0
          b[nx - 1] = 1
          d[nx - 1] = T_boundary

          // Thomas algorithm for tridiagonal system
          for (let i = 1; i < nx; i++) {
            const w = a[i] / b[i - 1]
            b[i] -= w * c[i - 1]
            d[i] -= w * d[i - 1]
          }

          T_new[nx - 1] = d[nx - 1] / b[nx - 1]
          for (let i = nx - 2; i >= 0; i--) {
            T_new[i] = (d[i] - c[i] * T_new[i + 1]) / b[i]
          }
        }

        T = T_new

        // Store solution at certain time steps
        if ((n + 1) % Math.max(1, Math.floor(nt / 10)) === 0) {
          solutions.push({
            time: (n + 1) * dt,
            temperature: [...T],
          })
        }
      }

      setResult(solutions)

      // Prepare graph data
      const x_coords = Array.from({ length: nx }, (_, i) => i * dx)
      const graphPoints = x_coords.map((x, i) => {
        const point: { x: number; [key: string]: number } = { x }
        solutions.forEach((sol, j) => {
          point[`t${j}`] = sol.temperature[i]
        })
        return point
      })

      setGraphData(graphPoints)
    } catch (err) {
      setError("Error in calculation. Please check your inputs.")
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setError(null)
    setGraphData([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Heat Equation Solver</CardTitle>
          <CardDescription>Solve 1D heat equation: ∂u/∂t = α∇²u</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="grid-points">Grid Points</Label>
                <Select value={gridPoints} onValueChange={setGridPoints}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 points</SelectItem>
                    <SelectItem value="20">20 points</SelectItem>
                    <SelectItem value="50">50 points</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time-steps">Time Steps</Label>
                <Input
                  id="time-steps"
                  value={timeSteps}
                  onChange={(e) => setTimeSteps(e.target.value)}
                  type="number"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="diffusivity">Thermal Diffusivity (α)</Label>
                <Input
                  id="diffusivity"
                  value={diffusivity}
                  onChange={(e) => setDiffusivity(e.target.value)}
                  type="number"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="method">Numerical Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="explicit">Explicit (Forward Euler)</SelectItem>
                    <SelectItem value="implicit">Implicit (Backward Euler)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="initial-temp">Initial Temperature</Label>
                <Input
                  id="initial-temp"
                  value={initialTemp}
                  onChange={(e) => setInitialTemp(e.target.value)}
                  type="number"
                  step="1"
                />
              </div>

              <div>
                <Label htmlFor="boundary-temp">Boundary Temperature</Label>
                <Input
                  id="boundary-temp"
                  value={boundaryTemp}
                  onChange={(e) => setBoundaryTemp(e.target.value)}
                  type="number"
                  step="1"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={solveHeatEquation} className="flex-1">
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
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Solution Complete</h4>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    <p>Method: {method === "explicit" ? "Explicit" : "Implicit"}</p>
                    <p>Grid points: {gridPoints}</p>
                    <p>Time steps: {timeSteps}</p>
                    {method === "explicit" && (
                      <p>
                        Stability parameter: r ={" "}
                        {(
                          (Number.parseFloat(diffusivity) * Number.parseFloat(timeSteps)) /
                          (Number.parseInt(gridPoints) - 1) ** 2
                        ).toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Temperature Evolution Graph */}
              {graphData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Temperature Evolution</CardTitle>
                    <CardDescription>Temperature distribution over space and time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={graphData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="x" type="number" domain={[0, 1]} />
                          <YAxis />
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              value.toFixed(2),
                              `t = ${name.replace("t", "")}`,
                            ]}
                            labelFormatter={(value: number) => `x = ${value.toFixed(2)}`}
                          />
                          {result?.map((_, index) => (
                            <Line
                              key={index}
                              type="monotone"
                              dataKey={`t${index}`}
                              stroke={`hsl(${(index * 360) / result.length}, 70%, 50%)`}
                              strokeWidth={2}
                              dot={false}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Method Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Heat Equation Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">1D Heat Equation</h4>
                      <div className="text-center font-mono text-lg mb-2">∂u/∂t = α ∂²u/∂x²</div>
                      <p className="text-sm">
                        Where u(x,t) is temperature, α is thermal diffusivity, x is position, and t is time.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Explicit Method</h4>
                        <div className="text-sm space-y-1">
                          <p className="font-mono">
                            u<sub>i</sub>
                            <sup>n+1</sup> = u<sub>i</sub>
                            <sup>n</sup> + r(u<sub>i+1</sub>
                            <sup>n</sup> - 2u<sub>i</sub>
                            <sup>n</sup> + u<sub>i-1</sub>
                            <sup>n</sup>)
                          </p>
                          <p>
                            <strong>Stability:</strong> r = αΔt/Δx² ≤ 0.5
                          </p>
                          <p>
                            <strong>Pros:</strong> Simple, fast per step
                          </p>
                          <p>
                            <strong>Cons:</strong> Stability restriction
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Implicit Method</h4>
                        <div className="text-sm space-y-1">
                          <p className="font-mono">
                            u<sub>i</sub>
                            <sup>n+1</sup> - r(u<sub>i+1</sub>
                            <sup>n+1</sup> - 2u<sub>i</sub>
                            <sup>n+1</sup> + u<sub>i-1</sub>
                            <sup>n+1</sup>) = u<sub>i</sub>
                            <sup>n</sup>
                          </p>
                          <p>
                            <strong>Stability:</strong> Unconditionally stable
                          </p>
                          <p>
                            <strong>Pros:</strong> No stability restriction
                          </p>
                          <p>
                            <strong>Cons:</strong> Requires solving linear system
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Stability Analysis</h4>
                      <p className="text-sm mb-2">For the explicit method, the amplification factor is:</p>
                      <div className="text-center font-mono text-sm mb-2">G = 1 - 4r sin²(kΔx/2)</div>
                      <p className="text-sm">Stability requires |G| ≤ 1, which gives the condition r ≤ 0.5.</p>
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
