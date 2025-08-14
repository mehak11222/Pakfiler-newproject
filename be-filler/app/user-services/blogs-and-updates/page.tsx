import { BlogsClient } from '@/components/BlogsClient';
import { ContentService } from '@/services/content.service';
import { Content } from "@/services/content.service"
import { Metadata } from 'next';
import { Suspense } from 'react';

// SEO metadata
export const metadata: Metadata = {
    title: 'PakFiler - Blog Articles',
    description: 'Read the latest articles on tax filing and NTN registration in Pakistan with PakFiler.',
};

export default async function BlogsPage() {
    let blogs: any = [];
    let error: string | null = null;

    try {
        const contentService = new ContentService();
        blogs = await contentService.getAllContent();
    } catch (err: any) {
        console.error('Error fetching blogs:', err);
        error = 'Failed to load blogs. Please try again later.';
    }

    return (
        <Suspense fallback={<div className="text-center text-gray-600 font-poppins py-20">Loading blogs...</div>}>
            <BlogsClient blogs={blogs} error={error} /> 
        </Suspense>
    );
}