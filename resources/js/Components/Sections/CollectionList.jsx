import PlaceholderImage from '@/Components/UI/PlaceholderImage';

export default function CollectionList({ section }) {
    return (
        <section className="mx-auto max-w-container px-5 py-10 lap:px-10">
            <h2 className="mb-6 text-xl font-medium text-heading">{section.title}</h2>

            <div className="grid grid-cols-3 gap-4 tablet:grid-cols-5">
                {section.items.map((item, index) => (
                    <a
                        key={item.customTitle ?? index}
                        href={item.link ?? '#'}
                        className="group flex flex-col items-center gap-3 rounded border border-border bg-secondary-background p-4 text-center"
                    >
                        <PlaceholderImage
                            label={item.image}
                            aspect="aspect-square"
                            className={`w-full ${section.roundImages ? 'rounded-full' : 'rounded'}`}
                        />
                        {section.showCollectionTitle && item.customTitle && (
                            <span className="text-sm text-heading transition-colors group-hover:text-accent">{item.customTitle}</span>
                        )}
                    </a>
                ))}
            </div>
        </section>
    );
}
