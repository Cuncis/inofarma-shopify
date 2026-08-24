import PlaceholderImage from '@/Components/UI/PlaceholderImage';

export default function LogoList({ section }) {
    return (
        <section className="mx-auto max-w-container px-5 py-10 lap:px-10">
            <div className="grid grid-cols-4 gap-4 tablet:grid-cols-8">
                {section.items.map((item) => (
                    <a key={item.text} href={item.link} className="flex flex-col items-center gap-2 text-center">
                        <PlaceholderImage label={item.image} aspect="aspect-square" className="w-full rounded-full" />
                        <span className="text-xs text-heading">{item.text}</span>
                    </a>
                ))}
            </div>
        </section>
    );
}
