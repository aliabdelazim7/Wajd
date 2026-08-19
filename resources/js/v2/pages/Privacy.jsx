import React from 'react';
import Layout from '../layout/Layout';
import { motion } from 'framer-motion';

const Privacy = () => {
    return (
        <Layout>
            <section className="pt-32 pb-20 px-[5%]">
                <div className="max-w-4xl mx-auto">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-6 block"
                    >
                        Legal
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif leading-tight mb-12"
                    >
                        Privacy & <br />
                        <span className="italic text-gold-500">Data Protection.</span>
                    </motion.h1>

                    <div className="prose prose-invert prose-gold max-w-none font-sans text-white/60 space-y-8">
                        <section>
                            <h2 className="text-2xl font-serif text-white mb-4">Introduction</h2>
                            <p>At Wajd Agency, we take your data privacy seriously. This policy outlines how we collect, use, and protect your information when you interact with our website and services.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-white mb-4">Data Collection</h2>
                            <p>We collect information necessary to provide our growth engineering services, including contact details, company information, and advertising performance data provided during audits.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-white mb-4">Use of Data</h2>
                            <p>Your data is used exclusively to improve your business outcomes, communicate about our services, and optimize our proprietary acquisition systems.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-white mb-4">Protection</h2>
                            <p>We implement industry-standard security measures to ensure your data remains confidential and protected from unauthorized access.</p>
                        </section>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Privacy;
