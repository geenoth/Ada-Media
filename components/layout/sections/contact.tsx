"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/app/providers";
import { locales } from "@/lib/locales";

const formSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string(),
});

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { language } = useLanguage();
  const t = locales[language];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "News Tip",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "51717cbd-25a4-4bdb-8094-5fac6282a262",
          subject: `New Inquiry from Ada Media: ${values.subject}`, // This sets the actual Email subject line
          "Inquiry Type": values.subject, // This ensures it shows up in the body of the email
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          message: values.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-lg text-[#ac0006] mb-2 tracking-wider font-semibold uppercase">
          {t.navContact}
        </h2>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.contactTitle}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t.contactDesc}
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <Card 
          className="bg-muted/60 dark:bg-card shadow-none [&_.text-destructive]:!text-[#ac0006]"
          style={{ "--ring": "358 100% 33.7%" } as React.CSSProperties}
        >
          <CardHeader className="text-primary text-2xl" />
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full gap-4"
              >
                <div className="flex flex-col md:!flex-row gap-8">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t.formFirstName}</FormLabel>
                        <FormControl>
                          <Input placeholder="John" className="text-base md:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t.formLastName}</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" className="text-base md:text-sm" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col md:!flex-row gap-8">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t.formEmail}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="johndoe@gmail.com"
                            className="text-base md:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t.formSubject}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="text-base md:text-sm">
                              <SelectValue placeholder={t.formSubject} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="News Tip">
                              {t.subjectNewsTip}
                            </SelectItem>
                            <SelectItem value="Business Inquiry">
                              {t.subjectBusinessInquiry}
                            </SelectItem>
                            <SelectItem value="Feedback">
                              {t.subjectFeedback}
                            </SelectItem>
                            <SelectItem value="Other">{t.subjectOther}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.formMessage}</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="..."
                            className="resize-none text-base md:text-sm"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  disabled={isSubmitting} 
                  className="mt-4 bg-[#ac0006] hover:bg-[#8f0909] text-white"
                >
                  {isSubmitting ? "Sending..." : t.formSend}
                </Button>
                {isSuccess && (
                  <div className="py-2.5 px-4 rounded-md border border-[#ac0006]/20 bg-[#ac0006]/5 text-[#ac0006] text-center">
                    <p className="font-medium text-sm">
                      <CheckCircle2 className="w-4 h-4 inline-block relative -top-[1px] mr-1.5" />
                      {t.formSuccessMessage}
                    </p>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </div>
    </section>
  );
};
