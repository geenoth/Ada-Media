"use client";
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { firstName, lastName, email, subject, message } = values;
    console.log(values);

    const mailToLink = `mailto:contact@adamedia.lk?subject=${subject}&body=Hello I am ${firstName} ${lastName}, my Email is ${email}. %0D%0A${message}`;

    window.location.href = mailToLink;
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
        <Card className="bg-muted/60 dark:bg-card shadow-lg">
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
                          <Input placeholder="John" {...field} />
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
                          <Input placeholder="Doe" {...field} />
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
                            placeholder="contact@adamedia.lk"
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
                            <SelectTrigger>
                              <SelectValue placeholder={t.formSubject} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="News Tip">
                              News Tip
                            </SelectItem>
                            <SelectItem value="Business Inquiry">
                              Business Inquiry
                            </SelectItem>
                            <SelectItem value="Feedback">
                              Feedback
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
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
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button className="mt-4 bg-[#ac0006] hover:bg-[#8f0909] text-white">{t.formSend}</Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </div>
    </section>
  );
};
