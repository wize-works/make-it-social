/**
 * Hook for fetching and managing posts
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, type CreatePostData, type UpdatePostData } from '@/lib/api-client';
import type { Post } from '@/types';

interface UsePostsOptions {
    status?: string;
    page?: number;
    perPage?: number;
}

export function usePosts(organizationId?: string, options?: UsePostsOptions) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [meta, setMeta] = useState<{
        total?: number;
        page?: number;
        perPage?: number;
        totalPages?: number;
    } | null>(null);

    const fetchPosts = useCallback(async () => {
        if (!organizationId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const { posts: data, meta: responseMeta } = await apiClient.posts.getAll(
                organizationId,
                options
            );

            setPosts(data);
            setMeta(responseMeta || null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
            console.error('Error fetching posts:', err);
        } finally {
            setIsLoading(false);
        }
    }, [organizationId, options]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const createPost = useCallback(async (data: CreatePostData) => {
        try {
            const newPost = await apiClient.posts.create(data);
            setPosts((prev) => [newPost, ...prev]);
            return newPost;
        } catch (err) {
            console.error('Error creating post:', err);
            throw err;
        }
    }, []);

    const updatePost = useCallback(async (postId: string, data: UpdatePostData) => {
        try {
            const updatedPost = await apiClient.posts.update(postId, data);
            setPosts((prev) =>
                prev.map((post) => (post.id === postId ? updatedPost : post))
            );
            return updatedPost;
        } catch (err) {
            console.error('Error updating post:', err);
            throw err;
        }
    }, []);

    const deletePost = useCallback(async (postId: string) => {
        try {
            await apiClient.posts.delete(postId);
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (err) {
            console.error('Error deleting post:', err);
            throw err;
        }
    }, []);

    const publishPost = useCallback(async (postId: string) => {
        try {
            const publishedPost = await apiClient.posts.publish(postId);
            setPosts((prev) =>
                prev.map((post) => (post.id === postId ? publishedPost : post))
            );
            return publishedPost;
        } catch (err) {
            console.error('Error publishing post:', err);
            throw err;
        }
    }, []);

    return {
        posts,
        isLoading,
        error,
        meta,
        refetch: fetchPosts,
        createPost,
        updatePost,
        deletePost,
        publishPost,
    };
}

// Hook for fetching a single post
export function usePost(postId: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPost = useCallback(async () => {
        if (!postId) return;

        try {
            setIsLoading(true);
            setError(null);

            const data = await apiClient.posts.getById(postId);
            setPost(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch post'));
            console.error('Error fetching post:', err);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    return {
        post,
        isLoading,
        error,
        refetch: fetchPost,
    };
}
