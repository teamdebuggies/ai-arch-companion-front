import React from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

//custom components
import PreviewModal from "@/PreviewModal";
// import Loader from "@/components/ui/loader";

const formSchema = z.object({
  name: z.string().min(1, "Name required").max(50, "Name too long"),
  email: z.string().email("Invalid email").min(1, "Email required"),
});

type FormValues = z.infer<typeof formSchema>;

const BasicForm: React.FC = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: toFormikValidationSchema(formSchema),
    onSubmit: (values) => {
      // Simulate image preview
      const imageUrl = "https://placehold.co/1280x720"; // Replace with your image URL
      setPreviewImage(imageUrl);
      setShowModal(true);
      // Here you can handle the form submission, e.g., send data to an API
      // For demonstration, we'll just log the values
      console.log("Formulario enviado:", values);
    },
  });




  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 w-full p-4">
      {/* <Loader text="Loading" /> */}
      <Card className="max-w-md w-full p-6">
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
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="mb-2">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="mb-2">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
      <PreviewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          alert("Confirm");
          setShowModal(false);
        }}
        imageUrl={previewImage}
      />
    </div>
  );
};

export default BasicForm;