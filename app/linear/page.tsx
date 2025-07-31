"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import GaussEliminationCalculator from "@/components/calculators/gauss-elimination-calculator"
import LUDecompositionCalculator from "@/components/calculators/lu-decomposition-calculator"
import JacobiCalculator from "@/components/calculators/jacobi-calculator"
import GaussSeidelCalculator from "@/components/calculators/gauss-seidel-calculator"

const methods = [
  {
    id: "gauss-elimination",
    title: "Gauss Elimination",
    description: "Direct method using row operations",
    complexity: "O(n³)",
    type: "Direct",
  },
  {
    id: "lu-decomposition",
    title: "LU Decomposition",
    description: "Factor matrix into lower and upper triangular",
    complexity: "O(n³)",
    type: "Direct",
  },
  {
    id: "jacobi",
    title: "Jacobi Method",
    description: "Iterative method for diagonally dominant systems",
    complexity: "O(n²) per iteration",
    type: "Iterative",
  },
  {
    id: "gauss-seidel",
    title: "Gauss-Seidel Method",
    description: "Improved iterative method with faster convergence",
    complexity: "O(n²) per iteration",
    type: "Iterative",
  },
]

export default function LinearAlgebraPage() {
  const [selectedMethod, setSelectedMethod] = useState("gauss-elimination")

  const renderCalculator = () => {
    switch (selectedMethod) {
      case "gauss-elimination":
        return <GaussEliminationCalculator />
      case "lu-decomposition":
        return <LUDecompositionCalculator />
      case "jacobi":
        return <JacobiCalculator />
      case "gauss-seidel":
        return <GaussSeidelCalculator />
      default:
        return <GaussEliminationCalculator />
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Linear Algebraic Equations</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">System Solving Methods</p>
            </div>
          </div>
          <Badge variant="secondary">Linear Algebra</Badge>
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
                <CardTitle>Linear System Solving Methods</CardTitle>
                <CardDescription>Techniques for solving systems of linear equations Ax = b</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {methods.map((method) => (
                    <Card key={method.id} className="border-l-4 border-l-teal-500">
                      <CardHeader>
                        <CardTitle className="text-lg">{method.title}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Type:</span>
                            <Badge variant="outline">{method.type}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Complexity:</span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">{method.complexity}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Method</CardTitle>
                <CardDescription>Choose a method to solve your linear system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {methods.map((method) => (
                    <Button
                      key={method.id}
                      variant={selectedMethod === method.id ? "default" : "outline"}
                      onClick={() => setSelectedMethod(method.id)}
                      className="text-sm"
                    >
                      {method.title.split(" ")[0]}
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
                <CardTitle>Linear Systems Theory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">System of Linear Equations</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    A system of n linear equations in n unknowns can be written in matrix form as Ax = b, where A is the
                    coefficient matrix, x is the vector of unknowns, and b is the constant vector.
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                    <code className="text-lg">Ax = b</code>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Direct Methods</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Gauss Elimination with pivoting</li>
                      <li>• LU Decomposition</li>
                      <li>• Exact solution (within round-off error)</li>
                      <li>• Fixed computational cost O(n³)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Iterative Methods</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Jacobi and Gauss-Seidel methods</li>
                      <li>• Successive approximations</li>
                      <li>• Good for sparse matrices</li>
                      <li>• Convergence depends on matrix properties</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Convergence Criteria</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    For iterative methods to converge, the coefficient matrix should be diagonally dominant or positive
                    definite.
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Diagonal Dominance:</h4>
                    <code>|aᵢᵢ| ≥ Σ|aᵢⱼ| for all i ≠ j</code>
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
