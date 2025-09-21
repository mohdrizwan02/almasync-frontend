import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function GET(request) {
    try {
        const cookieStore = cookies();
        
        // Get tokens from cookies
        const accessToken = cookieStore.get('accessToken')?.value;
        const userInfo = cookieStore.get('userInfo')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'No access token found',
                    isAuthenticated: false
                },
                { status: 401 }
            );
        }

        // If we have userInfo cached, return it (for faster response)
        if (userInfo) {
            try {
                const parsedUserInfo = JSON.parse(userInfo);
                return NextResponse.json({
                    success: true,
                    message: 'User authenticated',
                    isAuthenticated: true,
                    data: {
                        user: parsedUserInfo
                    }
                });
            } catch (parseError) {
                console.log('API: Error parsing cached user info:', parseError.message);
                // Continue to fetch from backend
            }
        }

        console.log('API: Verifying user authentication with backend');

        // Verify with backend
        const backendResponse = await axios.get(
            `${BACKEND_URL}/auth/me`,
            {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        const { data: responseData } = backendResponse.data;

        console.log('API: User verification successful');

        // Update userInfo cookie with fresh data
        cookieStore.set('userInfo', JSON.stringify(responseData.user), {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60, // 24 hours
        });

        return NextResponse.json({
            success: true,
            message: 'User authenticated',
            isAuthenticated: true,
            data: responseData
        });

    } catch (error) {
        console.error('API: User verification error:', error.message);

        if (error.response) {
            const { status, data } = error.response;
            
            // Token might be expired, try to refresh
            if (status === 401) {
                return NextResponse.json(
                    { 
                        success: false, 
                        message: 'Access token expired',
                        isAuthenticated: false,
                        needsRefresh: true
                    },
                    { status: 401 }
                );
            }

            return NextResponse.json(
                { 
                    success: false, 
                    message: data.message || 'Authentication verification failed',
                    isAuthenticated: false
                },
                { status }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                message: 'Authentication verification failed',
                isAuthenticated: false
            },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}