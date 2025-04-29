
"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  Shield,
  AlertTriangle,
  Info,
  Globe,
  Lock,
  Activity,
  Moon,
  Sun,
  AlertCircle,
  Clock,
  ExternalLink,
  List,
  ShieldAlert,
  ShieldCheck,
  FileWarning,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PhishingAnalysisResult {
  url: string
  is_phishing: boolean
  confidence_score: number
  risk_level: string
  detailed_analysis: {
    domain_age?: string
    ssl_status?: string
    suspicious_indicators?: string[]
    recommended_actions?: string[]
  }
  technical_reasoning: string
  method: string
}

export default function PhishingDetector() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<PhishingAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedTheme = localStorage.getItem("darkMode")
    setDarkMode(savedTheme === "true")
  }, [])

  useEffect(() => {
    // Apply dark mode class to the <html> tag
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  const handleDetection = async () => {
    if (!url) {
      setError("Please enter a URL")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // const response = await axios.post("http://127.0.0.1:5000/predict", { url })
      const response = await axios.post("https://phishing-detection-go18.onrender.com/predict", { url })

      setResult(response.data)
    } catch (err) {
      setError("Failed to analyze URL. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, load the sample data
  const loadSampleData = () => {
    const sampleData: PhishingAnalysisResult = {
      confidence_score: 0.4,
      detailed_analysis: {
        domain_age:
          "Unable to ascertain the exact domain age without external API access or WHOIS availability. Manual WHOIS lookup suggests the domain is relatively new (less than 5 years).",
        recommended_actions: [
          "Exercise caution when accessing any files or content within the /docs directory.",
          "Avoid entering any sensitive information if prompted.",
          "Consider using a reputable website reputation checker for further insights.",
        ],
        ssl_status: "Unable to determine SSL status as the URL may not be a website or have certificate enabled.",
        suspicious_indicators: [
          "Uncommon TLD (.info can be associated with less reputable sites compared to .com or .org)",
          "Limited information on domain purpose",
          "Direct access to /docs directory without further context or landing page",
        ],
      },
      is_phishing: false,
      method: "gemini",
      risk_level: "Low",
      technical_reasoning:
        "The URL super1000.info/docs raises some minor concerns but doesn't definitively indicate phishing. The uncommon TLD (.info) and direct access to a `/docs` directory without any introductory landing page or explanation is slightly atypical. A legitimate 'docs' directory should normally provide documentation related to a service or product associated with the domain, but the lack of context is mildly suspicious. Without further investigation of the content within the `/docs` directory and access to domain reputation data, it's difficult to ascertain malicious intent definitively. The absence of SSL/HTTPS, if present in actual page, would significantly elevate the risk score. The 'super1000' prefix in the domain provides no immediate indication of legitimacy or maliciousness; it needs to be contextualized by the content served.",
      url: "super1000.info/docs",
    }
    setResult(sampleData)
  }

  // const getRiskColor = (riskLevel: string) => {
  //   switch (riskLevel) {
  //     case "Critical":
  //       return "bg-red-600 text-white"
  //     case "High":
  //       return "bg-orange-500 text-white"
  //     case "Medium":
  //       return "bg-yellow-500 text-black"
  //     case "Low":
  //       return "bg-green-500 text-white"
  //     default:
  //       return "bg-gray-500 text-white"
  //   }
  // }

  // Fixed function to return only valid Badge variants
  const getRiskBadgeVariant = (riskLevel: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (riskLevel) {
      case "Critical":
        return "destructive"
      case "High":
        return "destructive"
      case "Medium":
        return "secondary" // Changed from "warning"
      case "Low":
        return "outline" // Changed from "success"
      default:
        return "secondary"
    }
  }

  // Get additional class names for badges to maintain color coding
  const getRiskBadgeClassName = (riskLevel: string): string => {
    switch (riskLevel) {
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600 text-black"
      case "Low":
        return "bg-green-500 hover:bg-green-600 text-white border-green-600"
      default:
        return ""
    }
  }

  // const getConfidenceColor = (score: number) => {
  //   if (score > 0.7) return "text-red-500"
  //   if (score > 0.4) return "text-yellow-500"
  //   return "text-green-500"
  // }

  // // Function to get the progress bar color based on confidence score
  // const getProgressIndicatorClass = (score: number) => {
  //   if (score > 0.7) return "bg-red-500"
  //   if (score > 0.4) return "bg-yellow-500"
  //   return "bg-green-500"
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-4 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Shield className="mr-3 text-blue-600 dark:text-blue-400" size={32} />
            URL Phishing Detector
          </h1>
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-800" size={20} />}
          </button>
        </div>

        {/* URL Input */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to check (e.g., https://example.com)"
                className="flex-grow px-4 py-3 border-2 border-blue-300 dark:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDetection}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "Analyzing..." : "Detect"}
                </button>
                <button
                  onClick={loadSampleData}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Load sample data"
                >
                  <FileWarning size={20} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative mb-6 transition-all flex items-center">
            <AlertCircle className="mr-2 flex-shrink-0" size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 mb-8">
            {/* Summary Card */}
            <Card
              className="overflow-hidden border-t-4"
              style={{ borderTopColor: result.is_phishing ? "#ef4444" : "#22c55e" }}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {result.is_phishing ? (
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <ShieldAlert className="text-red-600 dark:text-red-400" size={28} />
                      </div>
                    ) : (
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <ShieldCheck className="text-green-600 dark:text-green-400" size={28} />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl">
                        {result.is_phishing ? "Potential Phishing Threat" : "Safe Website"}
                      </CardTitle>
                      <CardDescription>Analysis completed using deep learning method</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={getRiskBadgeVariant(result.risk_level)} 
                    className={`text-sm px-3 py-1 ${getRiskBadgeClassName(result.risk_level)}`}
                  >
                    {result.risk_level} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="text-blue-500 dark:text-blue-400 flex-shrink-0" size={18} />
                  <a
                    href={result.url.startsWith("http") ? result.url : `http://${result.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all"
                  >
                    {result.url}
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className={`text-sm font-bold text-amber-50`}>
                      {(result.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  {/* FIXED PART: Remove the indicatorClassName prop and use custom CSS */}
                  <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full bg-amber-50`}
                      style={{ width: `${result.confidence_score * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue="indicators" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="indicators">Suspicious Indicators</TabsTrigger>
                <TabsTrigger value="actions">Recommended Actions</TabsTrigger>
                <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="indicators" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="text-yellow-500" size={20} />
                      Suspicious Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.detailed_analysis?.suspicious_indicators &&
                    result.detailed_analysis.suspicious_indicators.length > 0 ? (
                      <ul className="space-y-2">
                        {result.detailed_analysis.suspicious_indicators.map((indicator, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                            <span>{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No suspicious indicators found.</p>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="text-blue-500" size={20} />
                        Domain Age
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{result.detailed_analysis?.domain_age || "Information not available"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lock className="text-purple-500" size={20} />
                        SSL Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{result.detailed_analysis?.ssl_status || "Information not available"}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="actions">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <List className="text-blue-500" size={20} />
                      Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.detailed_analysis?.recommended_actions &&
                    result.detailed_analysis.recommended_actions.length > 0 ? (
                      <ul className="space-y-3">
                        {result.detailed_analysis.recommended_actions.map((action, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                          >
                            <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 flex-shrink-0 mt-0.5">
                              <Info className="text-blue-600 dark:text-blue-400" size={16} />
                            </div>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No recommended actions available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="text-indigo-500" size={20} />
                      Technical Reasoning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="whitespace-pre-line">{result.technical_reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
