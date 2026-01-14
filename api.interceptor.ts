// frontend/services/api.ts (Example Axios Interceptor)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 402) {
      // Redirect to the pricing page if the subscription is inactive
      window.location.href = '/billing/pricing';
    }
    return Promise.reject(error);
  }
);
