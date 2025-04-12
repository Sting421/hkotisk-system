
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const StaffLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate("/staff");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hko-background">
      
      
      <main className="pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white rounded-lg shadow-subtle border border-hko-border p-6 sm:p-8 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-hko-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-hko-primary" />
              </div>
              <h1 className="text-2xl font-bold text-hko-text-primary">Staff Login</h1>
              <p className="text-sm text-hko-text-secondary mt-2">
                Enter your credentials to access the staff dashboard
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="staff@hkotisk.com" 
                          {...field}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-4 border-t border-hko-border">
              <div className="text-center text-xs text-muted-foreground">
                Demo credentials:<br />
                Email: admin@hkotisk.com<br />
                Password: password123
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffLogin;
