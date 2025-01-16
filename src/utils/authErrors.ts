import { AuthError } from "@supabase/supabase-js"

export const getErrorMessage = (error: AuthError | Error | string) => {
  console.log("Processing error:", error)
  
  if (typeof error === 'string') {
    return error
  }

  if ('message' in error) {
    const message = error.message?.toLowerCase() || ''
    
    if (message.includes('invalid login credentials') || message.includes('invalid password')) {
      return "Incorrect email or password. Please try again."
    }
    if (message.includes('user not found') || message.includes('invalid user')) {
      return "No account found with this email address."
    }
    if (message.includes('email not confirmed')) {
      return "Please verify your email address before signing in."
    }
    if (message.includes('email already registered')) {
      return "An account with this email already exists."
    }
    if (message.includes('too many requests') || message.includes('rate limit')) {
      return "Too many attempts. Please try again later."
    }
    if (message.includes('network') || message.includes('connection')) {
      return "Network error. Please check your internet connection."
    }
    
    return message || "An unexpected error occurred. Please try again."
  }

  return "An unexpected error occurred. Please try again."
}