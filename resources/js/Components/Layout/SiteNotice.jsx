import Icon from '@/Components/UI/Icon';

export default function SiteNotice({ notice }) {
    if (!notice) {
        return null;
    }

    return (
        <div className="border-b border-[#f5c400] bg-[#fff8e1] text-[#8a6d00]">
            <div className="mx-auto flex max-w-container items-center gap-2 px-5 py-2 text-sm lap:px-10">
                <Icon name="warning" className="h-4 w-4 flex-shrink-0" />
                <a href={notice.link} target="_blank" rel="noreferrer" className="hover:underline">
                    {notice.message}
                </a>
            </div>
        </div>
    );
}
