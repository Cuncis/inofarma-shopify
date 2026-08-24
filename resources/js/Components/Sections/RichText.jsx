const WIDTHS = {
    narrow: 'max-w-container-narrow',
    medium: 'max-w-container-medium',
    wide: 'max-w-container',
};

const ALIGN = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

export default function RichText({ section }) {
    return (
        <section className={`mx-auto px-5 py-10 lap:px-10 ${WIDTHS[section.textWidth]} ${ALIGN[section.textAlign]}`}>
            <h2 className="text-xl font-medium text-heading">{section.title}</h2>
            <div
                className="mt-3 text-text"
                dangerouslySetInnerHTML={{ __html: section.content }}
            />
            {section.buttonText && (
                <a
                    href={section.buttonLink}
                    className="mt-4 inline-flex h-12 items-center rounded-sm bg-primary-button-bg px-[30px] font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                >
                    {section.buttonText}
                </a>
            )}
        </section>
    );
}
