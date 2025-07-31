"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Play, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function ErrorsPage() {
  const [trueValue, setTrueValue] = useState("3.14159")
  const [approxValue, setApproxValue] = useState("3.14")
  const [result, setResult] = useState<{
    absoluteError: number
    relativeError: number
    percentError: number
    significantFigures: number
  } | null>(null)

  const calculateErrors = () => {
    const xTrue = Number.parseFloat(trueValue)
    const xApprox = Number.parseFloat(approxValue)

    const absoluteError = Math.abs(xTrue - xApprox)
    const relativeError = absoluteError / Math.abs(xTrue)
    const percentError = relativeError * 100

    // Estimate significant figures
    let significantFigures = 0
    if (relativeError > 0) {
      significantFigures = Math.floor(-Math.log10(2 * relativeError)) + 1
    }

    setResult({
      absoluteError,
      relativeError,
      percentError,
      significantFigures: Math.max(0, significantFigures),
    })
  }

  const resetCalculation = () => {
    setResult(null)
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Approximation & Errors</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Error Analysis & Significant Digits</p>
            </div>
          </div>
          <Badge variant="secondary">Error Analysis</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="theory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="theory">Theory</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          {/* Theory Tab */}
          <TabsContent value="theory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Analysis Theory</CardTitle>
                <CardDescription>Understanding and quantifying computational errors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Types of Errors</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Inherent Errors</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Errors in input data</li>
                        <li>• Measurement uncertainties</li>
                        <li>• Physical approximations</li>
                        <li>• Cannot be eliminated by computation</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Round-off Errors</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Finite precision arithmetic</li>
                        <li>• Machine epsilon limitations</li>
                        <li>• Accumulation during computation</li>
                        <li>• Can be minimized with careful programming</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Truncation Errors</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Approximating infinite processes</li>
                        <li>• Taylor series truncation</li>
                        <li>• Finite difference methods</li>
                        <li>• Can be reduced by better algorithms</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Blunders</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Programming mistakes</li>
                        <li>• Incorrect formulas</li>
                        <li>• Wrong input values</li>
                        <li>• Can be eliminated by careful checking</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Error Definitions</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Absolute Error</h4>
                      <div className="text-center font-mono text-lg mb-2">E_t = |x_true - x_approx|</div>
                      <p className="text-sm">
                        The absolute error is the magnitude of the difference between the true value and the approximate
                        value. It has the same units as the quantity being measured.
                      </p>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Relative Error</h4>
                      <div className="text-center font-mono text-lg mb-2">ε_t = |x_true - x_approx| / |x_true|</div>
                      <p className="text-sm">
                        The relative error normalizes the absolute error with respect to the true value. It is
                        dimensionless and often expressed as a percentage.
                      </p>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Percent Relative Error</h4>
                      <div className="text-center font-mono text-lg mb-2">ε_t% = (ε_t) × 100%</div>
                      <p className="text-sm">
                        The relative error expressed as a percentage. This is often the most meaningful way to express
                        error.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Significant Figures</h3>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm mb-4">
                      Significant figures are the meaningful digits in a number. They indicate the precision of a
                      measurement or calculation.
                    </p>
                    <h4 className="font-semibold mb-2">Rules for Significant Figures:</h4>
                    <ul className="text-sm space-y-1 mb-4">
                      <li>• All non-zero digits are significant</li>
                      <li>• Zeros between non-zero digits are significant</li>
                      <li>• Leading zeros are not significant</li>
                      <li>• Trailing zeros after decimal point are significant</li>
                      <li>• Trailing zeros in whole numbers may or may not be significant</li>
                    </ul>
                    <div className="bg-white dark:bg-slate-700 p-3 rounded">
                      <h4 className="font-semibold mb-2">Relationship to Error:</h4>
                      <div className="text-center font-mono mb-2">ε_s = 0.5 × 10^(2-n) %</div>
                      <p className="text-sm">
                        Where n is the number of significant figures and ε_s is the percent error.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Error Propagation</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Addition/Subtraction</h4>
                      <div className="text-center font-mono mb-2">δ(x ± y) = √[(δx)² + (δy)²]</div>
                      <p className="text-sm">Absolute errors add in quadrature for addition and subtraction.</p>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Multiplication/Division</h4>
                      <div className="text-center font-mono mb-2">δ(xy) / |xy| = √[(δx/|x|)² + (δy/|y|)²]</div>
                      <p className="text-sm">Relative errors add in quadrature for multiplication and division.</p>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Powers</h4>
                      <div className="text-center font-mono mb-2">δ(x^n) / |x^n| = |n| × (δx / |x|)</div>
                      <p className="text-sm">For powers, the relative error is multiplied by the exponent.</p>
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
                <CardTitle>Error Calculator</CardTitle>
                <CardDescription>Calculate absolute, relative, and percent errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Input Panel */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="true">True Value</Label>
                      <Input
                        id="true"
                        value={trueValue}
                        onChange={(e) => setTrueValue(e.target.value)}
                        type="number"
                        step="any"
                        placeholder="3.14159"
                      />
                    </div>

                    <div>
                      <Label htmlFor="approx">Approximate Value</Label>
                      <Input
                        id="approx"
                        value={approxValue}
                        onChange={(e) => setApproxValue(e.target.value)}
                        type="number"
                        step="any"
                        placeholder="3.14"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={calculateErrors} className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Calculate
                      </Button>
                      <Button variant="outline" onClick={resetCalculation}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>

                    {result && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Results</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Absolute Error:</strong> {result.absoluteError.toExponential(4)}
                          </p>
                          <p>
                            <strong>Relative Error:</strong> {result.relativeError.toExponential(4)}
                          </p>
                          <p>
                            <strong>Percent Error:</strong> {result.percentError.toFixed(4)}%
                          </p>
                          <p>
                            <strong>Significant Figures:</strong> ~{result.significantFigures}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Formulas Panel */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Error Formulas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                          <h4 className="font-semibold mb-1">Absolute Error</h4>
                          <code className="text-sm">E_t = |x_true - x_approx|</code>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                          <h4 className="font-semibold mb-1">Relative Error</h4>
                          <code className="text-sm">ε_t = E_t / |x_true|</code>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                          <h4 className="font-semibold mb-1">Percent Error</h4>
                          <code className="text-sm">ε_t% = ε_t × 100%</code>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                          <h4 className="font-semibold mb-1">Significant Figures</h4>
                          <code className="text-sm">n ≈ -log₁₀(2ε_t) + 1</code>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Example 1: π Approximation</CardTitle>
                  <CardDescription>Error analysis for π ≈ 22/7</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                      <p>
                        <strong>True value:</strong> π = 3.141592654...
                      </p>
                      <p>
                        <strong>Approximation:</strong> 22/7 = 3.142857143...
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Absolute Error:</strong> |3.141592654 - 3.142857143| = 0.001264489
                      </p>
                      <p>
                        <strong>Relative Error:</strong> 0.001264489 / 3.141592654 = 0.0004025
                      </p>
                      <p>
                        <strong>Percent Error:</strong> 0.04025%
                      </p>
                      <p>
                        <strong>Significant Figures:</strong> ~3 digits
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTrueValue("3.141592654")
                        setApproxValue("3.142857143")
                      }}
                    >
                      Load Example
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example 2: Square Root</CardTitle>
                  <CardDescription>Error in √2 approximation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded">
                      <p>
                        <strong>True value:</strong> √2 = 1.414213562...
                      </p>
                      <p>
                        <strong>Approximation:</strong> 1.414
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Absolute Error:</strong> |1.414213562 - 1.414| = 0.000213562
                      </p>
                      <p>
                        <strong>Relative Error:</strong> 0.000213562 / 1.414213562 = 0.000151
                      </p>
                      <p>
                        <strong>Percent Error:</strong> 0.0151%
                      </p>
                      <p>
                        <strong>Significant Figures:</strong> ~4 digits
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTrueValue("1.414213562")
                        setApproxValue("1.414")
                      }}
                    >
                      Load Example
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
