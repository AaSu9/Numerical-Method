"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, BookOpen, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import EulerMethodCalculator from "@/components/calculators/euler-method-calculator"
import RungeKuttaCalculator from "@/components/calculators/runge-kutta-calculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ODEPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ordinary Differential Equations</h1>
              <p className="text-muted-foreground">Numerical methods for solving ODEs</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">First Order ODEs</Badge>
            <Badge variant="secondary">Initial Value Problems</Badge>
            <Badge variant="secondary">Numerical Integration</Badge>
            <Badge variant="secondary">Step-by-Step Solutions</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calculators" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculators" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculators
            </TabsTrigger>
            <TabsTrigger value="theory" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Theory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculators" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>Euler's Method</span>
                    <Badge variant="outline">1st Order</Badge>
                  </CardTitle>
                  <CardDescription>
                    Simple numerical method for solving first-order ODEs with step-by-step explanations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EulerMethodCalculator />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>Runge-Kutta Methods (RK2 & RK4)</span>
                    <Badge variant="outline">2nd & 4th Order</Badge>
                  </CardTitle>
                  <CardDescription>
                    Advanced numerical methods with detailed K₁, K₂ calculations (RK2) or K₁, K₂, K₃, K₄ calculations (RK4) and comprehensive explanations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RungeKuttaCalculator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="theory" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Introduction to ODEs</CardTitle>
                  <CardDescription>
                    Understanding ordinary differential equations and numerical solutions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3>What are Ordinary Differential Equations?</h3>
                    <p>
                      Ordinary Differential Equations (ODEs) are equations that contain one or more derivatives of an unknown function with respect to a single independent variable. They are fundamental in modeling various physical, biological, and engineering systems.
                    </p>
                    
                    <h3>First-Order ODEs</h3>
                    <p>
                      A first-order ODE has the general form:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <code>dy/dx = f(x, y)</code>
                    </div>
                    <p>
                      where f(x, y) is a given function, and we seek to find y(x) that satisfies this equation.
                    </p>

                    <h3>Initial Value Problems</h3>
                    <p>
                      An initial value problem (IVP) consists of:
                    </p>
                    <ul>
                      <li>A differential equation: dy/dx = f(x, y)</li>
                      <li>An initial condition: y(x₀) = y₀</li>
                    </ul>
                    <p>
                      The goal is to find y(x) for x ≥ x₀.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Numerical Methods for ODEs</CardTitle>
                  <CardDescription>
                    Overview of numerical techniques for solving ODEs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3>Euler's Method</h3>
                    <p>
                      Euler's method is the simplest numerical method for solving ODEs. It approximates the solution by:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <code>yₙ₊₁ = yₙ + h × f(xₙ, yₙ)</code>
                    </div>
                    <p>
                      where h is the step size. This method is first-order accurate.
                    </p>

                    <h3>Runge-Kutta Methods</h3>
                    
                    <h4>RK2 (Heun's Method) - 2nd Order</h4>
                    <p>
                      RK2 uses two function evaluations per step and provides second-order accuracy:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-center space-y-2">
                        <div><code>K₁ = h × f(xₙ, yₙ)</code></div>
                        <div><code>K₂ = h × f(xₙ + h, yₙ + K₁)</code></div>
                        <div><code>yₙ₊₁ = yₙ + (K₁ + K₂)/2</code></div>
                      </div>
                    </div>
                    <p>
                      This method provides better accuracy than Euler's method with reasonable computational cost.
                    </p>

                    <h4>RK4 (Classical) - 4th Order</h4>
                    <p>
                      The RK4 method is a fourth-order accurate method that uses four function evaluations per step:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="text-center space-y-2">
                        <div><code>K₁ = h × f(xₙ, yₙ)</code></div>
                        <div><code>K₂ = h × f(xₙ + h/2, yₙ + K₁/2)</code></div>
                        <div><code>K₃ = h × f(xₙ + h/2, yₙ + K₂/2)</code></div>
                        <div><code>K₄ = h × f(xₙ + h, yₙ + K₃)</code></div>
                        <div><code>yₙ₊₁ = yₙ + (K₁ + 2K₂ + 2K₃ + K₄)/6</code></div>
                      </div>
                    </div>
                    <p>
                      This method provides excellent accuracy and is widely used in practice.
                    </p>

                    <h3>Advantages of Numerical Methods</h3>
                    <ul>
                      <li><strong>Versatility:</strong> Can solve complex ODEs that don't have analytical solutions</li>
                      <li><strong>Accuracy:</strong> Higher-order methods provide excellent accuracy</li>
                      <li><strong>Step-by-step:</strong> Easy to understand and implement</li>
                      <li><strong>Visualization:</strong> Can generate solution curves and graphs</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>
                    Real-world applications of ODEs and numerical methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Physics</h4>
                        <p className="text-sm text-muted-foreground">
                          Motion of particles, heat transfer, fluid dynamics, and electrical circuits
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Biology</h4>
                        <p className="text-sm text-muted-foreground">
                          Population dynamics, chemical reactions, and biological systems modeling
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Engineering</h4>
                        <p className="text-sm text-muted-foreground">
                          Control systems, structural analysis, and signal processing
                        </p>
                      </div>
                    </div>
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
