import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What size tank does my grill use?',
    answer:
      'The most commonly used tank for a barbecue grill is a 20 lb tank, which holds roughly 5 gallons of propane.',
  },
  {
    question: 'Do I have to be home for the delivery and exchange?',
    answer: 'No — just let us know where the tank is located and we’ll do the rest.',
  },
  {
    question: 'How do I know if my grill tank is empty?',
    answer:
      'The most accurate way is to weigh the tank on a scale (carefully!). A standard 20 lb tank weighs roughly 19 lbs empty and 38 lbs full. Since manufacturers vary slightly, expect the empty/full weight to differ by about ±3 lbs.',
  },
  {
    question: 'How do I know what size tank I have?',
    answer:
      'Check the collar of the tank for its imprinted symbols and look for the "WC" (water content) stamp. Give us that number and we can tell you exactly what size tank you have.',
  },
  {
    question: "My grill starts, but the flame is low and won't heat up. What's wrong?",
    answer:
      'This is most often caused by the regulator’s built-in safety "bypass," which trips if the burners are opened before ignition. To reset it: make sure the tank and grill are both off, connect the tank, slowly open the tank valve (one or two turns is enough), then light the main burner before gradually opening the others one at a time. If it still won’t heat up properly after that, the regulator is likely faulty and needs replacing.',
  },
  {
    question: 'I open the valve on my tank when it’s off the grill, but no propane comes out. Why?',
    answer:
      'Grill-size tanks use a one-way safety valve — gas will only flow once the tank is properly connected to an appliance. This is normal and not a defect.',
  },
  {
    question: 'Do you accept competitors’ tanks for exchange (e.g. Blue Rhino, AmeriGas)?',
    answer:
      'Yes — we accept all major competitors’ tanks for exchange, as long as the empty tank you’re trading in is in decent condition with an up-to-date valve.',
  },
];

export default function FAQ() {
  const sectionRef = useScrollAnimation();

  return (
    <section id="faq" ref={sectionRef} className="w-full bg-warm-cream py-20 md:py-40">
      <div className="max-w-[820px] mx-auto px-5 md:px-12">
        <h2
          className="font-display text-[32px] md:text-[56px] text-warm-charcoal text-center mb-4"
          data-animate
          data-y="40"
          data-duration="0.8"
        >
          Frequently Asked Questions
        </h2>
        <p
          className="font-body text-center text-warm-gray/90 max-w-[600px] mx-auto mb-10 md:mb-14"
          data-animate
          data-y="30"
          data-duration="0.7"
        >
          Common questions about tank sizing, delivery, and troubleshooting. Don't see your question? Give us a
          call.
        </p>

        <div
          className="bg-white rounded-xl shadow-card px-6 md:px-8"
          data-animate
          data-y="30"
          data-duration="0.7"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`} className="border-border-light">
                <AccordionTrigger className="font-display text-base md:text-lg text-warm-charcoal hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm md:text-base text-warm-gray leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
