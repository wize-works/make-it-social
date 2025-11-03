import Link from 'next/link';

export function SiteFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-base-300 border-t border-base-content border-opacity-10">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <i className="fa-solid fa-duotone fa-rocket text-3xl text-primary"></i>
                            <span className="text-2xl font-bold">Make It Social</span>
                        </div>
                        <p className="opacity-70 mb-6">
                            AI-powered social media management that saves you time and grows your audience.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content transition-all"
                                aria-label="Twitter"
                            >
                                <i className="fa-brands fa-twitter text-xl"></i>
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content transition-all"
                                aria-label="Facebook"
                            >
                                <i className="fa-brands fa-facebook text-xl"></i>
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content transition-all"
                                aria-label="LinkedIn"
                            >
                                <i className="fa-brands fa-linkedin text-xl"></i>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content transition-all"
                                aria-label="Instagram"
                            >
                                <i className="fa-brands fa-instagram text-xl"></i>
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-duotone fa-box text-primary"></i>
                            Product
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#features" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#integrations" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link href="#changelog" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-duotone fa-building text-secondary"></i>
                            Company
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#about" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#careers" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#blog" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-duotone fa-book text-accent"></i>
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#help" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="#documentation" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="#api" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    API Reference
                                </Link>
                            </li>
                            <li>
                                <Link href="#community" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-base-200 border-t border-base-content border-opacity-10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm opacity-70">
                            © {currentYear} Make It Social. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="#privacy" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                Privacy Policy
                            </Link>
                            <Link href="#terms" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                Terms of Service
                            </Link>
                            <Link href="#cookies" className="link link-hover opacity-70 hover:opacity-100 transition-opacity">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
