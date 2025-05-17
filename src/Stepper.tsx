"use client"

import { useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Cloud, Building2, PackageOpen, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useFormik } from "formik"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Loader from "@/components/ui/loader"
import PreviewModal from "@/PreviewModal"

const steps = [
  { id: "step1", label: "Current State", icon: FileText, description: "Fill out all your information related to the current state of your application." },
  { id: "step2", label: "Industry", icon: Building2, description: "Select the industry you are in." },
  { id: "step3", label: "Cloud Provider", icon: Cloud, description: "Select the desire cloud provider." },
  { id: "step4", label: "Environment", icon: PackageOpen, description: "Select how many environments do you want to deploy to." },
  { id: "step5", label: "Review", icon: FileText, description: "Review your submission and submit it." },
]

const formSchema = z.object({
    actual_state: z.string().min(1, "Current state is required"),
    environment: z.string().min(1, "At least one environment is required"),
    industry: z.string().min(1, "Industry is required"),
    cloud: z.string(),
});
  
type FormValues = z.infer<typeof formSchema>;

// const API_URL = "http://localhost:3333/agents/process"
const API_URL = "https://debuggies.app.n8n.cloud/webhook/cf4ec7e0-f8cc-46cc-95b4-c6e696d43688"

export default function AnimatedStepper() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [dataResponse, setDataResponse] = useState({})
  const [previewModal, setPreviewModal] = useState(false)
  const [chatId, setChatId] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const formik = useFormik<FormValues>({
    initialValues: {
      actual_state: "",
      environment: 'Production',
      industry: "Finance",
      cloud: "AWS",
    },
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        const response = await axios.post(API_URL, {...values, chatId});
        //format data
        if (API_URL !== "https://debuggies.app.n8n.cloud/webhook/cf4ec7e0-f8cc-46cc-95b4-c6e696d43688") {
          setDataResponse({...response.data.data, functionalDiagram: response.data.data.diagrams?.functional, infrastructureDiagram: response.data.data.diagrams?.infrastructure})
        }else{
          const formattedData = {
            functionalDiagram: response.data[0].json.mermaid_1,
            infrastructureDiagram: response.data[0].json.mermaid_2,
            rationale: response.data[0].json.markdown_rationale,
            terraform: response.data[0].json.terraform_template,
            architecturalDecisionRecord: response.data[0].json.markdown_architectural_decision_record,
          }
          if (response.data[0].chatId) {
            setChatId(response.data[0].chatId)
          }
          setDataResponse(formattedData)
        }
        setPreviewModal(true)
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false)
      }
    },
  });


  const currentStep = steps[currentIndex]

  const handleNext = () => {
    if (currentIndex < steps.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Step Indicators */}
      <div className="relative flex items-center justify-between mb-8">
        {/* Background line */}
        <div className="absolute left-6 right-6 top-[20px] h-1 bg-muted rounded-full z-0" />

        {/* Progress line */}
        <motion.div
          className="absolute top-[20px] left-6 h-1 bg-primary rounded-full z-10"
          initial={{ width: 0 }}
          animate={{
            width: `${(currentIndex / (steps.length - 1)) * 95}%`,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Step Icons */}
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = idx === currentIndex
          const isComplete = idx < currentIndex

          return (
            <div key={step.id} className="relative z-20 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-primary text-white"
                    : isComplete
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm mt-2 text-center">{step.label}</span>
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        <div className="relative min-h-[200px]">
            <AnimatePresence mode="wait">
            <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="p-6 rounded-xl"
            >
                <h3 className="text-xl font-semibold mb-2 text-center">{currentStep.label}</h3>
                    {currentStep.id === "step1" && (
                        <>
                            <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                            <Textarea className="mt-4 w-full" placeholder="Type all relevant information here." name="actual_state" id="actualState" onChange={formik.handleChange} value={formik.values.actual_state} />
                        </>
                    )}
                    {currentStep.id === "step2" && (
                        <>
                            <p className="text-sm text-muted-foreground mb-4">{currentStep.description}</p>
                            <Select name="industry" onValueChange={formik.handleChange} value={formik.values.industry}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Healthcare" disabled>Healthcare<Badge className="bg-yellow-400">Premium</Badge></SelectItem>
                                    <SelectItem value="Education" disabled>Education<Badge className="bg-yellow-400">Premium</Badge></SelectItem>
                                    <SelectItem value="Technology" disabled>Technology<Badge className="bg-yellow-400">Premium</Badge></SelectItem>
                                    <SelectItem value="Manufacturing" disabled>Manufacturing<Badge className="bg-yellow-400">Premium</Badge></SelectItem>
                                    <SelectItem value="Retail" disabled>Retail<Badge className="bg-yellow-400">Premium</Badge></SelectItem>
                                    <SelectItem value="Energy" disabled>Energy<Badge className="bg-yellow-400">Premium</Badge></SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    )}
                    {currentStep.id === "step3" && (
                        <>
                            <p className="text-sm text-muted-foreground mb-4">{currentStep.description}</p>
                            <Select name="cloud" onValueChange={formik.handleChange} value={formik.values.cloud}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an cloud provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AWS">AWS</SelectItem>
                                    <SelectItem value="GCP" disabled>GCP<Badge className="bg-yellow-400">Premium</Badge></SelectItem>
                                    <SelectItem value="Azure" disabled>Azure<Badge className="bg-yellow-400">Premium</Badge></SelectItem>
                                    <SelectItem value="Suggest" disabled>Suggest me one</SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    )}
                    {currentStep.id === "step4" && (
                        <>
                            <p className="text-sm text-muted-foreground mb-4">{currentStep.description}</p>
                            <div className="flex flex-col space-y-2">
                              <div className="flex space-x-2 items-center">
                                <Checkbox
                                  checked={formik.values.environment.includes("Production")}
                                  name="environment"
                                  id="environment-prod"
                                />
                                <label htmlFor="environment">
                                  Production
                                </label>
                              </div>
                              <div className="flex space-x-2 items-center">
                                <Checkbox
                                  disabled
                                  name="environment"
                                  id="environment-staging"
                                />
                                <label htmlFor="environment">
                                  Staging<Badge className="bg-yellow-400 ml-2">Premium</Badge>
                                </label>
                              </div>
                              <div className="flex space-x-2 items-center">
                                <Checkbox
                                  disabled
                                  name="environment"
                                  id="environment-dev"
                                />
                                <label htmlFor="environment">
                                  Development<Badge className="bg-yellow-400 ml-2">Premium</Badge>
                                </label>
                              </div>
                            </div>
                        </>
                    )}
                    {currentStep.id === "step5" && (
                        <form onSubmit={formik.handleSubmit}>
                            <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                            <ul>
                              <li className="mb-2 mt-2">
                                <div className="flex justify-between items-center">
                                  <b>Actual state:</b>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="h-8 w-8"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                                {isEditing ? (
                                  <Textarea 
                                    className="mt-2 w-full" 
                                    name="actual_state" 
                                    value={formik.values.actual_state}
                                    onChange={formik.handleChange}
                                    placeholder="Type all relevant information here."
                                    autoFocus
                                  />
                                ) : (
                                  <p className="mt-2 whitespace-pre-wrap" style={{ lineHeight: 1.2 }}>
                                    {formik.values.actual_state}
                                  </p>
                                )}
                              </li>
                              <li className="mb-2"><b>Industry:</b><br /> <p>{formik.values.industry}</p></li>
                              <li className="mb-2"><b>Cloud provider:</b><br /> <p>{formik.values.cloud}</p></li>
                              <li className="mb-2"><b>Environment:</b><br /> <p>{formik.values.environment}</p></li>
                            </ul>
                        </form>
                    )}
            </motion.div>
            </AnimatePresence>
        </div>
        <div className="flex justify-between self-end mx-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={currentIndex === 0}>
                    Back
                </Button>
                {currentIndex < steps.length - 1 ? (
                    <Button type="button" onClick={handleNext}>Next</Button>
                ) : (
                    <Button type="submit" disabled={isEditing} onClick={() => formik.handleSubmit()}>Submit</Button>
                )}
        </div>
        {isLoading && <Loader text="Loading..." />}
        <PreviewModal
          open={previewModal}
          onClose={() => setPreviewModal(false)}
          onConfirm={() => setPreviewModal(false)}
          data={dataResponse}
        />
      </div>
    </div>
  )
}
