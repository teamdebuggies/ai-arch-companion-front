import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageUrl: string | null;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, onConfirm, imageUrl }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
        </DialogHeader>

        {imageUrl && (
          <div className="my-4">
            <img
              src={imageUrl}
              alt="Vista previa"
              className="rounded-lg border shadow-sm"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        )}

        <DialogFooter className="flex justify-end gap-2">
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
