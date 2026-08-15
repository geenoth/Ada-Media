import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is Ada Media?",
    answer: "Ada Media is Sri Lanka's most trusted real-time news provider, delivering fast, verified, and engaging video news updates.",
    value: "item-1",
  },
  {
    question: "How does Ada Media verify its news?",
    answer: "Every headline, image, and body text is cross-referenced with multiple independent primary sources before production.",
    value: "item-2",
  },
  {
    question: "Do you use clickbait headlines?",
    answer: "No. Our news is structured with precise, factual Sinhala headlines and objective descriptions without sensationalist exaggeration.",
    value: "item-3",
  },
  {
    question: "What happens if there is an error in a report?",
    answer: "We issue prompt, transparent updates in our video captions and pin the corrected information immediately.",
    value: "item-4",
  },
  {
    question: "How can I send a news tip to Ada Media?",
    answer: "You can reach out to us via our Contact section below or email us directly at contact@adamedia.lk.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="text-lg text-[#ac0006] text-center mb-2 tracking-wider">
          FAQS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Common Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
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
