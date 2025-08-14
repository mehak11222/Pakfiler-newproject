'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Content } from "@/services/content.service"
import placeholderLogo from "@/public/logo.png"

// Define Blog type for placeholder blogs
interface Blog {
    id: string;
    title: string;
    excerpt: string;
    thumbnail: string;
    slug: string;
    publishedAt: string;
}

export function BlogsClient({ blogs, error }: { blogs: Content[]; error: string | null }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter blogs based on search query
    const filteredBlogs = blogs.filter(
        blog =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.body.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Placeholder blogs (fallback)
    const placeholderBlogs: Blog[] = [
        {
            id: 'b1',
            title: 'How to File Taxes in Pakistan with PakFiler',
            excerpt: "A beginner's guide to filing income tax returns using PakFiler's platform.",
            thumbnail: 'https://via.placeholder.com/480x360?text=Tax+Filing+Guide',
            slug: 'how-to-file-taxes-pakistan',
            publishedAt: '2025-04-15',
        },
        {
            id: 'b2',
            title: 'NTN Registration Made Easy',
            excerpt: "Learn the steps to register for an NTN with PakFiler in minutes.",
            thumbnail: 'https://via.placeholder.com/480x360?text=NTN+Registration',
            slug: 'ntn-registration-made-easy',
            publishedAt: '2025-03-20',
        },
    ];

    const blogsToDisplay = blogs.length > 0 ? filteredBlogs : placeholderBlogs;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-8 lg:px-16 relative">
            {/* Decorative Wave Background */}
            <div
                className="absolute top-0 left-0 w-full h-32 bg-red-600 opacity-10"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)' }}
            />

            <div className="max-w-7xl mx-auto relative">
                <h1 className="text-4xl sm:text-6xl font-bold text-red-600 mb-12 text-center font-poppins tracking-tight animate-fade-in">
                    PakFiler Blogs
                </h1>
                <div className="w-32 h-1 bg-red-600 mx-auto mb-12 rounded-full" />

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full max-w-md mx-auto p-4 mb-12 border border-gray-200 rounded-full font-poppins bg-white/90 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-red-300"
                    aria-label="Search blogs"
                />

                {/* Error State */}
                {error && <div className="text-center text-red-600 font-poppins text-lg mb-8">{error}</div>}

                {/* Blog Grid */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                        {blogsToDisplay.length === 0 && (
                            <div className="col-span-full text-center text-gray-600 font-poppins">No blogs found.</div>
                        )}
                        {blogsToDisplay.map((blog, index) => (
                            <Link
                                key={blog.id}
                                href={`/blogs/${'slug' in blog ? blog.slug : ''}`}
                                className="border border-gray-200 rounded-2xl shadow-md bg-white/90 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-red-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                                aria-label={`Read ${blog.title} `}
                            >
                                <div className="relative w-full h-36">
                                    <Image
                                        src={placeholderLogo}
                                        alt={blog.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-t-2xl transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-base font-semibold font-poppins text-gray-900 line-clamp-1">{blog.title}</h3>
                                    <p className="text-xs text-gray-600 font-poppins line-clamp-2 mt-1">{'excerpt' in blog ? blog.excerpt : (blog.body || '')}</p>
                                    <p className="text-xs text-gray-500 font-poppins mt-2">
                                        {new Date('publishedAt' in blog ? blog.publishedAt : (blog.createdAt || '')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}