import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="py-16 flex flex-col items-center">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground text-lg">
          We'd love to hear from you. Choose the most convenient way to reach us.
        </p>
      </div>

      <div className="w-full max-w-xl px-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Choose the most convenient way to reach us
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-x-3">
              <Mail className="h-5 w-5 text-primary" />
              <p>support@videosharing.com</p>
            </div>
            <div className="flex items-center gap-x-3">
              <Phone className="h-5 w-5 text-primary" />
              <p>+1 (555) 123-4567</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage; 