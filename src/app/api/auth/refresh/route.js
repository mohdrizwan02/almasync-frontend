import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/api/v1';

export async function POST(request) {
    try {
        const cookieStore = cookies();
        
        // Get refresh token from cookies
        const refreshToken = cookieStore.get('refreshToken')?.value;
        const sessionId = cookieStore.get('sessionId')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'No refresh token found' 
                },
                { status: 401 }
            );
        }

        console.log('API: Attempting token refresh for session:', sessionId);

        // Make request to backend
        const backendResponse = await axios.post(
            `${BACKEND_URL}/auth/refresh-token`,
            { sessionId },
            {
                timeout: 10000,
                headers: {
                    'Authorization': `Bearer ${refreshToken}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        const { data: responseData } = backendResponse.data;
        const { tokens } = responseData;

        console.log('API: Token refresh successful');

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Tokens refreshed successfully',
            data: {
                tokenInfo: {
                    tokenType: tokens.tokenType,
                    expiresIn: tokens.expiresIn
                }
            }
        });

        // Update access token cookie
        cookieStore.set('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60, // 15 minutes
        });

        // Update refresh token cookie if provided
        if (tokens.refreshToken) {
            cookieStore.set('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
        }

        return response;

    } catch (error) {
        console.error('API: Token refresh error:', error.message);

        // Clear invalid tokens
        const cookieStore = cookies();
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        };

        cookieStore.set('accessToken', '', cookieOptions);
        cookieStore.set('refreshToken', '', cookieOptions);
        cookieStore.set('sessionId', '', cookieOptions);
        cookieStore.set('userInfo', '', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
        });

        if (error.response) {
            const { status, data } = error.response;
            return NextResponse.json(
                { 
                    success: false, 
                    message: data.message || 'Token refresh failed',
                },
                { status }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                message: 'Token refresh failed' 
            },
            { status: 401 }
        );
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