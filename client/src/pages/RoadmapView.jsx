import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

import { CheckCircle, Circle, Award, ArrowLeft, Target, Clock, ExternalLink, ShieldCheck, Trophy, X, LayoutTemplate, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

const RoadmapView = () => {
    const { id } = useParams();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCert, setShowCert] = useState(false);
    const [isGuided, setIsGuided] = useState(true);
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [projectPhaseIndex, setProjectPhaseIndex] = useState(null);
    const [solutionInput, setSolutionInput] = useState('');
    const [submittingProject, setSubmittingProject] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isCapstoneSubmission, setIsCapstoneSubmission] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/roadmap/${id}`);
                setRoadmap(res.data);
                if (res.data.isCompleted) setShowCert(true);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, [id]);

    const toggleTopic = async (phaseIdx, topicIdx) => {
        const updatedPhases = [...roadmap.phases];
        updatedPhases[phaseIdx].topics[topicIdx].completed = !updatedPhases[phaseIdx].topics[topicIdx].completed;

        const totalTopics = updatedPhases.reduce((acc, p) => acc + p.topics.length, 0);
        const completedTopics = updatedPhases.reduce((acc, p) => acc + p.topics.filter(t => t.completed).length, 0);
        
        let allProjectsFinished = true;
        updatedPhases.forEach(p => {
            if (p.handsOnProject && (!p.handsOnProject.solutionUrl || p.handsOnProject.status !== 'Approved')) {
                allProjectsFinished = false;
            }
        });
        if (roadmap.capstoneProject && (!roadmap.capstoneProject.solutionUrl || roadmap.capstoneProject.status !== 'Approved')) {
            allProjectsFinished = false;
        }

        const isCompleted = (totalTopics === completedTopics) && allProjectsFinished;

        try {
            const res = await axios.put(`http://localhost:5000/api/roadmap/${id}/update`, {
                phases: updatedPhases,
                isCompleted
            });
            setRoadmap(res.data);
            if (isCompleted) setShowCert(true);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadPDF = () => {
        setIsGeneratingPDF(true);
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const margin = 15;
            let y = 20;

            pdf.setFontSize(22);
            pdf.setFont('helvetica', 'bold');
            pdf.text(roadmap.skill || 'Roadmap', margin, y);
            y += 10;
            
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 100, 100);
            const desc = roadmap.description || `A step-by-step path to master ${roadmap.skill}.`;
            const splitDesc = pdf.splitTextToSize(desc, 180);
            pdf.text(splitDesc, margin, y);
            y += (splitDesc.length * 6) + 10;

            pdf.setTextColor(0, 0, 0);

            roadmap.phases.forEach((phase, pIdx) => {
                if (y > 270) { pdf.addPage(); y = 20; }
                
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`Phase ${pIdx + 1}: ${phase.name || phase.title || 'Untitled Phase'}`, margin, y);
                y += 6;
                
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'italic');
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Estimated Time: ${phase.estimatedTime || 'Self-paced'}`, margin, y);
                pdf.setTextColor(0, 0, 0);
                y += 10;

                phase.topics.forEach((topic) => {
                    if (y > 280) { pdf.addPage(); y = 20; }
                    
                    pdf.setFontSize(12);
                    pdf.setFont('helvetica', 'bold');
                    const status = topic.completed ? '[Done]' : '[Pending]';
                    pdf.text(`${status} ${topic.title || topic.name}`, margin + 5, y);
                    y += 6;
                    
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    const textDesc = typeof topic.description === 'string' ? topic.description : 'Learn the basics of this section.';
                    const splitDescription = pdf.splitTextToSize(textDesc, 170);
                    pdf.text(splitDescription, margin + 5, y);
                    y += (splitDescription.length * 5) + 3;

                    if (topic.resources && topic.resources.length > 0) {
                        pdf.setFontSize(9);
                        pdf.setFont('helvetica', 'italic');
                        pdf.text('Resources:', margin + 10, y);
                        y += 5;
                        pdf.setFont('helvetica', 'normal');
                        topic.resources.forEach(res => {
                            if (y > 280) { pdf.addPage(); y = 20; }
                            const resType = res.type || res.name || 'Link';
                            const resUrl = res.url || '';
                            const resText = `- ${resType}: ${resUrl}`;
                            const splitRes = pdf.splitTextToSize(resText, 160);
                            pdf.text(splitRes, margin + 10, y);
                            y += (splitRes.length * 5);
                        });
                        y += 2;
                    }
                    y += 4;
                });

                if (phase.handsOnProject) {
                    if (y > 260) { pdf.addPage(); y = 20; }
                    y += 4;
                    pdf.setFontSize(14);
                    pdf.setFont('helvetica', 'bold');
                    const projStatus = phase.handsOnProject.completed ? '[Done]' : '[Pending]';
                    pdf.text(`Project: ${phase.handsOnProject.title} ${projStatus}`, margin + 5, y);
                    y += 6;
                    
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    const textProjDesc = typeof phase.handsOnProject.description === 'string' ? phase.handsOnProject.description : '';
                    const splitProjDesc = pdf.splitTextToSize(textProjDesc, 170);
                    pdf.text(splitProjDesc, margin + 5, y);
                    y += (splitProjDesc.length * 5) + 8;
                }
                
                y += 6;
            });

            if (roadmap.capstoneProject) {
                if (y > 260) { pdf.addPage(); y = 20; }
                y += 5;
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`Capstone Project: ${roadmap.capstoneProject.title}`, margin, y);
                y += 6;
                
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                const textCapDesc = typeof roadmap.capstoneProject.description === 'string' ? roadmap.capstoneProject.description : '';
                const splitProjDesc = pdf.splitTextToSize(textCapDesc, 180);
                pdf.text(splitProjDesc, margin, y);
                y += (splitProjDesc.length * 5) + 10;
            }

            let fileName = roadmap.skill ? roadmap.skill.replace(/[^a-zA-Z0-9]/g, '_') : 'Roadmap';
            pdf.save(`${fileName}_Roadmap.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        let url = solutionInput.trim();
        if (!url) return;

        // Auto-prefix https:// if missing
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        setSubmittingProject(true);
        try {
            const endpoint = isCapstoneSubmission 
                ? `http://localhost:5000/api/roadmap/${id}/capstone/project`
                : `http://localhost:5000/api/roadmap/${id}/phase/${projectPhaseIndex}/project`;

            const res = await axios.put(endpoint, {
                solutionUrl: url
            });
            setRoadmap(res.data);
            setProjectModalOpen(false);
            setSolutionInput('');
            setIsCapstoneSubmission(false);
        } catch (err) {
            console.error('Failed to submit project:', err);
        } finally {
            setSubmittingProject(false);
        }
    };

    if (loading) return <LoadingScreen />;
    if (!roadmap) return (
        <div className="p-12 text-center text-gray-500 font-medium tracking-wide animate-fade-in min-h-screen flex items-center justify-center bg-gray-50">
            Path not found or unavailable.
        </div>
    );

    const totalTopics = roadmap.phases.reduce((acc, p) => acc + p.topics.length, 0);
    const completedTopics = roadmap.phases.reduce((acc, p) => acc + p.topics.filter(t => t.completed).length, 0);
    const progress = Math.round((completedTopics / totalTopics) * 100);

    return (
        <div className="min-h-screen bg-ui-bg font-sans">
            {/* Minimalist Top Bar */}
            <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-50">
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={downloadPDF}
                        disabled={isGeneratingPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                    </button>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sync Active</span>
                    </div>
                    {roadmap.isCompleted && (
                        <button
                            onClick={() => setShowCert(true)}
                            className="btn-primary py-2 px-4 shadow-sm text-xs rounded-full"
                        >
                            <Award className="w-4 h-4" />
                            View Certificate
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 md:p-12 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar (Progress & Nav) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6 pr-2 scrollbar-hide hover:scrollbar-default">
                        {/* Progress Card */}
                        <div className="saas-card p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-tight">Overall Progress</h3>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-5xl font-bold tracking-tighter text-gray-900">{progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                                <div className="bg-brand-primary h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Completed</p>
                                    <p className="font-semibold text-gray-900">{completedTopics} / {totalTopics}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Status</p>
                                    <p className={`font-semibold ${roadmap.isCompleted ? 'text-emerald-500' : 'text-brand-primary'}`}>
                                        {roadmap.isCompleted ? 'Done' : 'In Progress'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <div className="saas-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Guided Mode</h4>
                                    <p className="text-xs text-gray-500 mt-1">Enforce sequential completion</p>
                                </div>
                                <button
                                    onClick={() => setIsGuided(!isGuided)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isGuided ? 'bg-brand-primary' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isGuided ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Index */}
                        <div className="saas-card p-6 hidden lg:block">
                            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">What you'll learn</h4>
                            <div className="space-y-2">
                                {roadmap.phases.map((p, i) => {
                                    const pProg = Math.round((p.topics.filter(t => t.completed).length / p.topics.length) * 100);
                                    return (
                                        <button
                                            key={i}
                                            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 border border-transparent hover:border-gray-200"
                                            onClick={() => document.getElementById(`phase-${i}`).scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                        >
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${pProg === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {pProg === 100 ? <CheckCircle className="w-3 h-3" /> : i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 leading-snug">{p.name || p.title}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-16 pb-32">
                        {/* Header */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
                                {roadmap.skill}
                            </h1>
                            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
                                {roadmap.description || `A simple, step-by-step path to master ${roadmap.skill}. Follow along and build your skills.`}
                            </p>
                        </div>

                        {/* Phases List */}
                        <div className="space-y-12">
                            {roadmap.phases.map((phase, pIdx) => (
                                <section key={pIdx} id={`phase-${pIdx}`} className="saas-card bg-transparent border-none shadow-none">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                            <span className="text-gray-300">{(pIdx + 1).toString().padStart(2, '0')}.</span>
                                            {phase.name || phase.title}
                                        </h2>
                                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Approx. {phase.estimatedTime || 'Self-paced'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        {phase.topics.map((topic, tIdx) => {
                                            const isLocked = isGuided && !topic.completed && !(tIdx === 0 || phase.topics[tIdx - 1]?.completed);
                                            const isActiveNode = !topic.completed && !isLocked;

                                            return (
                                                <div
                                                    key={tIdx}
                                                    className={`p-6 rounded-xl border transition-all duration-300 relative overflow-hidden ${topic.completed
                                                        ? 'bg-gray-50 border-gray-200'
                                                        : isActiveNode
                                                            ? 'bg-white border-brand-primary shadow-sm'
                                                            : 'bg-white/50 border-gray-100 opacity-75 grayscale'
                                                        }`}
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                {topic.completed && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-widest">Completed</span>}
                                                                {isActiveNode && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-primary/10 text-brand-primary uppercase tracking-widest">Active</span>}
                                                            </div>
                                                            <h4 className="text-lg font-bold text-gray-900">{topic.title || topic.name}</h4>
                                                            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">{topic.description || "Learn the basics of this section."}</p>

                                                            {topic.resources?.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 pt-3">
                                                                    {topic.resources.map((res, rIdx) => (
                                                                        <a key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-sm">
                                                                            <ExternalLink className="w-3 h-3" />
                                                                            {res.type || res.name || 'Lesson Link'}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex shrink-0 items-start">
                                                            <button
                                                                onClick={() => !isLocked && toggleTopic(pIdx, tIdx)}
                                                                disabled={isLocked}
                                                                className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2 w-full md:w-auto ${isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                                                    topic.completed ? 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50' :
                                                                        'bg-brand-primary text-white hover:bg-gray-900 shadow-sm hover:shadow-md'
                                                                    }`}
                                                            >
                                                                {topic.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Phase Project */}
                                    {phase.handsOnProject && (
                                        <div className="mt-6 saas-card bg-gray-900 border-none p-8 text-white relative overflow-hidden">
                                            {phase.handsOnProject.completed && (
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
                                            )}
                                            <div className="flex items-start gap-4 mb-4 relative z-10">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${phase.handsOnProject.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white'}`}>
                                                    {phase.handsOnProject.completed ? <CheckCircle className="w-5 h-5" /> : <LayoutTemplate className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Practice Project</span>
                                                    <h4 className="text-xl font-bold tracking-tight">{phase.handsOnProject.title}</h4>
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed mb-6 block w-full relative z-10">
                                                {phase.handsOnProject.description}
                                            </p>
                                            
                                            {phase.handsOnProject.solutionUrl ? (
                                                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 relative z-10">
                                                    <div className="flex items-center justify-between mb-3">
                                                        {phase.handsOnProject.status === 'Approved' ? (
                                                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                                                                <CheckCircle className="w-3 h-3" /> Approved
                                                            </span>
                                                        ) : phase.handsOnProject.status === 'Rejected' ? (
                                                            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide flex items-center gap-1">
                                                                <X className="w-3 h-3" /> Rejected
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> Pending Approval
                                                            </span>
                                                        )}
                                                        {phase.handsOnProject.submittedAt && (
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(phase.handsOnProject.submittedAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <a href={phase.handsOnProject.solutionUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary/80 transition-colors w-fit">
                                                        <ExternalLink className="w-4 h-4" /> View My Work
                                                    </a>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => {
                                                        setProjectPhaseIndex(pIdx);
                                                        setProjectModalOpen(true);
                                                    }}
                                                    className="px-5 py-2.5 bg-white text-gray-900 rounded-md text-sm font-bold shadow-sm hover:bg-gray-100 transition-colors relative z-10"
                                                >
                                                    Start Project
                                                </button>
                                            )}
                                            {phase.handsOnProject.status === 'Rejected' && (
                                                <button 
                                                    onClick={() => {
                                                        setProjectPhaseIndex(pIdx);
                                                        setProjectModalOpen(true);
                                                    }}
                                                    className="mt-4 px-5 py-2.5 bg-rose-500 text-white rounded-md text-sm font-bold shadow-sm hover:bg-rose-600 transition-colors relative z-10 w-fit"
                                                >
                                                    Resubmit Project
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </section>
                            ))}

                            {/* Capstone Project Section */}
                            {roadmap.capstoneProject && (
                                <div className="mt-12 pt-12 border-t border-gray-100 animate-fade-in">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg">
                                            <Trophy className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Capstone Challenge</h3>
                                            <p className="text-sm text-gray-500 font-medium">The final project to validate your expertise.</p>
                                        </div>
                                    </div>

                                    <div className="saas-card bg-slate-900 border-none p-8 text-white relative overflow-hidden shadow-2xl">
                                        <div className="flex items-start gap-4 mb-4 relative z-10">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${roadmap.capstoneProject.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white'}`}>
                                                {roadmap.capstoneProject.completed ? <CheckCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Graduation Project</span>
                                                <h4 className="text-xl font-bold tracking-tight">{roadmap.capstoneProject.title || 'Mastery Project'}</h4>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-6 block w-full relative z-10">
                                            {roadmap.capstoneProject.description}
                                        </p>
                                        
                                        {roadmap.capstoneProject.solutionUrl ? (
                                            <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 relative z-10">
                                                <div className="flex items-center justify-between mb-4">
                                                    {roadmap.capstoneProject.status === 'Approved' ? (
                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                            Goal Achieved: Approved
                                                        </span>
                                                    ) : roadmap.capstoneProject.status === 'Rejected' ? (
                                                        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                                                            <X className="w-3 h-3" /> Resubmission Required
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                                                            <Clock className="w-3 h-3" /> Evaluation in Progress
                                                        </span>
                                                    )}
                                                    {roadmap.capstoneProject.submittedAt && (
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                                            Logged: {new Date(roadmap.capstoneProject.submittedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <a href={roadmap.capstoneProject.solutionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-brand-primary font-bold hover:text-white transition-colors">
                                                    <ExternalLink className="w-4 h-4" /> Inspect Solution Asset
                                                </a>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    setIsCapstoneSubmission(true);
                                                    setProjectModalOpen(true);
                                                }}
                                                className="px-6 py-3 bg-brand-primary text-white rounded-lg text-sm font-bold shadow-soft hover:bg-white hover:text-slate-900 transition-all relative z-10"
                                            >
                                                Submit Capstone Challenge
                                            </button>
                                        )}
                                        {roadmap.capstoneProject.status === 'Rejected' && (
                                            <button 
                                                onClick={() => {
                                                    setIsCapstoneSubmission(true);
                                                    setProjectModalOpen(true);
                                                }}
                                                className="mt-4 px-6 py-3 bg-rose-500 text-white rounded-lg text-sm font-bold shadow-soft hover:bg-rose-600 transition-all relative z-10 block w-fit"
                                            >
                                                Retry Challenge
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Validation Artifact (Certificate) */}
            {showCert && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-2xl relative overflow-hidden p-12 shadow-2xl border border-gray-100">
                        <button onClick={() => setShowCert(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-brand-primary mb-6 border border-gray-200 shadow-sm">
                                <Award className="w-8 h-8" />
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
                            <p className="text-gray-500 mb-12">This officially recognizes that</p>

                            <h3 className="text-5xl font-bold text-gray-900 tracking-tight mb-8 border-b border-gray-200 pb-8 inline-block px-12">
                                {user?.name || user?.username}
                            </h3>

                            <p className="text-gray-500 mb-6 font-medium text-sm">has successfully finished this learning path:</p>

                            <h4 className="text-3xl font-black text-gray-900 mb-16 uppercase tracking-tight">{roadmap.skill}</h4>

                            <div className="flex justify-between items-end border-t border-gray-100 pt-8 text-left">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Issued By</p>
                                    <p className="font-bold text-gray-900">SkillRoute Platform</p>
                                    <p className="text-xs text-gray-500 mt-1">ID: {id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Submission Modal */}
            {projectModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden scale-100 transition-transform">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Submit Your Project</h3>
                            <button onClick={() => setProjectModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleProjectSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Solution URL</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., https://github.com/username/project"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                    value={solutionInput}
                                    onChange={(e) => setSolutionInput(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-2">Paste a link to your GitHub repository, live demo, or CodePen where your completed project can be viewed.</p>
                            </div>
                            <div className="pt-4 flex items-center justify-end gap-3">
                                <button type="button" onClick={() => setProjectModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submittingProject} className="px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-md hover:bg-gray-900 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                                    {submittingProject ? 'Submitting...' : 'Finish Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default RoadmapView;
