import { useEffect, useState } from 'react';
import Icon from '@/Components/UI/Icon';
import PlaceholderImage from '@/Components/UI/PlaceholderImage';

export default function Testimonials({ section }) {
    const { items, autoRotate, rotateSpeed } = section;
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!autoRotate || items.length < 2) {
            return undefined;
        }

        const timer = setInterval(() => {
            setActive((current) => (current + 1) % items.length);
        }, rotateSpeed * 1000);

        return () => clearInterval(timer);
    }, [autoRotate, rotateSpeed, items.length]);

    const testimonial = items[active];

    return (
        <section className="mx-auto max-w-container-narrow px-5 py-10 text-center lap:px-10">
            <h2 className="mb-6 text-xl font-medium text-heading">{section.title}</h2>

            <div key={active} className="flex animate-fade-in-up flex-col items-center gap-4">
                <PlaceholderImage label={testimonial.image} aspect="aspect-square" className="h-16 w-16 rounded-full" />
                <p className="text-heading">{testimonial.title}</p>
                <p className="text-sm text-text">{testimonial.content}</p>
                <span className="text-sm font-semibold text-heading">{testimonial.author}</span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
                <button
                    type="button"
                    onClick={() => setActive((current) => (current - 1 + items.length) % items.length)}
                    aria-label="Testimoni sebelumnya"
                    className="text-heading transition hover:scale-110 hover:text-accent"
                >
                    <Icon name="arrow-left" className="h-4 w-4" />
                </button>

                <div className="flex gap-2">
                    {items.map((item, index) => (
                        <button
                            key={item.author}
                            type="button"
                            onClick={() => setActive(index)}
                            aria-label={`Testimoni ${index + 1}`}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === active ? 'w-6 bg-accent' : 'w-2 bg-border hover:bg-heading/40'
                            }`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => setActive((current) => (current + 1) % items.length)}
                    aria-label="Testimoni berikutnya"
                    className="text-heading transition hover:scale-110 hover:text-accent"
                >
                    <Icon name="arrow-right" className="h-4 w-4" />
                </button>
            </div>
        </section>
    );
}
