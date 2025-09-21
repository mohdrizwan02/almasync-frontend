import { toast } from 'sonner';

// Simple error handler for basic user feedback
export const handleApiError = (error, showToast = true) => {
    console.error('API Error:', error);

    if (!error.response) {
        if (showToast) toast.error('Network error. Please check your connection.');
        return 'Network error';
    }

    const message = error.response?.data?.message || 'An error occurred';
    if (showToast) toast.error(message);
    
    return message;
};

export const handleApiSuccess = (message, showToast = true) => {
    if (showToast) toast.success(message);
    return message;
};

export default { handleApiError, handleApiSuccess };
