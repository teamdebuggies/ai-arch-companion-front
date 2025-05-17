import React from "react";
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

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, onConfirm, data }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
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
            Change variables
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
