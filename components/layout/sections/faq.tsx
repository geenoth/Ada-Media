"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/app/providers";
import { locales } from "@/lib/locales";

export const FAQSection = () => {
  const { language } = useLanguage();
  const t = locales[language];

  return (
    <section id="faq" className="container md:w-[700px] py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="text-lg text-[#ac0006] text-center mb-2 tracking-wider">
          {t.faqTitle}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          {t.faqSubtitle}
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {t.faqs.map(({ question, answer }, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
