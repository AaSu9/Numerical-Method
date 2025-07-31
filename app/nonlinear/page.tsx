"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BisectionCalculator from "@/components/calculators/bisection-calculator"
import NewtonRaphsonCalculator from "@/components/calculators/newton-raphson-calculator"
import SecantCalculator from "@/components/calculators/secant-calculator"
import FixedPointCalculator from "@/components/calculators/fixed-point-calculator"

const methods = [
  {
    id: "bisection",
    title: "Bisection Method",
    description: "Reliable root finding using interval halving",
    convergence: "Linear",
    requirements: "f(a) × f(b) < 0",
  },
  {
    id: "newton-raphson",
    title: "Newton-Raphson Method",
    description: "Fast convergence using derivatives",
    convergence: "Quadratic",
    requirements: "f'(x) ≠ 0",
  },
  {
    id: "secant",
    title: "Secant Method",
    description: "Newton's method without derivatives",
    convergence: "Superlinear",
    requirements: "Two initial points",
  },
  {
    id: "fixed-point",
    title: "Fixed Point Iteration",
    description: "Solve x = g(x) iteratively",
    convergence: "Linear",
    requirements: "|g'(x)| < 1",
  },
]

export default function NonLinearEquations() {
  const [selectedMethod, setSelectedMethod] = useState("bisection")

  const renderCalculator = () => {
    switch (selectedMethod) {
      case "bisection":
        return <BisectionCalculator />
      case "newton-raphson":
        return <NewtonRaphsonCalculator />
      case "secant":
        return <SecantCalculator />
      case "fixed-point":
        return <FixedPointCalculator />
      default:
        return <BisectionCalculator />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Non-Linear Equation Solvers</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Root Finding Methods</p>
            </div>
          </div>
          <Badge variant="secondary">Root Finding</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Non-Linear Equation Solvers</CardTitle>
                <CardDescription>
                  Methods for finding roots of equations f(x) = 0 where analytical solutions are difficult or impossible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {methods.map((method) => (
                    <Card key={method.id} className="border-l-4 border-l-purple-500">
                      <CardHeader>
                        <CardTitle className="text-lg">{method.title}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Convergence:</span>
                            <Badge variant="outline">{method.convergence}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Requirements:</span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">{method.requirements}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Method</CardTitle>
                <CardDescription>Choose a root finding method to solve your equation</CardDescription>
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

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Method Comparison</CardTitle>
                <CardDescription>Compare different root finding methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Method</th>
                        <th className="text-left p-2">Convergence Rate</th>
                        <th className="text-left p-2">Initial Requirements</th>
                        <th className="text-left p-2">Advantages</th>
                        <th className="text-left p-2">Disadvantages</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Bisection</td>
                        <td className="p-2">Linear</td>
                        <td className="p-2">f(a)×f(b) {"<"} 0</td>
                        <td className="p-2">Always converges, simple</td>
                        <td className="p-2">Slow convergence</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Newton-Raphson</td>
                        <td className="p-2">Quadratic</td>
                        <td className="p-2">x₀, f'(x) ≠ 0</td>
                        <td className="p-2">Fast convergence</td>
                        <td className="p-2">Needs derivative, may diverge</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-medium">Secant</td>
                        <td className="p-2">Superlinear</td>
                        <td className="p-2">x₀, x₁</td>
                        <td className="p-2">No derivative needed</td>
                        <td className="p-2">May diverge, slower than Newton</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Fixed Point</td>
                        <td className="p-2">Linear</td>
                        <td className="p-2">x₀, |g'(x)| {"<"} 1</td>
                        <td className="p-2">Simple iteration</td>
                        <td className="p-2">Convergence not guaranteed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 