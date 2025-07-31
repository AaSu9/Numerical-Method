"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Calculator, Code, Globe, Lightbulb, Target, Zap } from "lucide-react"
import Link from "next/link"
import TheorySection from "@/components/ui/theory-section"
import { MathBlock, MathInline } from "@/components/ui/math"

const theorySections = [
  {
    id: "importance",
    title: "Introduction and Importance of Numerical Methods",
    difficulty: "Beginner" as const,
    timeEstimate: "15 min",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">What are Numerical Methods?</h3>
          <p className="mb-4">
            Numerical methods are mathematical techniques used to solve problems that cannot be solved analytically 
            or when analytical solutions are too complex to be practical. These methods provide approximate 
            solutions using computational algorithms.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Key Characteristics:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Provide approximate solutions to mathematical problems</li>
              <li>• Use iterative or step-by-step procedures</li>
              <li>• Can handle complex, real-world problems</li>
              <li>• Require computational power for implementation</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Why are Numerical Methods Important?</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20 rounded">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Real-World Applications</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Most engineering and scientific problems cannot be solved exactly. Numerical methods provide 
                practical solutions for complex systems.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Computational Efficiency</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Even when analytical solutions exist, numerical methods can be faster and more efficient 
                for large-scale problems.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Error Control</h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Numerical methods provide systematic ways to control and estimate errors in approximations.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Problem Solving</h4>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Enable solution of problems that would otherwise be impossible to solve analytically.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Historical Development</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Ancient Times</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Early numerical methods for solving practical problems in astronomy, architecture, and commerce.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">17th-18th Centuries</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Development of calculus and early numerical integration methods by Newton, Leibniz, and others.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">20th Century</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rapid development with the advent of computers, leading to sophisticated algorithms and methods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "approximation",
    title: "Approximation and Errors in Computation",
    difficulty: "Intermediate" as const,
    timeEstimate: "20 min",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Types of Errors</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">1. Round-off Errors</h4>
              <p className="text-sm mb-3">
                Errors that occur due to the finite precision of computer arithmetic.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p className="text-sm font-mono">
                  Example: π ≈ 3.14159 (truncated to 6 decimal places)
                </p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">2. Truncation Errors</h4>
              <p className="text-sm mb-3">
                Errors that occur when an infinite process is approximated by a finite one.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <MathBlock>
                  {`e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots`}
                </MathBlock>
                <p className="text-sm mt-2">
                  Truncating after 3 terms: e^x ≈ 1 + x + x²/2! + x³/3!
                </p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">3. Absolute Error</h4>
              <p className="text-sm mb-3">
                The difference between the true value and the approximate value.
              </p>
              <MathBlock>
                {`E_{abs} = |x_{true} - x_{approx}|`}
              </MathBlock>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">4. Relative Error</h4>
              <p className="text-sm mb-3">
                The ratio of absolute error to the true value.
              </p>
              <MathBlock>
                {`E_{rel} = \\frac{|x_{true} - x_{approx}|}{|x_{true}|}`}
              </MathBlock>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Error Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20 rounded">
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Error Propagation</h4>
              <p className="text-sm text-red-700 dark:text-red-400">
                How errors in input data propagate through calculations to affect final results.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Stability</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                A method is stable if small changes in input produce small changes in output.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Significant Digits</h3>
          <p className="mb-4">
            The number of significant digits indicates the precision of a numerical result.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
            <h4 className="font-semibold mb-2">Rules for Significant Digits:</h4>
            <ul className="text-sm space-y-1">
              <li>• All non-zero digits are significant</li>
              <li>• Zeros between non-zero digits are significant</li>
              <li>• Leading zeros are not significant</li>
              <li>• Trailing zeros in a decimal number are significant</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "programming",
    title: "Uses and Importance of Computer Programming in Numerical Methods",
    difficulty: "Intermediate" as const,
    timeEstimate: "25 min",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Why Programming is Essential</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Speed and Efficiency</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Computers can perform millions of calculations per second, making numerical methods practical 
                for large-scale problems.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Accuracy</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automated calculations reduce human error and provide consistent, reproducible results.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Visualization</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Programming enables creation of graphs, charts, and animations to better understand results.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Iteration</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Many numerical methods require thousands of iterations, which would be impractical by hand.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Programming Languages for Numerical Methods</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">P</div>
              <div>
                <h4 className="font-semibold">Python</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Popular for scientific computing with libraries like NumPy, SciPy, and Matplotlib.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">M</div>
              <div>
                <h4 className="font-semibold">MATLAB</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Specialized for numerical computing with built-in functions and toolboxes.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">J</div>
              <div>
                <h4 className="font-semibold">Julia</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  High-performance language designed specifically for numerical analysis.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">R</div>
              <div>
                <h4 className="font-semibold">R</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Statistical computing with extensive packages for data analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Key Programming Concepts</h3>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Loops and Iterations</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Essential for implementing iterative numerical methods like Newton-Raphson or Euler's method.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20 rounded">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Arrays and Matrices</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Fundamental for handling large datasets and solving systems of equations.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Functions</h4>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Modular programming allows reuse of code and better organization of algorithms.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded">
              <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Error Handling</h4>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Robust programs must handle numerical errors, convergence issues, and invalid inputs.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "applications",
    title: "Application of Numerical Computing in Civil Engineering",
    difficulty: "Advanced" as const,
    timeEstimate: "30 min",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Structural Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Finite Element Method</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Numerical solution of partial differential equations for stress analysis, heat transfer, 
                and fluid dynamics in complex structures.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Matrix Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Solving large systems of linear equations for structural displacements and forces.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Geotechnical Engineering</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-l-brown-500 bg-brown-50 dark:bg-brown-900/20 rounded">
              <h4 className="font-semibold text-brown-800 dark:text-brown-300 mb-2">Slope Stability Analysis</h4>
              <p className="text-sm text-brown-700 dark:text-brown-400">
                Numerical methods for analyzing soil slopes and determining safety factors.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-brown-500 bg-brown-50 dark:bg-brown-900/20 rounded">
              <h4 className="font-semibold text-brown-800 dark:text-brown-300 mb-2">Foundation Design</h4>
              <p className="text-sm text-brown-700 dark:text-brown-400">
                Settlement analysis and bearing capacity calculations using numerical integration.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Hydraulic Engineering</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Flow Analysis</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Computational fluid dynamics for analyzing water flow in pipes, channels, and rivers.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Flood Modeling</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Numerical solution of shallow water equations for flood prediction and management.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Transportation Engineering</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20 rounded">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Traffic Flow Modeling</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Differential equations for modeling traffic patterns and optimizing signal timing.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20 rounded">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Pavement Design</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Numerical analysis of pavement stresses and fatigue life prediction.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Construction Management</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Project Scheduling</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optimization algorithms for resource allocation and critical path analysis.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Cost Estimation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Statistical methods and regression analysis for accurate cost predictions.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Environmental Engineering</h3>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Air Quality Modeling</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Numerical solution of diffusion equations for pollutant dispersion analysis.
              </p>
            </div>
            <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Water Treatment</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Chemical reaction kinetics and mass transfer calculations for treatment plant design.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
]

export default function IntroductionPage() {
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Introduction to Numerical Methods</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Fundamentals and Applications</p>
            </div>
          </div>
          <Badge variant="secondary">Chapter 1</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <TheorySection 
          title="Introduction to Numerical Methods"
          description="Master the fundamentals of numerical computation and its applications in engineering"
          sections={theorySections}
        />
      </div>
    </div>
  )
}
