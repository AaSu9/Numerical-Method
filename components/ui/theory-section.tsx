"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Calculator, Lightbulb, AlertTriangle, CheckCircle, Clock, Target } from "lucide-react"
import { MathBlock, MathInline } from "@/components/ui/math"

interface TheorySectionProps {
  title: string
  description: string
  sections: {
    id: string
    title: string
    content: React.ReactNode
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    timeEstimate: string
  }[]
}

export default function TheorySection({ title, description, sections }: TheorySectionProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription className="text-lg">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="theory">Theory</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path</CardTitle>
              <CardDescription>Follow this structured approach to master the concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {sections.map((section, index) => (
                  <div key={section.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{section.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className={getDifficultyColor(section.difficulty)}>
                          {section.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{section.timeEstimate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Concepts */}
          <Card>
            <CardHeader>
              <CardTitle>Key Concepts</CardTitle>
              <CardDescription>Essential ideas you'll learn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Objectives</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Understand the mathematical foundations and practical applications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calculator className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Implementation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Learn step-by-step computational procedures
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Insights</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Gain intuition about when and why methods work
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Pitfalls</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Common mistakes and how to avoid them
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theory Tab */}
        <TabsContent value="theory" className="space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getDifficultyColor(section.difficulty)}>
                        {section.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {section.timeEstimate}
                      </span>
                    </div>
                    <span className="font-semibold">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="prose dark:prose-invert max-w-none">
                    {section.content}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Worked Examples</CardTitle>
              <CardDescription>Step-by-step solutions to common problems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20 rounded">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    Example 1: Basic Application
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    This example shows the fundamental application of the method with simple inputs.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Example 2: Intermediate Problem
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    A more complex problem that demonstrates advanced features and techniques.
                  </p>
                </div>
                <div className="p-4 border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    Example 3: Real-World Application
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    How this method is applied in engineering and scientific problems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Practice Tab */}
        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Problems</CardTitle>
              <CardDescription>Test your understanding with these exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Problem 1</h4>
                    <Badge variant="outline">Easy</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Solve the basic problem using the fundamental approach.
                  </p>
                  <Button size="sm" variant="outline">
                    View Solution
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Problem 2</h4>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Apply the method to a more challenging scenario.
                  </p>
                  <Button size="sm" variant="outline">
                    View Solution
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Problem 3</h4>
                    <Badge variant="outline">Hard</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Advanced problem requiring deep understanding.
                  </p>
                  <Button size="sm" variant="outline">
                    View Solution
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 