import PlaceholderImage from '@/Components/UI/PlaceholderImage';

export default function CollectionListRectangleImage({ section }) {
    return (
        <section className="mx-auto max-w-container px-5 py-10 lap:px-10">
            <h2 className="mb-6 text-xl font-medium text-heading">{section.title}</h2>

            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 lap:grid-cols-4">
                {section.items.map((item) => (
                    <a
                        key={item.customTitle}
                        href={item.link}
                        className="group block overflow-hidden rounded border border-border transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg"
                    >
                        <PlaceholderImage label={item.image} aspect="aspect-[4/3]" className="w-full" zoom />
                        <div className="bg-secondary-background p-3">
                            <span className="text-sm text-heading transition-colors group-hover:text-accent">{item.customTitle}</span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
