import { useState } from 'react';

export default function Footer({ footer }) {
    const [email, setEmail] = useState('');

    return (
        <footer className="bg-header-bg">
            <div className="mx-auto max-w-container px-5 py-12 lap:px-10">
                <div className="grid grid-cols-1 gap-10 tablet:grid-cols-3">
                    <div>
                        <h3 className="font-medium uppercase text-white">{footer.textColumn.heading}</h3>
                        <p className="mt-3 text-sm text-white/65">{footer.textColumn.content}</p>
                    </div>

                    <div>
                        <h3 className="font-medium uppercase text-white">{footer.linksColumn.heading}</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            {footer.linksColumn.items.map((item) => (
                                <li key={item.label}>
                                    <a href={item.link} className="text-white/65 transition-colors hover:text-white">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium uppercase text-white">{footer.newsletterColumn.heading}</h3>
                        <p className="mt-3 text-sm text-white/65">{footer.newsletterColumn.content}</p>
                        <form
                            onSubmit={(event) => event.preventDefault()}
                            className="mt-3 flex"
                        >
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Email Anda"
                                className="h-10 w-full rounded-sm border border-white/20 bg-white/10 px-3 text-sm text-white transition-colors placeholder:text-white/50 focus:border-white/50 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="ml-2 h-10 flex-shrink-0 rounded-sm bg-primary-button-bg px-4 text-sm font-semibold text-primary-button-text transition-all duration-200 hover:opacity-90 active:scale-95"
                            >
                                Berlangganan
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-10 border-t border-white/15 pt-6 text-center">
                    <p className="text-xs text-white/65">{footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
