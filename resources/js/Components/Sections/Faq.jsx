import { useState } from 'react';
import Icon from '@/Components/UI/Icon';

function AccordionItem({ item }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b border-border py-4">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex w-full items-center justify-between text-left"
            >
                <span className="text-heading">{item.question}</span>
                <Icon
                    name="plus"
                    className={`h-4 w-4 flex-shrink-0 text-heading transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <p className="overflow-hidden text-sm text-text">
                    <span className="block pt-2">{item.answer}</span>
                </p>
            </div>
        </div>
    );
}

export default function Faq({ section }) {
    const hasItems = section.items.length > 0;

    return (
        <section className="mx-auto max-w-container px-5 py-10 lap:px-10">
            <div className={`grid grid-cols-1 gap-10 ${hasItems ? 'lap:grid-cols-2' : ''}`}>
                {hasItems && (
                    <div>
                        {section.items.map((item) => (
                            <AccordionItem key={item.question} item={item} />
                        ))}
                    </div>
                )}

                {section.showContactInfo && (
                    <div className={hasItems ? '' : 'mx-auto w-full max-w-container-medium'}>
                        <h2 className="text-xl font-medium text-heading">{section.contactInfoHeading}</h2>
                        <p className="mt-2 text-sm text-text">{section.contactInfoText}</p>

                        <div className="mt-6 grid gap-4 tablet:grid-cols-2">
                            {section.contacts.map((contact) => (
                                <div key={contact.heading} className="flex gap-3 rounded border border-border bg-secondary-background p-4">
                                    <Icon name={contact.icon} className="h-6 w-6 flex-shrink-0 text-accent" />
                                    <div>
                                        <h3 className="font-medium text-heading">{contact.heading}</h3>
                                        <p className="whitespace-pre-line text-sm text-text">{contact.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
