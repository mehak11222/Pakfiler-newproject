'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Video } from '@/types/youtube';

export function VideosClient({
    taxFilingVideos,
    ntnRegistrationVideos,
    error,
}: {
    taxFilingVideos: Video[];
    ntnRegistrationVideos: Video[];
    error: string;
}) {
    const [activeTab, setActiveTab] = useState<'tax-filing' | 'ntn-registration'>('tax-filing');
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Placeholder video data (fallback)
    const featuredVideos: Video[] = [
        {
            id: 'oQdNMxWon6A',
            title: 'Complete Guide to Tax Filing with PakFiler',
            description: 'Learn how to file your income tax return in Pakistan using PakFiler\'s easy platform.',
            thumbnail: 'https://img.youtube.com/vi/oQdNMxWon6A/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=oQdNMxWon6A',
        },
        {
            id: 'XmW-AEKNZn0',
            title: 'Fast NTN Registration with PakFiler',
            description: 'Step-by-step guide to register for an NTN in Pakistan with PakFiler.',
            thumbnail: 'https://img.youtube.com/vi/XmW-AEKNZn0/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=XmW-AEKNZn0',
        },
        {
            id: '8oHvPJyJbmg',
            title: 'Understanding Tax Obligations in Pakistan',
            description: 'Explore tax filing requirements and how PakFiler simplifies the process.',
            thumbnail: 'https://img.youtube.com/vi/8oHvPJyJbmg/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=8oHvPJyJbmg',
        },
        {
            id: '0Qg_pJmbpNE',
            title: 'Why Choose PakFiler for Tax and NTN Services',
            description: 'Discover the benefits of using PakFiler for seamless tax and NTN solutions.',
            thumbnail: 'https://img.youtube.com/vi/0Qg_pJmbpNE/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=0Qg_pJmbpNE',
        },
    ];

    const placeholderTaxFilingVideos: Video[] = [
        {
            id: 'tf1',
            title: 'PakFiler NTN Registration and Salaried Income Tax Filing',
            description: 'PakFiler is trusted for NTN registration and tax filing.',
            thumbnail: 'https://img.youtube.com/vi/xyz123/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=xyz123',
        },
        {
            id: 'tf2',
            title: 'How to File Your Income Tax Return with PakFiler',
            description: 'A step-by-step guide to tax filing with PakFiler.',
            thumbnail: 'https://img.youtube.com/vi/abc456/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=abc456',
        },
    ];

    const placeholderNtnRegistrationVideos: Video[] = [
        {
            id: 'ntn1',
            title: 'NTN Registration with PakFiler is Fast and Easy!',
            description: 'Complete guide to NTN registration in three steps.',
            thumbnail: 'https://img.youtube.com/vi/ntn789/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=ntn789',
        },
        {
            id: 'ntn2',
            title: 'Why Register for NTN with PakFiler',
            description: 'Benefits of NTN registration with PakFiler.',
            thumbnail: 'https://img.youtube.com/vi/ntn012/hqdefault.jpg',
            url: 'https://www.youtube.com/watch?v=ntn012',
        },
    ];

    // Filter videos based on search query
    const filteredVideos = {
        'tax-filing': (taxFilingVideos.length > 0 ? taxFilingVideos : placeholderTaxFilingVideos).filter(
            video =>
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        'ntn-registration': (ntnRegistrationVideos.length > 0 ? ntnRegistrationVideos : placeholderNtnRegistrationVideos).filter(
            video =>
                video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                video.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20 px-4 sm:px-8 lg:px-16 relative">
            {/* Decorative Wave Background */}
            <div
                className="absolute top-0 left-0 w-full h-32 bg-green-600 opacity-10"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)' }}
            />

            <div className="max-w-7xl mx-auto relative">
                <h1 className="text-4xl sm:text-6xl font-bold text-green-600 mb-12 text-center font-poppins tracking-tight animate-fade-in">
                    PakFiler Video Tutorials
                </h1>
                <div className="w-32 h-1 bg-green-600 mx-auto mb-12 rounded-full" />

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full max-w-md mx-auto p-4 mb-12 border border-gray-200 rounded-full font-poppins bg-white/90 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-green-300"
                    aria-label="Search videos"
                />

                {/* Error State */}
                {error && <div className="text-center text-green-600 font-poppins text-lg mb-8">{error}</div>}

                {/* Featured Videos Section */}
                <section className="mb-20">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-8 font-poppins text-center">
                        Featured Videos
                    </h2>
                    <div className="flex overflow-x-auto space-x-6 pb-6 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-gray-100">
                        {featuredVideos.map((video, index) => (
                            <div
                                key={video.id}
                                className="flex-none w-80 border border-gray-200 rounded-2xl shadow-md bg-white/90 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-green-300 animate-fade-in cursor-pointer"
                                style={{ animationDelay: `${index * 200} ms` }}
                                onClick={() => setSelectedVideo(video.url)}
                                role="button"
                                aria-label={`Play ${video.title} `}
                            >
                                <div className="relative w-full h-40">
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-t-2xl transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-base font-semibold font-poppins text-gray-900 line-clamp-1">{video.title}</h3>
                                    <p className="text-xs text-gray-600 font-poppins line-clamp-1 mt-1">{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tabs Section */}
                <section>
                    <div className="flex justify-center space-x-6 mb-12 relative">
                        <button
                            className={`relative px-8 py-4 text-xl font-semibold font-poppins rounded-full transition-all duration-300 ${activeTab === 'tax-filing'
                                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-900 hover:bg-green-100'
                                } `}
                            onClick={() => setActiveTab('tax-filing')}
                            aria-label="Show tax filing videos"
                        >
                            Tax Filing
                            {activeTab === 'tax-filing' && (
                                <span className="absolute bottom-0 left-1/2 w-1/2 h-1 bg-green-600 rounded-full transform -translate-x-1/2 transition-all duration-300" />
                            )}
                        </button>
                        <button
                            className={`relative px-8 py-4 text-xl font-semibold font-poppins rounded-full transition-all duration-300 ${activeTab === 'ntn-registration'
                                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-900 hover:bg-green-100'
                                } `}
                            onClick={() => setActiveTab('ntn-registration')}
                            aria-label="Show NTN registration videos"
                        >
                            NTN Registration
                            {activeTab === 'ntn-registration' && (
                                <span className="absolute bottom-0 left-1/2 w-1/2 h-1 bg-green-600 rounded-full transform -translate-x-1/2 transition-all duration-300" />
                            )}
                        </button>
                    </div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                        {filteredVideos[activeTab].length === 0 && (
                            <div className="col-span-full text-center text-gray-600 font-poppins">No videos found.</div>
                        )}
                        {filteredVideos[activeTab].map((video, index) => (
                            <div
                                key={video.id}
                                className="border border-gray-200 rounded-2xl shadow-md bg-white/90 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:border-green-300 cursor-pointer"
                                style={{ animationDelay: `${index * 100} ms` }}
                                onClick={() => setSelectedVideo(video.url)}
                                role="button"
                                aria-label={`Play ${video.title} `}
                            >
                                <div className="relative w-full h-36">
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-t-2xl transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-base font-semibold font-poppins text-gray-900 line-clamp-1">{video.title}</h3>
                                    <p className="text-xs text-gray-600 font-poppins line-clamp-1 mt-1">{video.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Video Modal */}
                {selectedVideo && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-2xl max-w-4xl w-full">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="text-green-600 hover:text-green-700 font-poppins"
                                    aria-label="Close video"
                                >
                                    Close
                                </button>
                            </div>
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.split('v=')[1]}`}
                                className="w-full h-96 rounded-lg"
                                allowFullScreen
                                title="Video player"
                            />
                        </div >
                    </div >
                )}
            </div >
        </div >
    );
}