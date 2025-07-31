"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import FiniteDifferenceCalculator from "@/components/calculators/finite-difference-calculator"
import HeatEquationCalculator from "@/components/calculators/heat-equation-calculator"

const methods = [
  {
    id: "finite-difference",
    title: "Finite Difference Method",
    description: "Discretize PDEs using finite differences",
    accuracy: "O(h²) to O(h⁴)",
    applications: "General PDEs",
  },
  {
    id: "heat-equation",
    title: "Heat Equation Solver",
    description: "Solve parabolic PDEs using explicit/implicit methods",
    accuracy: "O(Δt, Δx²)",
    applications: "Diffusion problems",
  },
]

export default function PDEPage() {
  const [selectedMethod, setSelectedMethod] = useState("finite-difference")
  const [i, setI] = useState(0)
  const [j, setJ] = useState(0)
  const [k, setK] = useState(0)

  const renderCalculator = () => {
    switch (selectedMethod) {
      case "finite-difference":
        return <FiniteDifferenceCalculator />
      case "heat-equation":
        return <HeatEquationCalculator />
      default:
        return <FiniteDifferenceCalculator />
    }
  }

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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Partial Differential Equations</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Boundary Value Problems</p>
            </div>
          </div>
          <Badge variant="secondary">PDEs</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Partial Differential Equations</CardTitle>
                <CardDescription>
                  Numerical methods for solving PDEs involving multiple independent variables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {methods.map((method) => (
                    <Card key={method.id} className="border-l-4 border-l-pink-500">
                      <CardHeader>
                        <CardTitle className="text-lg">{method.title}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Accuracy:</span>
                            <Badge variant="outline">{method.accuracy}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Applications:</span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">{method.applications}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types of PDEs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Elliptic PDEs</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Example:</strong> Laplace equation
                      </p>
                      <code className="text-xs">∇²u = 0</code>
                      <p>
                        <strong>Applications:</strong> Steady-state problems, potential theory
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Parabolic PDEs</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Example:</strong> Heat equation
                      </p>
                      <code className="text-xs">∂u/∂t = α∇²u</code>
                      <p>
                        <strong>Applications:</strong> Diffusion, heat conduction
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Hyperbolic PDEs</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Example:</strong> Wave equation
                      </p>
                      <code className="text-xs">∂²u/∂t² = c²∇²u</code>
                      <p>
                        <strong>Applications:</strong> Wave propagation, vibrations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Method</CardTitle>
                <CardDescription>Choose a PDE solving method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {methods.map((method) => (
                    <Button
                      key={method.id}
                      variant={selectedMethod === method.id ? "default" : "outline"}
                      onClick={() => setSelectedMethod(method.id)}
                      className="text-sm"
                    >
                      {method.title.split(" ")[0]} {method.title.split(" ")[1]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {renderCalculator()}
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>PDE Theory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Classification of PDEs</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Second-order linear PDEs can be classified based on their discriminant:
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="text-center font-mono mb-4">Au_xx + Bu_xy + Cu_yy + Du_x + Eu_y + Fu = G</div>
                    <div className="text-center font-mono mb-4">Discriminant: Δ = B² - 4AC</div>
                    <ul className="text-sm space-y-1">
                      <li>• Δ {"<"} 0: Elliptic (e.g., Laplace equation)</li>
                      <li>• Δ = 0: Parabolic (e.g., Heat equation)</li>
                      <li>• Δ {">"} 0: Hyperbolic (e.g., Wave equation)</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Finite Difference Method</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Central Difference Approximations</h4>
                      <div className="space-y-2 text-sm font-mono">
                        <p>
                          ∂u/∂x ≈ (u_{i + 1} - u_{i - 1}) / (2Δx)
                        </p>
                        <p>
                          ∂²u/∂x² ≈ (u_{i + 1} - 2u_{i} + u_{i - 1}) / (Δx)²
                        </p>
                        <p>
                          ∂²u/∂x∂y ≈ (u_{(i + 1, j + 1)} - u_{(i + 1, j - 1)} - u_{(i - 1, j + 1)} + u_{(i - 1, j - 1)})
                          / (4ΔxΔy)
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Five-Point Stencil for Laplacian</h4>
                      <div className="text-center font-mono text-sm mb-2">
                        ∇²u_{(i, j)} ≈ (u_{(i + 1, j)} + u_{(i - 1, j)} + u_{(i, j + 1)} + u_{(i, j - 1)} - 4u_{(i, j)})
                        / h²
                      </div>
                      <p className="text-sm">This is the most common discretization for the 2D Laplacian operator.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Boundary Conditions</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Dirichlet</h4>
                      <div className="text-sm">
                        <p className="font-mono mb-1">u = g on ∂Ω</p>
                        <p>Specifies the value of the function on the boundary.</p>
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Neumann</h4>
                      <div className="text-sm">
                        <p className="font-mono mb-1">∂u/∂n = g on ∂Ω</p>
                        <p>Specifies the normal derivative on the boundary.</p>
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Robin</h4>
                      <div className="text-sm">
                        <p className="font-mono mb-1">αu + β∂u/∂n = g</p>
                        <p>Mixed boundary condition combining value and derivative.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Stability and Convergence</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">CFL Condition</h4>
                      <p className="text-sm mb-2">
                        For explicit time-stepping schemes, the Courant-Friedrichs-Lewy condition must be satisfied:
                      </p>
                      <div className="text-center font-mono">CFL = cΔt/Δx ≤ C_max</div>
                      <p className="text-sm mt-2">Where C_max depends on the specific scheme and PDE type.</p>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Von Neumann Stability Analysis</h4>
                      <p className="text-sm mb-2">Analyzes stability by examining the growth of Fourier modes:</p>
                      <div className="text-center font-mono">u_j^n = ξ^n e^{ikjΔx}</div>
                      <p className="text-sm mt-2">Stability requires |ξ| ≤ 1 for all wave numbers k.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
