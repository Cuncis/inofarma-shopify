export default function AnnouncementBar({ announcement }) {
    if (!announcement) {
        return null;
    }

    return (
        <div className="bg-header-bg text-header-text">
            <div className="mx-auto flex max-w-container items-center justify-center px-5 py-2 text-sm lap:justify-between lap:px-10">
                <span>{announcement.text}</span>
                <a
                    href={announcement.buttonLink}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden text-header-light-text hover:text-header-text lap:inline"
                >
                    {announcement.buttonText}
                </a>
            </div>
        </div>
    );
}
