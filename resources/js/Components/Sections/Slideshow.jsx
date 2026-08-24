import { useEffect, useState } from 'react';
import Icon from '@/Components/UI/Icon';
import PlaceholderImage from '@/Components/UI/PlaceholderImage';

const ASPECT_BY_VARIANT = {
    hero: 'aspect-[16/9]',
    promo: 'aspect-[1739/395] max-mobile:aspect-[750/201]',
    banner: 'aspect-[16/5]',
};

export default function Slideshow({ section }) {
    const { slides, autoplay, cycleSpeed, paginationType, variant } = section;
    const [active, setActive] = useState(0);
    const aspect = ASPECT_BY_VARIANT[variant] ?? 'aspect-[16/9] max-mobile:aspect-[4/3]';

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
        <section className="mx-auto max-w-container px-5 py-6 lap:px-10">
            <div className={`relative w-full overflow-hidden rounded-lg bg-secondary-background ${aspect}`}>
                {slides.map((slide, index) => (
                    <div
                        key={slide.image}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === active ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {slide.mobileImage ? (
                            <>
                                <div className="hidden h-full w-full tablet:block">
                                    <PlaceholderImage label={slide.image} aspect="h-full" className="w-full" fit="object-cover" />
                                </div>
                                <div className="block h-full w-full tablet:hidden">
                                    <PlaceholderImage label={slide.mobileImage} aspect="h-full" className="w-full" fit="object-cover" />
                                </div>
                            </>
                        ) : (
                            <PlaceholderImage label={slide.image} aspect="h-full" className="w-full" fit="object-cover" />
                        )}
                    </div>
                ))}

            {showArrows && slides.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => setActive((current) => (current - 1 + slides.length) % slides.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary-background/80 p-2.5 text-heading transition hover:scale-110 hover:bg-secondary-background max-mobile:left-1.5"
                        aria-label="Slide sebelumnya"
                    >
                        <Icon name="arrow-left" className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setActive((current) => (current + 1) % slides.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary-background/80 p-2.5 text-heading transition hover:scale-110 hover:bg-secondary-background max-mobile:right-1.5"
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
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === active ? 'w-6 bg-accent' : 'w-2 bg-secondary-background/80 hover:bg-secondary-background'
                            }`}
                        />
                    ))}
                </div>
            )}
            </div>
        </section>
    );
}
