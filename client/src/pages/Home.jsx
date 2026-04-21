import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, Zap, Box, BrainCircuit, Workflow, Code2, Database, Terminal, Layers, PlayCircle, Server, Lock, Globe, FileJson, ShieldAlert, Key, Fingerprint, Activity, Network, User, Search, Cpu, LayoutDashboard } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-ui-bg selection:bg-brand-primary selection:text-white pb-24">
            {/* Hero Section */}
            <section className="pt-32 pb-24 md:pt-48 md:pb-32 px-6 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[800px] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>

                <div className="max-w-5xl mx-auto text-center animate-fade-in relative z-10">


                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tight leading-[1.05] mb-8">
                        Learn anything <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
                            fast with AI.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Skip the confusion. We use AI to create clear, step-by-step guides for anything you want to learn. Track your progress, build real projects, and earn a certificate of completion.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 hover:bg-black text-white rounded-full font-medium transition-all shadow-sm hover:shadow-premium flex items-center justify-center gap-2 transform active:scale-95">
                            Get Started
                            <ArrowRight className="w-4 h-4 text-white" />
                        </Link>
                        <a href="#how-to-use" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-full font-medium transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-sm">
                            <PlayCircle className="w-4 h-4" />
                            How it Works
                        </a>
                    </div>
                </div>
            </section>

            {/* How to Use the System: User Workflow */}
            <section id="how-to-use" className="py-24 px-6 bg-white relative z-10 border-t border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Simple Process</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">How it Works.</h3>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">Four simple steps to go from zero to building your own projects.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { num: "01", title: "Create Account", desc: "Sign up in seconds. Your data is kept private and secure using industry-standard protection." },
                            { num: "02", title: "Choose a Skill", desc: "Search for anything you want to learn. Our AI will instantly build a custom path just for you." },
                            { num: "03", title: "Start Lessons", desc: "Follow your step-by-step guide. Mark lessons as done to track your progress and earn points." },
                            { num: "04", title: "Get Certified", desc: "Complete the path and projects to get a certificate that proves your new skills." }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col relative p-6 saas-card bg-gray-50/50 border-none shadow-none">
                                <div className="text-6xl font-black text-gray-200 mb-4 absolute -top-4 -left-2 z-0 pointer-events-none opacity-50">{step.num}</div>
                                <div className="z-10 relative">
                                    <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Engine Deep Dive */}
            <section className="py-24 md:py-32 px-6 bg-gray-50 border-y border-gray-200 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[100px] pointer-events-none mix-blend-overlay"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Visual Node Graph */}
                        <div className="relative h-[400px] bg-white rounded-3xl border border-gray-200 shadow-premium p-8 overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

                            {/* Abstract representation of a DAG */}
                            <div className="relative z-10 w-full max-w-sm">
                                <div className="flex flex-col gap-6 items-center">
                                    {/* Top Node */}
                                    <div className="w-full bg-[#7a7a7a] text-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-sm font-bold flex items-center justify-between z-10 animate-dag-1">
                                        <span>User Intent Payload</span>
                                        <Code2 className="w-4 h-4 opacity-80" />
                                    </div>

                                    {/* Straight Line */}
                                    <div className="w-0.5 h-6 bg-gray-300 -my-7 z-0"></div>

                                    {/* Middle Node */}
                                    <div className="w-full bg-white border-2 border-black p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-sm font-bold flex items-center justify-between z-10 animate-dag-2">
                                        <span className="text-black">System Prompt Injection</span>
                                        <BrainCircuit className="w-5 h-5 text-black" />
                                    </div>

                                    {/* Fork Lines */}
                                    <div className="flex justify-between w-full px-16 -my-7 z-0">
                                        <div className="w-0.5 h-8 bg-gray-300 transform -rotate-[25deg] origin-top"></div>
                                        <div className="w-0.5 h-8 bg-gray-300 transform rotate-[25deg] origin-top"></div>
                                    </div>

                                    {/* Split Nodes */}
                                    <div className="flex gap-4 w-full z-10">
                                        <div className="flex-1 bg-[#f8f9fa] border border-gray-200 p-4 rounded-xl shadow-sm text-xs font-mono text-gray-600 flex items-center justify-center animate-dag-3">
                                            Phase 1: Foundations
                                        </div>
                                        <div className="flex-1 bg-[#f8f9fa] border border-gray-200 p-4 rounded-xl shadow-sm text-xs font-mono text-gray-600 flex items-center justify-center animate-dag-3">
                                            Phase 2: Architecture
                                        </div>
                                    </div>

                                    {/* Straight Line */}
                                    <div className="w-0.5 h-6 bg-gray-300 -my-7 z-0"></div>

                                    {/* Bottom Node */}
                                    <div className="w-full bg-[#111827] text-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-sm font-bold flex items-center justify-center gap-2 z-10 animate-dag-4">
                                        <Database className="w-4 h-4" />
                                        <span>Persist to MongoDB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-4">Our AI Brain</h2>
                            <h3 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">Smart learning, simplified.</h3>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                We use the latest AI models but keep them on a tight leash to ensure you get accurate, high-quality learning paths every time.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <FileJson className="w-6 h-6 text-brand-primary shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Guaranteed Accuracy</h4>
                                        <p className="text-sm text-gray-500">Every lesson is checked to ensure it follows a logical path. No more confusing or broken links.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <Network className="w-6 h-6 text-brand-primary shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Real-World Focused</h4>
                                        <p className="text-sm text-gray-500">We prioritize modern, practical resources so you learn skills that actually matter in the industry today.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* End-to-End Pipeline Animation */}
            <section className="py-24 md:py-32 px-6 bg-white border-b border-gray-200 relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-xs font-bold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 rounded-full px-3 py-1 inline-block uppercase tracking-widest mb-6">End-to-End Visibility</h2>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">From Search to Output.</h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Watch exactly how a concept transforms from a simple query into a fully-fledged, interactive curriculum. Every step is automated and transparent.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Continuous Vertical Line */}
                        <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-100 rounded-full md:left-1/2 md:-ml-0.5"></div>

                        <div className="space-y-12 relative">
                            {/* Step 1 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
                                <div className="absolute left-8 md:left-1/2 md:-ml-0.5 top-0 w-1 h-full pipe-line-1 origin-top"></div>
                                <div className="hidden md:block w-1/2 text-right">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">1. User Access</h4>
                                    <p className="text-sm text-gray-500">Secure JWT authentication validates the session and provisions a secure user context.</p>
                                </div>
                                <div className="z-10 bg-white border-2 border-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm pipe-step-1 relative md:-ml-8 left-0 md:left-auto">
                                    <User className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="md:hidden">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">1. User Access</h4>
                                    <p className="text-sm text-gray-500">Secure JWT authentication validates the session and provisions a secure user context.</p>
                                </div>
                                <div className="hidden md:block w-1/2"></div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
                                <div className="absolute left-8 md:left-1/2 md:-ml-0.5 top-0 w-1 h-full pipe-line-2 origin-top"></div>
                                <div className="hidden md:block w-1/2"></div>
                                <div className="z-10 bg-white border-2 border-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm pipe-step-2 relative md:-ml-8 left-0 md:left-auto">
                                    <Search className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">2. Intent Query</h4>
                                    <p className="text-sm text-gray-500">The user searches for a target skill (e.g., "Advanced System Design"). The input is sanitized and prepared for inference.</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
                                <div className="absolute left-8 md:left-1/2 md:-ml-0.5 top-0 w-1 h-full pipe-line-3 origin-top"></div>
                                <div className="hidden md:block w-1/2 text-right">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">3. Engine Generation</h4>
                                    <p className="text-sm text-gray-500">The backend invokes the Google Gemini Flash model, passing the query alongside strict JSON formatting constraints and taxonomies.</p>
                                </div>
                                <div className="z-10 bg-white border-2 border-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm pipe-step-3 relative md:-ml-8 left-0 md:left-auto">
                                    <Cpu className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="md:hidden">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">3. Engine Generation</h4>
                                    <p className="text-sm text-gray-500">The backend invokes the Google Gemini Flash model, passing the query alongside strict JSON formatting constraints and taxonomies.</p>
                                </div>
                                <div className="hidden md:block w-1/2"></div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
                                <div className="absolute left-8 md:left-1/2 md:-ml-0.5 top-0 w-1 h-full pipe-line-4 origin-top"></div>
                                <div className="hidden md:block w-1/2"></div>
                                <div className="z-10 bg-white border-2 border-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm pipe-step-4 relative md:-ml-8 left-0 md:left-auto">
                                    <Network className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">4. Schema Parsing</h4>
                                    <p className="text-sm text-gray-500">The raw output is systematically validated against Mongoose definitions, fracturing into discrete 'Phases' and 'Topics'.</p>
                                </div>
                            </div>

                            {/* Step 5 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
                                <div className="absolute left-8 md:left-1/2 md:-ml-0.5 top-0 w-1 h-full pipe-line-5 origin-top"></div>
                                <div className="hidden md:block w-1/2 text-right">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">5. Database Persistence</h4>
                                    <p className="text-sm text-gray-500">The newly constructed, perfectly typed Roadmap document is efficiently inserted into the MongoDB Atlas cluster.</p>
                                </div>
                                <div className="z-10 bg-white border-2 border-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm pipe-step-5 relative md:-ml-8 left-0 md:left-auto">
                                    <Database className="w-6 h-6 text-brand-primary" />
                                </div>
                                <div className="md:hidden">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">5. Database Persistence</h4>
                                    <p className="text-sm text-gray-500">The newly constructed, perfectly typed Roadmap document is efficiently inserted into the MongoDB Atlas cluster.</p>
                                </div>
                                <div className="hidden md:block w-1/2"></div>
                            </div>

                            {/* Step 6 */}
                            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
                                <div className="hidden md:block w-1/2"></div>
                                <div className="z-10 bg-brand-primary border-2 border-brand-primary w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-premium pipe-step-6 relative md:-ml-8 left-0 md:left-auto">
                                    <LayoutDashboard className="w-6 h-6 text-white" />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">6. Output Delivery</h4>
                                    <p className="text-sm text-gray-500">The complete JSON payload is routed back to React, instantly rendering the interactive learning path UI.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Deep Dive: How the Backend Works */}
            <section id="backend-architecture" className="py-24 md:py-32 px-6 bg-[#0a0a0a] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] -z-0 pointer-events-none"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-xs font-bold text-brand-primary border border-brand-primary/30 bg-brand-primary/10 rounded-full px-3 py-1 inline-block uppercase tracking-widest mb-6">Backend Infrastructure</h2>
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Inside the Data constraints.</h3>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            SkillRoute relies on a robust Node.js/Express architecture communicating with a MongoDB database cluster. It utilizes Mongoose ODM to enforce strict relational data schemas and field-level validation prior to persistence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">

                        {/* Data Flow Diagram / Text representation */}
                        <div className="space-y-12">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Terminal className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-gray-100">Controller Routing</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                        The Express layer acts as a reverse proxy, catching incoming Axios requests from the React client. Routes are strictly segregated into `/api/auth`, `/api/roadmap`, and `/api/admin`, each protected by role-based middleware.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Server className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-gray-100">Stateless Architecture</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                        The Node.js server itself maintains zero state. User context is entirely derived by decrypting the incoming JSON Web Token on every request. This allows the backend to be horizontally scaled infinitely without sticky sessions.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Database className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-2 text-gray-100">Document Relations (1:N)</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        The `User` collection and `Roadmap` collection are separated. Instead of injecting massive sub-documents into the user model, roadmaps are stored entirely independently, maintaining a foreign key reference (`ObjectId`) back to the parent user.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Backend Architecture Visual */}
                        <div className="bg-[#111111] rounded-2xl border border-white/10 p-2 shadow-2xl relative flex flex-col h-full">
                            <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-6 flex-grow overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Database Schema Extract</h4>
                                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded uppercase tracking-wider">Mongoose ODM</span>
                                </div>

                                {/* Schema Mockup */}
                                <div className="space-y-4 font-mono text-[12px] leading-relaxed text-gray-300">
                                    <div className="p-4 bg-black/40 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                        <div className="text-emerald-400 mb-3 border-b border-white/5 pb-2 text-sm font-bold">// user.model.js</div>
                                        <div><span className="text-[#c678dd]">username</span>: <span className="text-[#e5c07b]">String</span> (Index: true, Unique)</div>
                                        <div><span className="text-[#c678dd]">email</span>: <span className="text-[#e5c07b]">String</span> (Regex: /^\S+@\S+\.\S+$/)</div>
                                        <div><span className="text-[#c678dd]">password</span>: <span className="text-[#e5c07b]">String</span> (Length {'>='} 6, Bcrypt)</div>
                                        <div><span className="text-[#c678dd]">role</span>: <span className="text-[#e5c07b]">Enum</span> ['user', 'admin'] Default: 'user'</div>
                                        <div><span className="text-[#c678dd]">createdAt</span>: <span className="text-[#e5c07b]">Date</span> (Default: Date.now)</div>
                                    </div>

                                    <div className="flex justify-center my-1 text-gray-600">
                                        <ArrowRight className="w-5 h-5 rotate-90" />
                                    </div>

                                    <div className="p-4 bg-black/40 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                        <div className="text-brand-primary mb-3 border-b border-white/5 pb-2 text-sm font-bold">// roadmap.model.js</div>
                                        <div><span className="text-[#c678dd]">user</span>: <span className="text-[#e5c07b]">ObjectId</span> (ref: 'User', Required)</div>
                                        <div><span className="text-[#c678dd]">skill</span>: <span className="text-[#e5c07b]">String</span> (Required)</div>
                                        <div><span className="text-[#c678dd]">isCompleted</span>: <span className="text-[#e5c07b]">Boolean</span> (Default: false)</div>
                                        <div className="mt-3 text-[#56b6c2] font-bold">phases: [</div>
                                        <div className="pl-4"><span className="text-[#c678dd]">title</span>: <span className="text-[#e5c07b]">String</span>,</div>
                                        <div className="pl-4"><span className="text-[#c678dd]">estimatedTime</span>: <span className="text-[#e5c07b]">String</span>,</div>
                                        <div className="pl-4 text-[#56b6c2] font-bold">topics: [</div>
                                        <div className="pl-8"><span className="text-[#c678dd]">name</span>: <span className="text-[#e5c07b]">String</span>,</div>
                                        <div className="pl-8"><span className="text-[#c678dd]">description</span>: <span className="text-[#e5c07b]">String</span>,</div>
                                        <div className="pl-8"><span className="text-[#c678dd]">completed</span>: <span className="text-[#e5c07b]">Boolean</span> (Default: false),</div>
                                        <div className="pl-8 text-[#56b6c2] font-bold">resources: [</div>
                                        <div className="pl-12">url: <span className="text-[#e5c07b]">String</span>,</div>
                                        <div className="pl-12">type: <span className="text-[#e5c07b]">String</span></div>
                                        <div className="pl-8 text-[#56b6c2] font-bold">]</div>
                                        <div className="pl-4 text-[#56b6c2] font-bold">]</div>
                                        <div className="text-[#56b6c2] font-bold">]</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security & Compliance */}
            <section className="py-24 px-6 bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-full px-3 py-1 inline-block uppercase tracking-widest mb-6">Safe and Secure</h2>
                        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">Your data is in good hands.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: ShieldAlert, title: "Private Access", desc: "Your account is protected by industry-standard security. Only you can access your saved paths and progress." },
                            { icon: Key, title: "Secure Password", desc: "We use advanced encryption to keep your password safe. It is never stored in plain text." },
                            { icon: Fingerprint, title: "Data Safety", desc: "Our system is built to prevent common web attacks, keeping your learning experience safe and private." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-8 saas-card border-gray-200">
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                                    <item.icon className="w-8 h-8 text-red-500" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Breakdown */}
            <section className="py-24 px-6 bg-gray-50 border-b border-gray-200">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Technology Vectors</h2>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-12">The production-ready stack.</h3>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        {[
                            { name: "React 18", icon: Code2, desc: "Component architecture, Context API state management, DOM reconciliation." },
                            { name: "Node.js / Express", icon: Server, desc: "Asynchronous I/O runtime powering the RESTful proxy API layer." },
                            { name: "MongoDB + Mongoose", icon: Database, desc: "NoSQL document persistence with strict relationship enforcement." },
                            { name: "Google Gemini 2.5", icon: BrainCircuit, desc: "LLM responsible for deterministic DAG graph generation." },
                            { name: "Vite", icon: Zap, desc: "Lightning-fast HMR and optimized Rollup production bundling." },
                            { name: "Tailwind v4", icon: Box, desc: "Utility-first styling adhering to a strict design token system." },
                            { name: "JWT Auth", icon: Lock, desc: "Secure token-based user verification and boundary checks." },
                            { name: "Axios", icon: Globe, desc: "Promise-based HTTP networking intercepting API requests." }
                        ].map((tech, i) => (
                            <div key={i} className="flex flex-col p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <tech.icon className="w-6 h-6 text-brand-primary mb-4" />
                                <span className="text-sm font-bold text-gray-900 mb-2">{tech.name}</span>
                                <span className="text-xs text-gray-500 leading-relaxed">{tech.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900 rounded-[2rem] p-16 text-center shadow-premium relative overflow-hidden border border-gray-800">
                        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                        <Activity className="w-12 h-12 text-white/50 mx-auto mb-6 relative z-10 animate-pulse" />
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 relative z-10">Start your journey today.</h2>
                        <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto relative z-10 leading-relaxed">Join thousands of learners using AI to master new skills faster than ever before.</p>
                        <Link to="/register" className="inline-flex items-center justify-center px-10 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg relative z-10">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-gray-100 bg-white">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 text-gray-900">
                        <div className="w-8 h-8 bg-gray-900 text-white flex items-center justify-center rounded-lg shadow-sm">
                            <Box className="w-4 h-4" />
                        </div>
                        <span className="font-bold tracking-tight text-lg">SkillRoute</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-gray-500">
                        <a href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Documentation</a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors">Source Code</a>
                    </div>

                    <div className="text-sm text-gray-400 font-medium">
                        © {new Date().getFullYear()} SkillRoute. Locally Executed.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
