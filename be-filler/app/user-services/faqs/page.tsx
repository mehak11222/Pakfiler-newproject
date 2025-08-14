"use client";

import { useState } from 'react';
import Head from 'next/head';

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: 'How does PakFiler work?',
            answer:
                'PakFiler is a powerful tool with a user-friendly interface that simplifies tax filing in Pakistan. Answer simple yes/no questions and provide basic information like salary, taxes paid, and investments. Our system calculates your tax refund or obligation after adjusting taxes already paid. Built-in checks ensure all required information is collected, and our integrated system files your return under tax expert supervision, notifying you upon completion.',
        },
        {
            question: 'Why should I use PakFiler when my tax consultant does the same work?',
            answer:
                'PakFiler educates you on your finances, unlike traditional consultants who file returns without your involvement. Our step-by-step process helps you understand your finances, identify tax-saving opportunities, and apply tax credits. Your data is stored for future reference, reducing paperwork. Contact us to learn more about tax filing in Pakistan.',
        },
        {
            question: 'What do I need to get started?',
            answer:
                'PakFiler combines technology and tax expertise in three steps: Sign up, enter basic information and answer simple questions, and pay using common methods like debit/credit cards.',
        },
        {
            question: 'What information do I need to provide to complete the process?',
            answer:
                'Required information depends on your income sources and financial transactions. Useful documents include: Salary Certificate, Bank Statement (showing profit and taxes), utility bills, NCCPL capital gains certificate, mutual fund investment statements, business class air ticket invoices, cellular network tax deduction certificates, educational institution invoices, vehicle registration documents, and property transaction documents.',
        },
        {
            question: 'My employer deducts tax on my salary, and I have no other income. Do I still need to file a tax return?',
            answer:
                'Yes, filing is necessary to avoid penalties for non-filing and higher taxes on transactions for non-filers.',
        },
        {
            question: 'Is there any benefit to being a filer besides compliance?',
            answer:
                'Filers can claim tax credits on utility bills, cash transactions, educational fees, business class air tickets, vehicle purchases, properties, mutual fund investments, insurance premiums, and charitable donations. Non-filers face higher withholding tax rates on bank transfers, vehicle taxes, capital gains, and dividends.',
        },
        {
            question: 'I don\'t own property or valuables; do I still need to file a wealth statement with my tax return?',
            answer:
                'Yes, resident individuals must file a wealth statement, detailing assets and liabilities for you and your dependents (e.g., properties, vehicles, jewelry, bank balances). Include personal expenses like rent, travel, utilities, and education. Even without assets, you must reconcile income and expenses from July 1 to June 30.',
        },
        {
            question: 'Is there a penalty for not filing my tax return?',
            answer: 'Yes, a minimum penalty of Rs 20,000 applies for non-filing.',
        },
        {
            question: 'What about customer support?',
            answer:
                'PakFiler offers expert support via phone at (021) 38892069 (9:00 a.m. to 5:30 p.m., Monday to Friday) and email at info@pakfiler.com.',
        },
        {
            question: 'Is my sensitive information secure with PakFiler?',
            answer:
                'Yes, your tax information is protected with top security standards and transmitted over a secure network to ensure confidentiality.',
        },
    ];

    const toggleFAQ = (index: any) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <>
            <Head>
                <title>PakFiler - Frequently Asked Questions</title>
                <meta name="description" content="Answers to common questions about tax filing in Pakistan with PakFiler." />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-white py-16 px-4 sm:px-8 lg:px-12">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-green-600 mb-12 text-center font-poppins tracking-tight">
                        Frequently Asked Questions
                    </h1>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-2xl shadow-md bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                                <button
                                    className="w-full text-left bg-white text-gray-900 p-6 flex justify-between items-center focus:outline-none hover:text-green-600 transition-colors duration-300"
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={activeIndex === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span className="text-xl sm:text-2xl font-semibold font-poppins">{faq.question}</span>
                                    <span className="text-2xl font-bold text-green-600">{activeIndex === index ? '−' : '+'}</span>
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="p-6 bg-white text-gray-800 border-t border-gray-200">
                                        <p className="text-lg font-poppins leading-relaxed">{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}