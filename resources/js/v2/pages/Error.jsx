import React from 'react';
import Layout from '../layout/Layout';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const Error = () => {
    const { lang } = useApp();
    const copy = lang === 'ar'
        ? { title: 'تائه في النمو؟', body: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.', cta: 'العودة إلى الأمان' }
        : { title: 'Lost in Growth?', body: 'The page you are looking for does not exist or has moved.', cta: 'Back to Safety' };

    return (
        <Layout>
            <section className="section-padding min-h-[70vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-8xl md:text-[12rem] font-serif text-gold-500 mb-8 opacity-20">404</h1>
                <h2 className="text-4xl md:text-6xl font-serif mb-8">{copy.title}</h2>
                <p className="text-white/40 text-xl font-arabic mb-12 max-w-md">{copy.body}</p>
                <Link to="/" className="bg-white text-obsidian-950 px-12 py-5 rounded-full font-sans font-bold text-lg hover:bg-gold-500 transition-colors">
                    {copy.cta}
                </Link>
            </section>
        </Layout>
    );
};

export default Error;
