export default function AnnouncementBar({ announcement }) {
    if (!announcement) {
        return null;
    }

    return (
        <div className="border-b border-white/10 bg-header-bg text-header-text">
            <div className="mx-auto flex max-w-container items-stretch justify-center gap-4 px-5 text-sm lap:justify-between lap:px-10">
                <span className="flex items-center py-2">{announcement.text}</span>
                <a
                    href={announcement.buttonLink}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden flex-shrink-0 items-center bg-header-accent px-4 text-xs font-semibold text-white transition-opacity hover:opacity-90 lap:flex"
                >
                    {announcement.buttonText}
                </a>
            </div>
        </div>
    );
}
