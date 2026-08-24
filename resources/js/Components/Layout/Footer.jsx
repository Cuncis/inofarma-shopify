import { useState } from 'react';

export default function Footer({ footer }) {
    const [email, setEmail] = useState('');

    return (
        <footer className="bg-footer-bg">
            <div className="mx-auto max-w-container px-5 py-12 lap:px-10">
                <div className="grid grid-cols-1 gap-10 tablet:grid-cols-3">
                    <div>
                        <h3 className="font-medium uppercase text-footer-heading">{footer.textColumn.heading}</h3>
                        <p className="mt-3 text-sm text-footer-body">{footer.textColumn.content}</p>
                    </div>

                    <div>
                        <h3 className="font-medium uppercase text-footer-heading">{footer.linksColumn.heading}</h3>
                        <ul className="mt-3 space-y-2 text-sm">
                            {footer.linksColumn.items.map((item) => (
                                <li key={item.label}>
                                    <a href={item.link} className="text-footer-body hover:text-footer-accent">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium uppercase text-footer-heading">{footer.newsletterColumn.heading}</h3>
                        <p className="mt-3 text-sm text-footer-body">{footer.newsletterColumn.content}</p>
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
                                className="h-10 w-full rounded-sm border border-border bg-secondary-background px-3 text-sm focus:border-footer-accent focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="ml-2 h-10 flex-shrink-0 rounded-sm bg-primary-button-bg px-4 text-sm font-semibold text-primary-button-text hover:opacity-90"
                            >
                                Berlangganan
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-10 border-t border-border pt-6 text-center">
                    <p className="text-xs text-footer-body">{footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
