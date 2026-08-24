import { useEffect, useState } from 'react';
import Icon from '@/Components/UI/Icon';
import PlaceholderImage from '@/Components/UI/PlaceholderImage';

export default function Slideshow({ section }) {
    const { slides, autoplay, cycleSpeed, paginationType } = section;
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!autoplay || slides.length < 2) {
            return undefined;
        }

        const timer = setInterval(() => {
            setActive((current) => (current + 1) % slides.length);
        }, cycleSpeed * 1000);

        return () => clearInterval(timer);
    }, [autoplay, cycleSpeed, slides.length]);

    const showArrows = paginationType === 'arrows' || paginationType === 'both';
    const showDots = paginationType === 'dots' || paginationType === 'both';

    return (
        <section className="relative">
            <PlaceholderImage
                label={slides[active].image}
                aspect="aspect-[21/9] max-mobile:aspect-[4/3]"
                className="w-full"
            />

            {showArrows && slides.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => setActive((current) => (current - 1 + slides.length) % slides.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-secondary-background/80 p-2 text-heading"
                        aria-label="Slide sebelumnya"
                    >
                        <Icon name="arrow-left" className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setActive((current) => (current + 1) % slides.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-secondary-background/80 p-2 text-heading"
                        aria-label="Slide berikutnya"
                    >
                        <Icon name="arrow-right" className="h-4 w-4" />
                    </button>
                </>
            )}

            {showDots && slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.image}
                            type="button"
                            onClick={() => setActive(index)}
                            aria-label={`Ke slide ${index + 1}`}
                            className={`h-2 w-2 rounded-full ${index === active ? 'bg-accent' : 'bg-secondary-background/80'}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
