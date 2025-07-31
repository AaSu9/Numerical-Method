"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import NumericalDifferentiationCalculator from "@/components/calculators/numerical-differentiation-calculator"
import TrapezoidalCalculator from "@/components/calculators/trapezoidal-calculator"
import SimpsonsCalculator from "@/components/calculators/simpsons-calculator"
import GaussianQuadratureCalculator from "@/components/calculators/gaussian-quadrature-calculator"

const methods = [
  {
    id: "differentiation",
    title: "Numerical Differentiation",
    description: "Forward, backward, and central difference methods",
    accuracy: "O(h) to O(h²)",
    type: "Differentiation",
  },
  {
    id: "trapezoidal",
    title: "Trapezoidal Rule",
    description: "Simple integration using trapezoids",
    accuracy: "O(h²)",
    type: "Integration",
  },
  {
    id: "simpsons",
    title: "Simpson's Rules",
    description: "1/3 and 3/8 rules for integration",
    accuracy: "O(h⁴)",
    type: "Integration",
  },
  {
    id: "gaussian",
    title: "Gaussian Quadrature",
    description: "High-accuracy integration with optimal points",
    accuracy: "Exact for polynomials",
    type: "Integration",
  },
]

export default function NumericalCalculusPage() {
  const [selectedMethod, setSelectedMethod] = useState("differentiation")

  const renderCalculator = () => {
    switch (selectedMethod) {
      case "differentiation":
        return <NumericalDifferentiationCalculator />
      case "trapezoidal":
        return <TrapezoidalCalculator />
      case "simpsons":
        return <SimpsonsCalculator />
      case "gaussian":
        return <GaussianQuadratureCalculator />
      default:
        return <NumericalDifferentiationCalculator />
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Numerical Calculus</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Differentiation & Integration</p>
            </div>
          </div>
          <Badge variant="secondary">Calculus</Badge>
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
                <CardTitle>Numerical Calculus Methods</CardTitle>
                <CardDescription>
                  Approximate derivatives and integrals when analytical solutions are difficult
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {methods.map((method) => (
                    <Card key={method.id} className="border-l-4 border-l-red-500">
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
                            <span className="text-sm font-medium">Accuracy:</span>
                            <span className="text-sm text-slate-600 dark:text-slate-300">{method.accuracy}</span>
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
                <CardDescription>Choose a numerical calculus method</CardDescription>
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
                <CardTitle>Numerical Calculus Theory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Why Numerical Methods?</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Many functions cannot be differentiated or integrated analytically, or the process is too complex.
                    Numerical methods provide practical approximations for these operations.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Numerical Differentiation</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Forward difference: f'(x) ≈ [f(x+h) - f(x)]/h</li>
                      <li>• Backward difference: f'(x) ≈ [f(x) - f(x-h)]/h</li>
                      <li>• Central difference: f'(x) ≈ [f(x+h) - f(x-h)]/(2h)</li>
                      <li>• Central difference has higher accuracy</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Numerical Integration</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Trapezoidal rule: Linear approximation</li>
                      <li>• Simpson's 1/3: Quadratic approximation</li>
                      <li>• Simpson's 3/8: Cubic approximation</li>
                      <li>• Gaussian quadrature: Optimal point selection</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Error Analysis</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    The accuracy of numerical methods depends on step size h and the smoothness of the function.
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Truncation Errors:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Forward/Backward difference: O(h)</li>
                      <li>• Central difference: O(h²)</li>
                      <li>• Trapezoidal rule: O(h²)</li>
                      <li>• Simpson's rules: O(h⁴)</li>
                    </ul>
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
