import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { PasswordInput } from "./PasswordInput"
import { Loader2 } from "lucide-react"

interface PasswordChangeFormProps {
  userEmail: string | null;
}

export const PasswordChangeForm = ({ userEmail }: PasswordChangeFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  const validatePasswords = () => {
    if (!formData.currentPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Current password is required"
      })
      return false
    }

    if (!formData.newPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New password is required"
      })
      return false
    }

    if (!formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please confirm your new password"
      })
      return false
    }

    if (formData.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New password must be at least 6 characters long"
      })
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords don't match"
      })
      return false
    }

    if (formData.currentPassword === formData.newPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New password must be different from your current password"
      })
      return false
    }

    return true
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswords()) return
    if (!userEmail) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User email not found. Please try logging in again."
      })
      return
    }

    setIsLoading(true)
    try {
      // First verify the current password by attempting to sign in
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: formData.currentPassword
      })

      console.log("Sign in attempt result:", { error: signInError, data })

      if (signInError) {
        setIsLoading(false)
        // Check specifically for invalid credentials
        if (signInError.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Current password is incorrect. Please try again."
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to verify current password. Please try again."
          })
        }
        return
      }

      // If verification successful, proceed with password update
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: formData.newPassword 
      })

      if (updateError) {
        console.error("Password update error:", updateError)
        setIsLoading(false)
        toast({
          variant: "destructive",
          title: "Error",
          description: updateError.message || "Failed to update password"
        })
        return
      }

      // Success case
      toast({
        title: "Success",
        description: "Password updated successfully"
      })
      
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      console.error("Password change error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <form onSubmit={handlePasswordChange} className="space-y-4">
      <PasswordInput
        id="current-password"
        name="currentPassword"
        value={formData.currentPassword}
        label="Current Password"
        show={passwordVisibility.currentPassword}
        onToggleShow={() => togglePasswordVisibility('currentPassword')}
        onChange={handleInputChange}
      />
      <PasswordInput
        id="new-password"
        name="newPassword"
        value={formData.newPassword}
        label="New Password"
        show={passwordVisibility.newPassword}
        onToggleShow={() => togglePasswordVisibility('newPassword')}
        onChange={handleInputChange}
      />
      <PasswordInput
        id="confirm-password"
        name="confirmPassword"
        value={formData.confirmPassword}
        label="Confirm New Password"
        show={passwordVisibility.confirmPassword}
        onToggleShow={() => togglePasswordVisibility('confirmPassword')}
        onChange={handleInputChange}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  )
}