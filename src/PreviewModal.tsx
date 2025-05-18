import React from "react";
import { useState } from "react"
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Mermaid from "@/Mermaid";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: Record<string, string>;
}

const API_URL_GITHUB = "https://debuggies.app.n8n.cloud/webhook/0f1b2c4d-3a5e-4c7b-9f6d-0a2e3f4b5c6d"

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, onConfirm, data }) => {
  
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {
      setIsLoading(true)
      try {
        const response = await axios.post(API_URL_GITHUB, { ...data});
        console.log("Response from GitHub:", response.data);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false)
      }
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">Results</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <div className="my-4">
            <h2 className="text-lg font-semibold mb-2">Functional Diagram</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Mermaid chart={data.functionalDiagram} />
            </div>
          </div>

          <div className="my-4">
            <h2 className="text-lg font-semibold mb-2">Infrastructure Diagram</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Mermaid chart={data.infrastructureDiagram} />
            </div>
          </div>

          <div className="my-4">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{data.rationale}</p>
            </div>
          </div>

          <div className="my-4">
            <h2 className="text-lg font-semibold mb-2">Terraform Code</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap overflow-x-auto">{data.terraform}</pre>
            </div>
          </div>

          <div className="my-4">
            <h2 className="text-lg font-semibold mb-2">Architecture Decision Record</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{data.architecturalDecisionRecord}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant={'outline'} onClick={onClose}>
            Add recommendations
          </Button>
          <Button onClick={onSubmit}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
