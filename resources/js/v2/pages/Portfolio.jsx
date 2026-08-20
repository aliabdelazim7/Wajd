import React from 'react';
import Layout from '../layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const Portfolio = () => {
    const { lang, content } = useApp();
    const copy = lang === 'ar' ? {
        eyebrow: 'دراسات الحالة',
        title1: 'نتائج',
        title2: 'مُثبتة.',
        primaryOutcome: 'النتيجة الأساسية',
    } : {
        eyebrow: 'CASE STUDIES',
        title1: 'Proven',
        title2: 'outcomes.',
        primaryOutcome: 'Primary outcome',
    };
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    const textAlign = lang === 'ar' ? 'text-right' : 'text-left';
    const fallbackProjects = [
        {
            id: 'al-owaid',
            name: lang === 'ar' ? 'براند العويد للعود' : 'Al Owaid Oud',
            category: 'Performance Marketing',
            metric: '2.6x ROAS',
            outcome: 'Revenue Growth',
            image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 'toyo',
            name: lang === 'ar' ? 'تطبيق تويو (Toyo)' : 'Toyo App',
            category: 'Growth Engineering',
            metric: '2,500+',
            outcome: 'Conversions',
            image: 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1000&auto=format&fit=crop'
        },
        {
            id: 'qanatir',
            name: lang === 'ar' ? 'براند قناطير الغذائي' : 'Qanatir Food Brand',
            category: 'Paid Social',
            metric: '2.5x ROAS',
            outcome: 'E-commerce Scale',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: lang === 'ar' ? 'براند بارنر (Partner)' : 'Barner Brand',
            category: 'Acquisition',
            metric: '2.1x ROAS',
            outcome: 'Meta Optimization',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: lang === 'ar' ? 'مؤسسة جسار التجارية' : 'Jassar Trading',
            category: 'Conversion Design',
            metric: '+45%',
            outcome: 'CVR Growth',
            image: 'https://images.unsplash.com/photo-1551288049-bbbda595c7c8?q=80&w=1000&auto=format&fit=crop'
        },
        {
            name: lang === 'ar' ? 'براند فلاش (Flash)' : 'Flash Brand',
            category: 'Omnichannel Growth',
            metric: '2.4x ROAS',
            outcome: 'ROI Increase',
            image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop'
        }
    ];

    const projects = content?.projects?.length
        ? content.projects.map((project) => ({
            id: project.slug,
            name: project.name,
            category: project.category || (lang === 'ar' ? 'دراسة حالة' : 'Case Study'),
            metric: Object.values(project.results || {})[0] || (lang === 'ar' ? 'أثر مثبت' : 'Proven impact'),
            outcome: copy.primaryOutcome,
            image: project.image_url || project.thumbnail_url,
        }))
        : fallbackProjects;

    return (
        <Layout>
            <section className="pt-48 pb-24 px-[5%]" dir={direction}>
                <div className={`max-w-6xl mx-auto ${textAlign}`}>
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold-500 text-xs uppercase tracking-[0.3em] font-medium mb-8 block font-sans"
                    >
                        {copy.eyebrow}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-[10rem] font-serif leading-[0.85] mb-16 tracking-tighter"
                    >
                        {copy.title1} <span className="italic text-gold-500">{copy.title2}</span>
                    </motion.h1>
                </div>
            </section>

            <section className="section-padding pt-0" dir={direction}>
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-x-20 gap-y-40">
                    {projects.map((project, i) => (
                        <Link 
                            to={project.id ? `/portfolio/${project.id}` : '#'}
                            key={i}
                            className={`group ${textAlign} block`}
                        >
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 2) * 0.2, duration: 1 }}
                            >
                            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-12 bg-obsidian-800 border border-white/5">
                                <img 
                                    src={project.image} 
                                    alt={project.name} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 opacity-40 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-90"></div>
                                <div className="absolute bottom-12 right-12 left-12 flex justify-between items-end">
                                    <div className={textAlign}>
                                        <p className="text-6xl font-serif text-gold-500 mb-2">{project.metric}</p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">{project.outcome}</p>
                                    </div>
                                    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:border-gold-500 transition-all duration-700 shadow-2xl">
                                        <ArrowUpRight className="w-8 h-8 text-white group-hover:text-obsidian-950 transition-colors rotate-[-90deg] group-hover:rotate-[-45deg]" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-5xl font-serif mb-4 group-hover:text-gold-500 transition-colors">{project.name}</h3>
                                <p className="text-white/40 font-sans uppercase tracking-[0.3em] text-xs">{project.category}</p>
                            </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default Portfolio;
