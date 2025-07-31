"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, UploadCloud, Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { MathBlock } from "@/components/ui/math"

export default function SolvePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ extracted_text: string; solution: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("image", selectedFile)
      const res = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to process image.")
      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
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
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Numerical Solver</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Upload handwritten or printed math problems</p>
            </div>
          </div>
          <Badge variant="secondary">AI OCR + Solver</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Upload an Image</CardTitle>
            <CardDescription>Snap a photo or upload a scan of your math problem. Our AI will extract and solve it!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <AnimatePresence>
                {!previewUrl && (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-12 h-12 text-blue-500 mb-2" />
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Click or drag & drop to upload</span>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {previewUrl && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full flex flex-col items-center"
                  >
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 rounded-lg shadow mb-4 border"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => { setSelectedFile(null); setPreviewUrl(null); setResult(null); setError(null); }}>
                        <XCircle className="w-4 h-4 mr-1" /> Remove
                      </Button>
                      <Button onClick={handleUpload} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                        {loading ? "Solving..." : "Solve"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="w-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-4 text-center"
                  >
                    <XCircle className="inline w-5 h-5 mr-2 align-middle" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    className="w-full bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mt-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-800 dark:text-green-200">Solved!</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-slate-700 dark:text-slate-200">Extracted Math:</span>
                      <MathBlock>{result.extracted_text}</MathBlock>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Solution:</span>
                      <MathBlock>{result.solution}</MathBlock>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}