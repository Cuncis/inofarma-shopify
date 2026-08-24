import PlaceholderImage from '@/Components/UI/PlaceholderImage';

function formatDate(dateString) {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        .format(new Date(dateString));
}

export default function BlogPosts({ section }) {
    return (
        <section className="mx-auto max-w-container px-5 py-10 lap:px-10">
            <h2 className="mb-6 text-xl font-medium text-heading">{section.title}</h2>

            <div className="grid grid-cols-1 gap-6 tablet:grid-cols-3">
                {section.items.map((post) => (
                    <a key={post.link} href={post.link} className="group block">
                        <PlaceholderImage label={post.image} aspect="aspect-[16/10]" className="w-full rounded" zoom />
                        <div className="mt-3">
                            {section.showCategory && (
                                <span className="text-xs font-semibold uppercase text-accent">{post.category}</span>
                            )}
                            <h3 className="mt-1 text-base text-heading transition-colors group-hover:text-accent">{post.title}</h3>
                            <p className="mt-1 text-xs text-text">
                                {section.showAuthor && post.author}
                                {section.showAuthor && section.showDate && ' · '}
                                {section.showDate && formatDate(post.date)}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
