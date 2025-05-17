import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Stepper from "@/Stepper";

//custom components

const BasicForm: React.FC = () => {




  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full p-4">
      <Card className="max-w-xl w-full p-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-200 shadow">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="object-fit scale-90"
            />
          </div>
        </div>
        <CardContent>
            <Stepper />
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicForm;