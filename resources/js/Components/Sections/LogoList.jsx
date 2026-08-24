import PlaceholderImage from '@/Components/UI/PlaceholderImage';

export default function LogoList({ section }) {
    return (
        <section className="mx-auto max-w-container px-5 py-10 lap:px-10">
            <div className="grid grid-cols-4 gap-4 tablet:grid-cols-8">
                {section.items.map((item) => (
                    <a
                        key={item.text}
                        href={item.link}
                        className="group flex flex-col items-center gap-2 text-center transition-transform duration-300 hover:-translate-y-1"
                    >
                        <PlaceholderImage
                            label={item.image}
                            aspect="aspect-square"
                            className="w-full rounded-full transition-shadow duration-300 group-hover:shadow-lg"
                            zoom
                        />
                        <span className="text-xs text-heading transition-colors group-hover:text-accent">{item.text}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}
