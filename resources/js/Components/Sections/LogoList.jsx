import PlaceholderImage from '@/Components/UI/PlaceholderImage';

export default function LogoList({ section }) {
    return (
        <section className="mx-auto max-w-container px-5 py-6 lap:px-10">
            <div className="grid grid-cols-4 overflow-hidden rounded border border-border bg-secondary-background tablet:grid-cols-8">
                {section.items.map((item) => (
                    <a
                        key={item.text}
                        href={item.link}
                        className="group flex flex-col items-center gap-2 border-b border-r border-border p-4 text-center max-tablet:[&:nth-child(4n)]:border-r-0 max-tablet:[&:nth-child(n+5)]:border-b-0 tablet:border-b-0 tablet:[&:nth-child(8n)]:border-r-0"
                    >
                        <PlaceholderImage
                            label={item.image}
                            aspect="aspect-square"
                            className="w-16"
                        />
                        <span className="text-xs text-heading transition-colors group-hover:text-accent">{item.text}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}
