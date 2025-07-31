"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calculator, BookOpen, Zap, Download, Moon, Sun, Search, UploadCloud } from "lucide-react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const modules = [
  {
    id: "intro",
    title: "Introduction to Numerical Methods",
    description: "Fundamentals, importance, and applications in engineering",
    topics: ["Overview", "Applications", "Computer Arithmetic"],
    color: "bg-blue-500",
    href: "/intro",
    completed: true,
  },
  {
    id: "errors",
    title: "Approximation & Errors",
    description: "Error analysis and significant digits",
    topics: ["Absolute Error", "Relative Error", "Significant Digits"],
    color: "bg-green-500",
    href: "/errors",
    completed: true,
  },
  {
    id: "nonlinear",
    title: "Non-Linear Equation Solvers",
    description: "Root finding methods and iterative solutions",
    topics: ["Bisection", "Newton-Raphson", "Secant", "Fixed-Point"],
    color: "bg-purple-500",
    href: "/nonlinear",
    completed: true,
  },
  {
    id: "interpolation",
    title: "Curve Fitting & Interpolation",
    description: "Data fitting and polynomial interpolation",
    topics: ["Linear", "Lagrange", "Newton's", "Cubic Spline"],
    color: "bg-orange-500",
    href: "/interpolation",
    completed: true,
  },
  {
    id: "calculus",
    title: "Numerical Calculus",
    description: "Differentiation and integration methods",
    topics: ["Differentiation", "Trapezoidal", "Simpson's", "Gaussian"],
    color: "bg-red-500",
    href: "/calculus",
    completed: true,
  },
  {
    id: "linear",
    title: "Linear Algebraic Equations",
    description: "Matrix operations and system solving",
    topics: ["Gauss Elimination", "LU Decomposition", "Iterative Methods"],
    color: "bg-teal-500",
    href: "/linear",
    completed: true,
  },
  {
    id: "ode",
    title: "Ordinary Differential Equations",
    description: "Initial value problems and numerical solutions",
    topics: ["Euler's Method", "Heun's Method", "Runge-Kutta"],
    color: "bg-indigo-500",
    href: "/ode",
    completed: true,
  },
  {
    id: "pde",
    title: "Partial Differential Equations",
    description: "Boundary value problems and finite differences",
    topics: ["Laplace", "Poisson", "Heat Equation", "Wave Equation"],
    color: "bg-pink-500",
    href: "/pde",
    completed: true,
  },
]

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredModules = modules.filter(
    (module) =>
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Numerical Methods Toolkit</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">For Students & Engineers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
            <Link href="/solve">
              <Button variant="default" size="sm" className="ml-2">
                <UploadCloud className="w-4 h-4 mr-2" />
                Solver
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Master Numerical Methods</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Interactive calculators, step-by-step explanations, and comprehensive theory for all major numerical methods
            used in engineering and computer science.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Theory & Examples
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Calculator className="w-4 h-4 mr-2" />
              Interactive Calculators
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Works Offline
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search methods, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module) => (
            <Link key={module.id} href={module.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    {module.completed && (
                      <Badge variant="secondary" className="text-xs">
                        Ready
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {module.topics.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {module.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{module.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 dark:bg-slate-800/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Everything You Need</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From basic concepts to advanced applications, our toolkit provides comprehensive coverage of numerical
              methods with practical implementations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Theory & Concepts</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Detailed explanations with mathematical foundations and real-world applications
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Interactive Calculators</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Step-by-step solutions with iteration tables and convergence analysis
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Offline Ready</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Works completely offline once installed - perfect for exams and fieldwork
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2024 Numerical Methods Toolkit. Built for students and engineers worldwide.
          </p>
        </div>
      </footer>
    </div>
  )
}
