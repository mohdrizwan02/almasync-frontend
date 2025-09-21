import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function POST(request) {
    try {
        const cookieStore = cookies();
        
        // Get tokens from cookies
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;
        const sessionId = cookieStore.get('sessionId')?.value;

        console.log('API: Attempting logout for session:', sessionId);

        // If we have tokens, try to logout from backend
        if (accessToken && sessionId) {
            try {
                await axios.post(
                    `${BACKEND_URL}/auth/logout`,
                    { sessionId },
                    {
                        timeout: 5000,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );
                console.log('API: Backend logout successful');
            } catch (backendError) {
                console.log('API: Backend logout failed, but continuing with local logout:', backendError.message);
                // Continue with local logout even if backend fails
            }
        }

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Logout successful'
        });

        // Clear all authentication cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0, // Expire immediately
        };

        cookieStore.set('accessToken', '', cookieOptions);
        cookieStore.set('refreshToken', '', cookieOptions);
        cookieStore.set('sessionId', '', cookieOptions);
        
        // Clear user info cookie (not HTTP-only)
        cookieStore.set('userInfo', '', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });

        return response;

    } catch (error) {
        console.error('API: Logout error:', error.message);

        // Even if there's an error, clear cookies locally
        const response = NextResponse.json({
            success: true,
            message: 'Logout completed (local cleanup)'
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        };

        const cookieStore = cookies();
        cookieStore.set('accessToken', '', cookieOptions);
        cookieStore.set('refreshToken', '', cookieOptions);
        cookieStore.set('sessionId', '', cookieOptions);
        cookieStore.set('userInfo', '', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });

        return response;
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}