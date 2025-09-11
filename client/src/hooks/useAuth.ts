import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { httpClient } from '@/lib/http-client'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'
import type {
  LoginRequestDto,
  RegisterRequestDto,
  UpdateProfileRequestDto,
  ForgotPasswordRequestDto,
  VerifyOtpRequestDto,
  ResetPasswordRequestDto,
  ChangePasswordRequestDto,
} from '@/types/api'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// Get current user query
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.status === 401) return false
      return failureCount < 3
    },
  })
}

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient()
  const { setUser, setAuthenticated, setTokens } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginRequestDto) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('Login mutation onSuccess, received data:', {
        hasUser: !!data.user,
        hasTokens: !!data.tokens,
        accessTokenLength: data.tokens?.accessToken?.length
      })

      // Update auth store
      setUser({
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        avatar: data.user.avatarUrl,
      })
      setAuthenticated(true)
      setTokens(data.tokens)

      // Force set tokens in HTTP client to ensure they're available immediately
      httpClient.forceSetTokens(data.tokens.accessToken, data.tokens.refreshToken)
      // Also save to localStorage
      httpClient.setTokens(data.tokens.accessToken, data.tokens.refreshToken)

      // Set user data in query cache
      queryClient.setQueryData(authKeys.me(), data.user)

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient()
  const { setUser, setAuthenticated, setTokens } = useAuthStore()

  return useMutation({
    mutationFn: (userData: RegisterRequestDto) => authService.register(userData),
    onSuccess: (data) => {
      // Update auth store
      setUser({
        id: data.user.id,
        name: data.user.username,
        email: data.user.email,
        avatar: data.user.avatarUrl,
      })
      setAuthenticated(true)
      setTokens(data.tokens)

      // Set user data in query cache
      queryClient.setQueryData(authKeys.me(), data.user)

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })
}

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (data: UpdateProfileRequestDto) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update auth store
      setUser({
        id: updatedUser.id,
        name: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatarUrl,
      })

      // Update user data in query cache
      queryClient.setQueryData(authKeys.me(), updatedUser)

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.all })

      // Show success toast
      toast.success('Profile updated successfully!')
    },
    onError: (error: any) => {
      console.error('Profile update failed:', error)
      toast.error(error.message || 'Failed to update profile')
    },
  })
}

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequestDto) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: any) => {
      console.error('Password change failed:', error)
      toast.error(error.message || 'Failed to change password')
    },
  })
}

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout: logoutStore } = useAuthStore()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear auth store
      logoutStore()

      // Clear all queries
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Even if logout fails, clear local state
      logoutStore()
      queryClient.clear()
    },
  })
}

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequestDto) => authService.forgotPassword(data),
  })
}

// Verify OTP mutation
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpRequestDto) => authService.verifyOtp(data),
  })
}

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequestDto) => authService.resetPassword(data),
  })
}


