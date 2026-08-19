import React, { useState } from 'react';
import Layout from '../layout/Layout';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, Globe, ExternalLink, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const Contact = () => {
    const { lang } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        budget_sar: '',
        message: '',
        consent: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            const response = await fetch('/api/leads/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    page_url: formData.website || undefined,
                    service: 'Growth Audit',
                    budget_sar: formData.budget_sar ? Number(formData.budget_sar) : undefined,
                    locale: lang,
                    message: formData.message,
                    consent: formData.consent,
                })
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                const validation = payload.errors ? Object.values(payload.errors).flat().join(' ') : '';
                throw new Error(validation || payload.message || (lang === 'ar' ? 'تعذر إرسال الطلب.' : 'Unable to submit the request.'));
            }
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <section className="pt-40 pb-20 px-[5%]">
                <div className="max-w-6xl mx-auto text-right">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-6 block font-sans"
                    >
                        {lang === 'ar' ? 'تدقيق النمو' : 'Growth Audit'}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-9xl font-serif leading-[0.9] mb-12"
                    >
                        {lang === 'ar' ? 'لنُهندس مرحلتك ' : 'Engineering Your '} <br />
                        <span className="italic text-gold-500">{lang === 'ar' ? 'القادمة.' : 'Next Stage.'}</span>
                    </motion.h1>
                </div>
            </section>

            <section className="section-padding pt-0">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="text-right"
                    >
                        <h2 className="text-4xl font-serif mb-16">{lang === 'ar' ? 'خطوط التواصل' : 'Communication Channels'}</h2>
                        <div className="space-y-16">
                            <div className="flex gap-8 justify-start">
                                <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-gold-500" />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-sans">Email Us</p>
                                    <a href="mailto:wajd.marketing@gmail.com" className="text-2xl md:text-3xl font-serif hover:text-gold-500 transition-colors">wajd.marketing@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex gap-8 justify-start">
                                <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6 text-gold-500" />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-sans">Connect With Us</p>
                                    <div className="flex gap-6 mt-4">
                                        <a href="https://www.instagram.com/wajdagency" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold-500 transition-colors"><Globe className="w-6 h-6" /></a>
                                        <a href="https://www.linkedin.com/company/wajdagency" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold-500 transition-colors"><ExternalLink className="w-6 h-6" /></a>
                                        <a href="https://www.facebook.com/profile.php?id=61562980695038" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold-500 transition-colors"><MessageSquare className="w-6 h-6" /></a>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-8 justify-start">
                                <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-gold-500" />
                                </div>
                                <div>
                                    <p className="text-white/40 text-xs uppercase tracking-widest mb-3 font-sans">Visit Us</p>
                                    <p className="text-2xl md:text-3xl font-serif">{lang === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: lang === 'ar' ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="glass-card p-10 md:p-16 rounded-[2.5rem] text-right"
                    >
                        <h2 className="text-4xl font-serif mb-10 text-center">{lang === 'ar' ? 'طلب تدقيق النمو' : 'Request Growth Audit'}</h2>
                        {success ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold-500/20">
                                    <Send className="w-8 h-8 text-gold-500" />
                                </div>
                                <h3 className="text-3xl font-serif text-gold-500 mb-6">{lang === 'ar' ? 'تم استلام طلبك.' : 'Request Received.'}</h3>
                                <p className="text-white/60 text-lg font-arabic leading-relaxed">{lang === 'ar' ? 'سيقوم مهندسونا بتحليل بياناتك والتواصل معك خلال 24 ساعة.' : 'Our engineers will analyze your data and contact you within 24 hours.'}</p>
                            </div>
                        ) : (
                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-widest text-white/40 mr-1 font-sans">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-gold-500/50 outline-none transition-all font-arabic text-lg" placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs uppercase tracking-widest text-white/40 mr-1 font-sans">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-gold-500/50 outline-none transition-all font-sans text-lg" placeholder="email@company.com" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-white/40 mr-1 font-sans">{lang === 'ar' ? 'موقع الشركة' : 'Company Website'}</label>
                                    <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-gold-500/50 outline-none transition-all font-sans text-lg" placeholder="https://yourbrand.com" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-white/40 mr-1 font-sans">{lang === 'ar' ? 'الميزانية الإعلانية الشهرية (بالريال السعودي)' : 'Monthly Ad Budget (SAR)'}</label>
                                    <select required value={formData.budget_sar} onChange={e => setFormData({...formData, budget_sar: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-gold-500/50 outline-none transition-all font-arabic text-lg appearance-none">
                                        <option value="" className="bg-obsidian-900">{lang === 'ar' ? 'اختر ميزانية الإعلانات...' : 'Select ad budget...'}</option>
                                        <option value="2000" className="bg-obsidian-900">1,000 - 3,000 SAR</option>
                                        <option value="5000" className="bg-obsidian-900">3,000 - 10,000 SAR</option>
                                        <option value="15000" className="bg-obsidian-900">10,000 - 50,000+ SAR</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-white/40 mr-1 font-sans">{lang === 'ar' ? 'الرسالة أو الأهداف' : 'Message or Objectives'}</label>
                                    <textarea rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-gold-500/50 outline-none transition-all font-arabic text-lg resize-none" placeholder={lang === 'ar' ? 'أخبرنا عن أهداف النمو الخاصة بك...' : 'Tell us about your growth objectives...'}></textarea>
                                </div>
                                {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">{error}</p>}
                                <label className="flex items-start gap-3 text-sm text-white/45"><input required type="checkbox" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="mt-1 accent-gold-500" />{lang === 'ar' ? 'أوافق على استخدام بياناتي للتواصل بشأن طلب النمو.' : 'I agree that my information may be used to follow up on this growth request.'}</label>
                                <button disabled={submitting} className="w-full bg-gold-500 text-obsidian-950 py-6 rounded-2xl font-arabic font-bold text-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl shadow-gold-500/10">
                                    {submitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'إرسال طلب التدقيق' : 'Request Growth Audit')} <Send className="w-6 h-6 rotate-[-90deg]" />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default Contact;
