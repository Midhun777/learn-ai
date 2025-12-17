import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CheckCircle, Circle, Book, ExternalLink, Award, ChevronLeft, Clock, Layout, Sparkles, Download, Lightbulb, X, Copy, Play, Pause, Calendar, Loader } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import ChatWidget from '../components/ChatWidget';
import ReactMarkdown from 'react-markdown';

const RoadmapView = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const certificateRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    // Productivity State
    const [activeTimer, setActiveTimer] = useState(null); // { pIdx, tIdx, startTime }
    const [elapsed, setElapsed] = useState(0);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    useEffect(() => {
        let interval;
        if (activeTimer) {
            interval = setInterval(() => {
                setElapsed(Math.floor((Date.now() - activeTimer.startTime) / 1000));
            }, 1000);
        } else {
            setElapsed(0);
        }
        return () => clearInterval(interval);
    }, [activeTimer]);

    const toggleTimer = async (pIdx, tIdx) => {
        // Stop Timer
        if (activeTimer && activeTimer.pIdx === pIdx && activeTimer.tIdx === tIdx) {
            const timeSpentSeconds = Math.floor((Date.now() - activeTimer.startTime) / 1000);
            setActiveTimer(null);

            // Optimistic UI Update
            const newRoadmap = { ...roadmap };
            const currentMin = newRoadmap.phases[pIdx].topics[tIdx].timeSpent || 0;
            newRoadmap.phases[pIdx].topics[tIdx].timeSpent = currentMin + (timeSpentSeconds / 60);
            setRoadmap(newRoadmap);

            try {
                await axios.put(`http://localhost:5000/api/roadmap/${id}/topic/time`, {
                    phaseIndex: pIdx,
                    topicIndex: tIdx,
                    timeSpentSeconds
                });
            } catch (err) {
                console.error("Failed to save time", err);
            }
        }
        // Start Timer
        else {
            if (activeTimer) {
                alert("Please stop the current timer first!");
                return;
            }
            setActiveTimer({ pIdx, tIdx, startTime: Date.now() });
        }
    };

    // Explanation State
    const [explanation, setExplanation] = useState(null); // { explanation, code, language, topic }
    const [explainingTopic, setExplainingTopic] = useState(null); // Topic Name being fetched
    const [showExplanation, setShowExplanation] = useState(false);

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // Higher quality
                backgroundColor: '#ffffff', // White background
                logging: false,
                useCORS: true
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Certificate-${roadmap.skill}.pdf`);
        } catch (err) {
            console.error("Certificate download failed", err);
            alert("Download failed. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        fetchRoadmap();
    }, [id]);

    useEffect(() => {
        if (roadmap) {
            const newProgress = calculateProgress(roadmap);
            setProgress(newProgress);

            if (newProgress === 100 && !roadmap.isCompleted) {
                updateRoadmapInDb({ ...roadmap, isCompleted: true });
            }
        }
    }, [roadmap]);

    // Scheduler State
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [hoursPerWeek, setHoursPerWeek] = useState(5);
    const [generatingSchedule, setGeneratingSchedule] = useState(false);

    const handleGenerateSchedule = async () => {
        setGeneratingSchedule(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/roadmap/${id}/schedule`, {
                hoursPerWeek: Number(hoursPerWeek)
            });
            setRoadmap(res.data);
            setShowScheduleModal(false);
            alert("Schedule created! Deadlines assigned based on your availability.");
        } catch (err) {
            console.error("Schedule failed", err);
            alert("Failed to generate schedule.");
        } finally {
            setGeneratingSchedule(false);
        }
    };

    const fetchRoadmap = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/roadmap/${id}`);
            setRoadmap(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateRoadmapInDb = async (updatedRoadmap) => {
        try {
            await axios.put(`http://localhost:5000/api/roadmap/${id}/update`, {
                phases: updatedRoadmap.phases,
                capstoneProject: updatedRoadmap.capstoneProject,
                isCompleted: updatedRoadmap.isCompleted
            });
            setRoadmap(updatedRoadmap);
        } catch (err) {
            console.error('Failed to update progress', err);
        }
    };

    const togglePhaseTopic = (phaseIndex, topicIndex) => {
        const newRoadmap = { ...roadmap };
        newRoadmap.phases[phaseIndex].topics[topicIndex].completed = !newRoadmap.phases[phaseIndex].topics[topicIndex].completed;
        setRoadmap(newRoadmap);
        updateRoadmapInDb(newRoadmap);
    };

    const togglePhaseResource = (phaseIndex, resourceIndex) => {
        const newRoadmap = { ...roadmap };
        newRoadmap.phases[phaseIndex].resources[resourceIndex].completed = !newRoadmap.phases[phaseIndex].resources[resourceIndex].completed;
        setRoadmap(newRoadmap);
        updateRoadmapInDb(newRoadmap);
    };

    const toggleProject = (phaseIndex) => {
        const newRoadmap = { ...roadmap };
        newRoadmap.phases[phaseIndex].handsOnProject.completed = !newRoadmap.phases[phaseIndex].handsOnProject.completed;
        setRoadmap(newRoadmap);
        updateRoadmapInDb(newRoadmap);
    };

    const toggleCapstone = () => {
        const newRoadmap = { ...roadmap };
        newRoadmap.capstoneProject.completed = !newRoadmap.capstoneProject.completed;
        setRoadmap(newRoadmap);
        updateRoadmapInDb(newRoadmap);
    };

    const handleExplain = async (topicName) => {
        setExplainingTopic(topicName);
        setShowExplanation(true);
        setExplanation(null); // Clear previous

        try {
            const res = await axios.post('http://localhost:5000/api/roadmap/explain', {
                topic: topicName,
                skill: roadmap.skill
            });
            setExplanation({ ...res.data, topic: topicName });
        } catch (err) {
            console.error(err);
            setExplanation({ explanation: "Failed to load explanation.", topic: topicName });
        } finally {
            setExplainingTopic(null);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    if (!roadmap) return <div className="text-center py-20 text-gray-500">Roadmap not found.</div>;

    return (
        <>
            <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in px-4">
                {/* Header */}
                <div className="glass-panel p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link to="/dashboard" className="text-zinc-500 hover:text-zinc-900 flex items-center mb-3 font-bold text-sm transition group">
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-2 tracking-tight">{roadmap.skill}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-600">
                            <span className="bg-zinc-100 text-zinc-900 px-3 py-1 rounded-full border border-zinc-200 flex items-center gap-1.5"><Layout className="w-3.5 h-3.5" /> {roadmap.phases.length} Phases</span>

                            <button
                                onClick={() => setShowScheduleModal(true)}
                                className="bg-white/50 hover:bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer hover:shadow-sm"
                            >
                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                {roadmap.phases[0]?.topics[0]?.dueDate ? 'Update Schedule' : 'Plan Schedule'}
                            </button>
                        </div>
                    </div>

                    <div className="w-full md:w-auto glass bg-white/40 p-5 rounded-2xl min-w-[280px]">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-bold text-zinc-800">Mastery Progress</span>
                            <span className="text-xl font-black text-zinc-900">{progress}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-4 p-1 shadow-inner">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm bg-black`}
                                style={{ width: `${progress}%` }}
                            >
                                <div className="w-full h-full bg-white/20 animate-pulse rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern Clean Certificate Section - Pure Inline Styles for html2canvas compatibility */}
                {roadmap.isCompleted && (
                    <div className="flex flex-col items-center gap-6 animate-fade-in">
                        {/* Certificate Container - The part that gets printed */}
                        <div
                            ref={certificateRef}
                            style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '56rem', // max-w-4xl
                                aspectRatio: '1.414 / 1',
                                backgroundColor: '#ffffff',
                                color: '#1e293b',
                                padding: '4rem', // p-16
                                borderRadius: '2rem',
                                border: '4px solid #000000',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                margin: '0 auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                textAlign: 'center',
                                overflow: 'hidden',
                                fontFamily: 'Inter, system-ui, sans-serif'
                            }}
                        >
                            {/* Top Badge */}
                            <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{
                                    marginBottom: '2rem',
                                    padding: '1rem',
                                    backgroundColor: '#000000',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Award size={48} color="#ffffff" />
                                </div>
                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3em',
                                    color: '#52525b',
                                    marginBottom: '0.75rem'
                                }}>Certificate of Completion</h3>
                                <h2 style={{
                                    fontSize: '3.75rem', // 6xl approx
                                    fontWeight: 900,
                                    letterSpacing: '-0.025em',
                                    color: '#09090b',
                                    marginBottom: '0.5rem',
                                    lineHeight: 1.2
                                }}>
                                    Certified Master
                                </h2>
                            </div>

                            {/* Middle Content */}
                            <div style={{
                                position: 'relative',
                                zIndex: 10,
                                width: '100%',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '1.5rem 0'
                            }}>
                                <p style={{ fontSize: '1.125rem', color: '#52525b', marginBottom: '1rem' }}>This document certifies that</p>

                                <h1 style={{
                                    fontSize: '3rem',
                                    fontWeight: 'bold',
                                    color: '#000000',
                                    padding: '0.5rem 1.5rem',
                                    display: 'inline-block',
                                    borderBottom: '2px solid #e4e4e7'
                                }}>
                                    {user?.username || 'The Student'}
                                </h1>

                                <div style={{ height: '1px', width: '6rem', backgroundColor: '#e4e4e7', margin: '1.5rem auto' }}></div>

                                <p style={{ fontSize: '1.125rem', color: '#52525b', marginBottom: '0.5rem' }}>Has demonstrated exceptional proficiency in</p>

                                <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#09090b', marginTop: '0.25rem' }}>
                                    {roadmap.skill}
                                </h2>
                            </div>

                            {/* Footer / Signatures */}
                            <div style={{
                                position: 'relative',
                                zIndex: 10,
                                width: '100%',
                                marginTop: '2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                borderTop: '1px solid #f4f4f5',
                                paddingTop: '2rem',
                                paddingLeft: '2rem',
                                paddingRight: '2rem'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#18181b', fontFamily: 'serif', fontStyle: 'italic' }}>LearnAI Platform</div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a' }}>Verified Provider</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#000000',
                                        borderRadius: '9999px'
                                    }}>
                                        <CheckCircle size={12} color="#ffffff" />
                                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.025em', color: '#ffffff' }}>Verified & Authentic</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                    <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#18181b' }}>{new Date(roadmap.updatedAt || Date.now()).toLocaleDateString()}</div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a' }}>Date of Issue</span>
                                </div>
                            </div>

                            {/* ID Badge */}
                            <div style={{
                                position: 'absolute',
                                bottom: '0.75rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.625rem',
                                color: '#d4d4d8',
                                letterSpacing: '0.1em',
                                fontFamily: 'monospace'
                            }}>
                                ID: {roadmap._id}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={downloadCertificate}
                            disabled={downloading}
                            className="flex items-center gap-3 px-8 py-4 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {downloading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Download className="w-5 h-5 group-hover:animate-bounce" />
                            )}
                            {downloading ? "Generating PDF..." : "Download Certificate PDF"}
                        </button>
                    </div>
                )}

                {/* Phases */}
                <div className="space-y-8 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[28px] top-8 bottom-8 w-1 bg-zinc-200 rounded-full hidden md:block"></div>

                    {roadmap.phases.map((phase, pIndex) => (
                        <div key={pIndex} className="glass-card overflow-hidden hover:bg-white/90 relative ml-0 md:ml-4">
                            {/* Connector Dot */}
                            <div className="absolute left-[-22px] top-10 w-4 h-4 rounded-full bg-white border-4 border-zinc-200 shadow-sm z-10 hidden md:block">
                                <div className="w-full h-full rounded-full bg-black"></div>
                            </div>

                            <div className="bg-zinc-50 border-b border-zinc-100 px-8 py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-zinc-900 tracking-tight">{phase.phaseName} Phase</h3>
                                    <p className="text-zinc-500 text-sm font-medium mt-1">Foundational concepts and practical skills</p>
                                </div>
                                <span className="self-start sm:self-center text-xs font-bold bg-white text-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" /> {phase.estimatedTime}
                                </span>
                            </div>
                            <div className="p-8 space-y-8">
                                {/* Topics */}
                                <div>
                                    <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4 pl-1">Core Concepts</h4>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {phase.topics.map((topic, tIndex) => (
                                            <div
                                                key={tIndex}
                                                className={`flex items-center gap-4 cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${activeTimer?.pIdx === pIndex && activeTimer?.tIdx === tIndex ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : topic.completed ? 'bg-zinc-50 border-zinc-200' : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-md'}`}
                                                onClick={() => togglePhaseTopic(pIndex, tIndex)}
                                            >
                                                <div className={`p-1 rounded-full transition-colors duration-300 ${topic.completed ? 'text-black bg-white shadow-sm' : 'text-zinc-300'}`}>
                                                    {topic.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                                </div>

                                                <div className="flex-1">
                                                    <span className={`font-semibold transition-colors duration-300 block ${topic.completed ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>{topic.topicName}</span>
                                                    <div className="flex items-center gap-3 mt-1 text-xs font-bold text-zinc-400">
                                                        {(topic.timeSpent > 0 || (activeTimer?.pIdx === pIndex && activeTimer?.tIdx === tIndex)) && (
                                                            <span className="flex items-center gap-1 text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                                                <Clock className="w-3 h-3" />
                                                                {activeTimer?.pIdx === pIndex && activeTimer?.tIdx === tIndex
                                                                    ? formatTime((topic.timeSpent * 60 || 0) + elapsed)
                                                                    : formatTime(topic.timeSpent * 60 || 0)
                                                                }
                                                            </span>
                                                        )}
                                                        {topic.dueDate && (
                                                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded ${new Date(topic.dueDate) < new Date() && !topic.completed ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(topic.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleTimer(pIndex, tIndex); }}
                                                    className={`p-2 rounded-full transition-colors ${activeTimer?.pIdx === pIndex && activeTimer?.tIdx === tIndex ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md animate-pulse' : 'text-zinc-400 hover:text-green-600 hover:bg-green-50'}`}
                                                    title={activeTimer?.pIdx === pIndex && activeTimer?.tIdx === tIndex ? "Stop Timer" : "Start Tracking"}
                                                >
                                                    {activeTimer?.pIdx === pIndex && activeTimer?.tIdx === tIndex ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                </button>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleExplain(topic.topicName); }}
                                                    className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Explain with AI"
                                                >
                                                    <Lightbulb className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Resources */}
                                {phase.resources.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest mb-4 pl-1">Expert Resources</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {phase.resources.map((res, rIndex) => (
                                                <div key={rIndex} className="flex items-start gap-4 p-4 border border-zinc-100 rounded-2xl bg-zinc-50/50 hover:bg-white transition-all duration-300 group hover:shadow-sm hover:border-zinc-200">
                                                    <div onClick={() => togglePhaseResource(pIndex, rIndex)} className="cursor-pointer pt-1 hover:text-black transition-colors">
                                                        {res.completed ? <CheckCircle className="w-5 h-5 text-black" /> : <Circle className="w-5 h-5 text-zinc-300" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-zinc-900 font-bold hover:underline flex items-center gap-1 mb-1 transition-colors">
                                                            {res.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                                        </a>
                                                        <span className="inline-block px-2 py-0.5 bg-zinc-200 text-zinc-600 text-[10px] uppercase font-bold tracking-wider rounded">{res.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Mini Project */}
                                {phase.handsOnProject && (
                                    <div className="bg-zinc-100 rounded-[1.5rem] p-1 border border-zinc-200/50">
                                        <div className="bg-white rounded-[1.3rem] p-6 relative overflow-hidden">
                                            <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                                                <div className="bg-zinc-50 p-3.5 rounded-2xl shadow-sm text-zinc-900 border border-zinc-200">
                                                    <Book className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-bold text-zinc-900 mb-2">Hands-on Project: {phase.handsOnProject.title}</h4>
                                                    <p className="text-zinc-600 mb-5 leading-relaxed font-medium">{phase.handsOnProject.description}</p>
                                                    <button
                                                        onClick={() => toggleProject(pIndex)}
                                                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${phase.handsOnProject.completed ? 'bg-black text-white hover:bg-zinc-800' : 'bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-900'}`}
                                                    >
                                                        {phase.handsOnProject.completed ? <><CheckCircle className="w-4 h-4" /> Project Completed</> : 'Mark as Completed'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Capstone */}
                {roadmap.capstoneProject && (
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-200 group cursor-default border border-zinc-200">
                        <div className="absolute inset-0 bg-white"></div>

                        <div className="relative z-10 p-10 md:p-14">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="p-4 bg-black rounded-2xl text-white shadow-lg">
                                    <Award className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Final Capstone</h2>
                                    <p className="text-zinc-500 font-medium text-lg">The final step to mastery</p>
                                </div>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6 leading-tight">{roadmap.capstoneProject.title}</h3>
                            <p className="text-zinc-600 mb-10 max-w-3xl leading-relaxed text-lg font-medium">{roadmap.capstoneProject.description}</p>

                            <button
                                onClick={toggleCapstone}
                                className={`w-full md:w-auto px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${roadmap.capstoneProject.completed ? 'bg-black text-white hover:bg-zinc-800 shadow-xl' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'}`}
                            >
                                {roadmap.capstoneProject.completed ? 'Capstone Completed!' : 'Mark Capstone as Done'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Explanation Modal */}
            {showExplanation && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowExplanation(false)}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-zinc-100 p-6 flex justify-between items-center z-10">
                            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                                <Sparkles className="text-blue-600 w-5 h-5" />
                                {explanation?.topic || explainingTopic || 'Explaining...'}
                            </h3>
                            <button onClick={() => setShowExplanation(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {!explanation && explainingTopic ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-zinc-500 font-medium animate-pulse">Consulting AI Tutor...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-lg text-zinc-700 leading-relaxed explanation-content">
                                        <ReactMarkdown
                                            components={{
                                                strong: ({ node, ...props }) => <span className="font-bold text-zinc-900" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc ml-5 space-y-2 mt-4 mb-4 text-zinc-600" {...props} />,
                                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                            }}
                                        >
                                            {explanation.explanation}
                                        </ReactMarkdown>
                                    </div>

                                    {explanation.code && (
                                        <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-700">
                                            <div className="bg-zinc-800 px-4 py-2 flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-700">
                                                <span>{explanation.language || 'Code Example'}</span>
                                                <Copy className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(explanation.code)} />
                                            </div>
                                            <pre className="p-6 text-sm font-mono text-zinc-100 overflow-x-auto">
                                                <code>{explanation.code}</code>
                                            </pre>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                                <Calendar className="text-blue-600 w-5 h-5" />
                                Plan Your Schedule
                            </h3>
                            <button onClick={() => setShowScheduleModal(false)}>
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        <p className="text-zinc-600 mb-6">
                            AI will assign realistic deadlines to each topic based on your weekly availability.
                        </p>

                        <label className="block text-sm font-bold text-zinc-700 mb-2">Hours per Week</label>
                        <input
                            type="number"
                            min="1" max="100"
                            value={hoursPerWeek}
                            onChange={(e) => setHoursPerWeek(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                        <button
                            onClick={handleGenerateSchedule}
                            disabled={generatingSchedule}
                            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-zinc-800 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {generatingSchedule ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            {generatingSchedule ? 'Planning...' : 'Generate Schedule'}
                        </button>
                    </div>
                </div>
            )}

            {/* Chat Widget */}
            <ChatWidget skill={roadmap.skill} />

        </>
    );
};

// ... calculateProgress (same)
const calculateProgress = (roadmap) => {
    let totalItems = 0;
    let completedItems = 0;

    if (!roadmap || !roadmap.phases) return 0;

    roadmap.phases.forEach(phase => {
        phase.topics?.forEach(topic => {
            totalItems++;
            if (topic.completed) completedItems++;
        });
        phase.resources?.forEach(res => {
            totalItems++;
            if (res.completed) completedItems++;
        });
        if (phase.handsOnProject) {
            totalItems++;
            if (phase.handsOnProject.completed) completedItems++;
        }
    });

    if (roadmap.capstoneProject) {
        totalItems++;
        if (roadmap.capstoneProject.completed) completedItems++;
    }

    if (totalItems === 0) return 0;
    return Math.round((completedItems / totalItems) * 100);
};

export default RoadmapView;
