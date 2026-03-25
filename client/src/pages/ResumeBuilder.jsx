import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Download, FileText, Award, Cpu, Mail, User, ExternalLink, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import LoadingScreen from '../components/LoadingScreen';

const ResumeBuilder = () => {
    const { user } = useContext(AuthContext);
    const [careerData, setCareerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const resumeRef = useRef();

    useEffect(() => {
        const fetchCareerData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/roadmap/user/career-data');
                setCareerData(res.data);
            } catch (err) {
                console.error('Error fetching career data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCareerData();
    }, []);

    const downloadPDF = async () => {
        const element = resumeRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${user?.username}_Resume.pdf`);
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-ui-bg p-6 lg:p-12 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-brand-primary font-semibold text-sm mb-2">
                            <FileText className="w-4 h-4" />
                            <span>Career Vault</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Resume Builder</h1>
                        <p className="text-gray-500 font-medium max-w-lg">
                            Your learning progression and projects synthesized into a professional resume.
                        </p>
                    </div>

                    <button
                        onClick={downloadPDF}
                        disabled={!careerData}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Synthesis Sidebar */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                        <div className="saas-card p-6">
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-brand-primary" />
                                    Mastered Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {careerData?.skills.map((skill, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-gray-700 rounded-md border border-gray-200">
                                            {skill}
                                        </span>
                                    ))}
                                    {(!careerData?.skills || careerData.skills.length === 0) && (
                                        <p className="text-sm text-gray-500 italic">No skills analyzed yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-brand-primary" />
                                    Accomplishments
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Completed Projects</span>
                                        <span className="font-semibold text-gray-900">{careerData?.projects?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Certificates</span>
                                        <span className="font-semibold text-gray-900">{careerData?.certificates?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="saas-card bg-gray-900 p-6 text-white border-none">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">AI Insight</p>
                            <p className="text-sm font-medium leading-relaxed text-gray-200">
                                "Your project diversity indicates a strong focus on technical implementation. Consider highlighting your capstone challenges for lead roles."
                            </p>
                        </div>
                    </div>

                    {/* Resume Preview Layer */}
                    <div className="lg:col-span-8">
                        <div className="saas-card p-1 bg-gray-50 border-gray-200 shadow-sm overflow-hidden">
                            {/* The Actual Resume Component */}
                            <div
                                ref={resumeRef}
                                className="bg-white p-12 md:p-16 min-h-[1000px] border border-gray-100"
                                style={{ fontFamily: '"Inter", sans-serif' }}
                            >
                                {/* Personal Header */}
                                <div className="flex flex-col justify-between items-start gap-4 border-b border-gray-200 pb-8 mb-10">
                                    <div>
                                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
                                            {user?.name || user?.username}
                                        </h2>
                                        <p className="text-lg text-gray-500 font-medium">Software Engineer</p>
                                    </div>
                                    <div className="flex gap-6 text-sm text-gray-500 mt-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{user?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>Member since {new Date(user?.createdAt).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                    {/* Left Content */}
                                    <div className="md:col-span-8 space-y-10">
                                        <section>
                                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Technical Experience</h3>
                                            <div className="space-y-8">
                                                {careerData?.projects?.map((project, i) => (
                                                    <div key={i} className="group/item">
                                                        <div className="flex items-baseline justify-between mb-2">
                                                            <h4 className="text-base font-bold text-gray-900">{project.title}</h4>
                                                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">{project.type}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                                            {project.description}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <Cpu className="w-3 h-3" />
                                                            <span>Domain: <span className="font-semibold text-gray-700">{project.skill}</span></span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!careerData?.projects || careerData.projects.length === 0) && (
                                                    <p className="text-gray-500 text-sm italic">Construct roadmaps and complete projects to automatically populate your experience.</p>
                                                )}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Certifications</h3>
                                            <div className="space-y-4">
                                                {careerData?.certificates?.map((cert, i) => (
                                                    <div key={i} className="flex justify-between items-center group">
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                {cert.skill} Expert
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">SkillRoute AI • {new Date(cert.completedAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                ))}
                                                {(!careerData?.certificates || careerData.certificates.length === 0) && (
                                                    <p className="text-gray-500 text-sm italic">No certificates issued yet.</p>
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Content */}
                                    <div className="md:col-span-4 space-y-10">
                                        <section>
                                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Skills</h3>
                                            <div className="flex flex-col gap-2">
                                                {careerData?.skills?.map((skill, i) => (
                                                    <div key={i} className="text-sm font-medium text-gray-700">
                                                        • {skill}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Profile</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Continuous learner leveraging high-fidelity learning roadmaps encompassing structured theory, hands-on architectural challenges, and AI-validated capstones. Dedicated to mastering modern technology stacks and domain specific paradigms.
                                            </p>
                                        </section>
                                    </div>
                                </div>

                                {/* Privacy / Meta */}
                                <div className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center text-gray-400">
                                    <p className="text-xs font-semibold uppercase tracking-wider">Generated by SkillRoute</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
