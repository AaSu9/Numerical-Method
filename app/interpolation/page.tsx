"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import LinearInterpolationCalculator from "@/components/calculators/linear-interpolation-calculator"
import LagrangeCalculator from "@/components/calculators/lagrange-calculator"
import NewtonDividedDifferenceCalculator from "@/components/calculators/newton-divided-difference-calculator"
import LeastSquaresCalculator from "@/components/calculators/least-squares-calculator"

const methods = [
  {
    id: "linear",
    title: "Linear Interpolation",
    description: "Simple interpolation between two points",
    complexity: "O(1)",
    accuracy: "Linear",
  },
  {
    id: "lagrange",
    title: "Lagrange Interpolation",
    description: "Polynomial interpolation using Lagrange basis",
    complexity: "O(n²)",
    accuracy: "Exact at points",
  },
  {
    id: "newton",
    title: "Newton's Divided Difference",
    description: "Efficient polynomial interpolation",
    complexity: "O(n²)",
    accuracy: "Exact at points",
  },
  {
    id: "least-squares",
    title: "Least Squares Regression",
    description: "Best fit line through data points",
    complexity: "O(n)",
    accuracy: "Approximate",
  },
]

export default function InterpolationPage() {
  const [selectedMethod, setSelectedMethod] = useState("linear")

  const renderCalculator = () => {
    switch (selectedMethod) {
      case "linear":
        return <LinearInterpolationCalculator />
      case "lagrange":
        return <LagrangeCalculator />
      case "newton":
        return <NewtonDividedDifferenceCalculator />
      case "least-squares":
        return <LeastSquaresCalculator />
      default:
        return <LinearInterpolationCalculator />
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Curve Fitting & Interpolation</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Data Fitting Methods</p>
            </div>
          </div>
          <Badge variant="secondary">Interpolation</Badge>
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
                <CardTitle>Interpolation & Curve Fitting Methods</CardTitle>
                <CardDescription>
                  Techniques for estimating values between known data points and fitting curves to data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {methods.map((method) => (
                    <Card key={method.id} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <CardTitle className="text-lg">{method.title}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Complexity:</span>
                            <Badge variant="outline">{method.complexity}</Badge>
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
                <CardDescription>Choose an interpolation method for your data</CardDescription>
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
                <CardTitle>Interpolation Theory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">What is Interpolation?</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Interpolation is the process of estimating unknown values that fall between known values. It's used
                    when we have discrete data points and need to estimate values at intermediate points.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Interpolation vs Extrapolation
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>
                        • <strong>Interpolation:</strong> Estimate within data range
                      </li>
                      <li>
                        • <strong>Extrapolation:</strong> Estimate outside data range
                      </li>
                      <li>• Interpolation is generally more reliable</li>
                      <li>• Extrapolation can be risky for large distances</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Applications</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Computer graphics and animation</li>
                      <li>• Signal processing</li>
                      <li>• Scientific data analysis</li>
                      <li>• Engineering design</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Polynomial Interpolation</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Given n+1 distinct points, there exists a unique polynomial of degree at most n that passes through
                    all points.
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-center font-mono">P(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Error Analysis</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-2">
                    For polynomial interpolation, the error at point x is bounded by:
                  </p>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                    <code>|f(x) - P(x)| ≤ |f⁽ⁿ⁺¹⁾(ξ)| / (n+1)! × |∏(x - xᵢ)|</code>
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
