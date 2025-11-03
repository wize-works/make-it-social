import Link from 'next/link';

export default function LandingPage() {
    return (
        <main className='min-h-screen surface-ambient'>
            {/* Hero Section */}
            <section className='container mx-auto px-4 py-20 md:py-32'>
                <div className='text-center max-w-4xl mx-auto'>
                    <div className='mb-6 inline-block'>
                        <span className='badge badge-primary badge-lg shadow-glow'>
                            <i className='fa-solid fa-duotone fa-sparkles mr-2'></i>
                            AI-Powered Platform
                        </span>
                    </div>
                    <h1 className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent'>
                        Make It Social
                    </h1>
                    <p className='text-xl md:text-2xl mb-8 opacity-80 max-w-3xl mx-auto'>
                        AI-powered social media management that saves you time and grows your audience across all platforms
                    </p>

                    <div className='flex gap-4 justify-center flex-wrap mb-8'>
                        <Link href='/dashboard' className='btn btn-primary btn-lg shadow-glow hover:shadow-glow-lg transition-all'>
                            <i className='fa-solid fa-duotone fa-rocket mr-2'></i>
                            Get Started Free
                        </Link>
                        <Link href='#features' className='btn btn-outline btn-lg'>
                            <i className='fa-solid fa-duotone fa-play mr-2'></i>
                            Watch Demo
                        </Link>
                    </div>

                    <p className='text-sm opacity-60'>
                        <i className='fa-solid fa-duotone fa-check mr-2 text-success'></i>
                        No credit card required • 14-day free trial
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section id='features' className='container mx-auto px-4 py-20'>
                <div className='text-center mb-16'>
                    <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                        Everything you need to dominate social media
                    </h2>
                    <p className='text-xl opacity-70 max-w-2xl mx-auto'>
                        Powerful features designed to simplify your workflow and amplify your reach
                    </p>
                </div>

                <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                    <div className='card bg-base-200 shadow-lg hover:shadow-glow transition-all duration-300 group'>
                        <div className='card-body text-center'>
                            <div className='text-5xl mb-4'>
                                <i className='fa-solid fa-duotone fa-calendar-days text-primary group-hover:scale-110 transition-transform'></i>
                            </div>
                            <h3 className='card-title justify-center text-2xl mb-2'>Unified Publishing</h3>
                            <p className='opacity-70'>
                                Schedule posts across all platforms from one beautiful calendar. Never miss a posting window again.
                            </p>
                        </div>
                    </div>

                    <div className='card bg-base-200 shadow-lg hover:shadow-glow transition-all duration-300 group'>
                        <div className='card-body text-center'>
                            <div className='text-5xl mb-4'>
                                <i className='fa-solid fa-duotone fa-sparkles text-secondary group-hover:scale-110 transition-transform'></i>
                            </div>
                            <h3 className='card-title justify-center text-2xl mb-2'>AI-Assisted Content</h3>
                            <p className='opacity-70'>
                                Generate captions, hashtags, and content ideas with AI that understands your brand voice.
                            </p>
                        </div>
                    </div>

                    <div className='card bg-base-200 shadow-lg hover:shadow-glow transition-all duration-300 group'>
                        <div className='card-body text-center'>
                            <div className='text-5xl mb-4'>
                                <i className='fa-solid fa-duotone fa-chart-line text-accent group-hover:scale-110 transition-transform'></i>
                            </div>
                            <h3 className='card-title justify-center text-2xl mb-2'>Analytics & Insights</h3>
                            <p className='opacity-70'>
                                Track performance and optimize your social strategy with actionable analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='bg-gradient-primary py-20'>
                <div className='container mx-auto px-4 text-center'>
                    <h2 className='text-4xl md:text-5xl font-bold mb-6 text-primary-content'>
                        Ready to transform your social media?
                    </h2>
                    <p className='text-xl mb-8 text-primary-content opacity-90 max-w-2xl mx-auto'>
                        Join thousands of creators and businesses using Make It Social to grow their audience
                    </p>
                    <Link href='/dashboard' className='btn btn-secondary btn-lg shadow-glow-lg hover:scale-105 transition-all'>
                        <i className='fa-solid fa-duotone fa-rocket mr-2'></i>
                        Start Your Free Trial
                    </Link>
                </div>
            </section>
        </main>
    );
}