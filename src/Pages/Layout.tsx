const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-[#fafafa] text-black font-sans selection:bg-black selection:text-white">
            <div className="w-full h-3 bg-black"></div>
            <div className="max-w-[1600px] mx-auto flex border-x border-black/15 relative">
                <aside
                    className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-black/15 sticky top-0 h-screen overflow-y-auto p-8">
                    <h1 className="text-4xl font-bold tracking-tighter mb-16">
                        design<span className="font-serif italic text-gray-400">|</span>blog
                    </h1>

                    <nav className="flex flex-col gap-5 text-sm font-bold uppercase tracking-[0.15em] text-zinc-900">
                        <a href="/" className="hover:text-[#BD3900] transition-colors">Architecture</a>
                        <a href="/" className="hover:text-[#BD3900] transition-colors">Art</a>
                        <a href="/" className="hover:text-[#BD3900] transition-colors">Commercial</a>
                        <a href="/" className="hover:text-[#BD3900] transition-colors">Lifestyle</a>
                    </nav>

                    <div className="mt-auto pt-8 border-t border-black/15">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">© 2026 Archive</p>
                    </div>
                </aside>

                <main>
                    <header className="h-14 border-b border-black/15 flex items-center justify-center bg-[#fafafa]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            All Topics
                        </span>
                    </header>
                    <div className="p-8 lg:p-12">
                        {children}
                    </div>
                </main>

                <aside
                    className="hidden xl:flex flex-col w-[320px] shrink-0 border-l border-black/15 sticky top-0 h-screen overflow-y-auto bg-[#fafafa]">
                    <div className="sticky top-0 bg-[#fafafa] pt-8 pb-4 mb-6 border-b border-black/15 z-10">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">Featured</h3>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Dummy Item 1 */}
                        <div className="flex gap-4 group cursor-pointer">
                            <div className="w-20 h-20 bg-zinc-200 shrink-0 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80"
                                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                     alt="house"/>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="text-sm font-bold leading-snug group-hover:text-[#BD3900] transition-colors">A
                                    German Villa Transformed...</h4>
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Architecture</p>
                            </div>
                        </div>

                        {/* Dummy Item 2 */}
                        <div className="flex gap-4 group cursor-pointer">
                            <div className="w-20 h-20 bg-zinc-200 shrink-0 overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400&q=80"
                                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                     alt="chair"/>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="text-sm font-bold leading-snug group-hover:text-[#BD3900] transition-colors">The
                                    Perfect Lounge Chair</h4>
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Design</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Layout