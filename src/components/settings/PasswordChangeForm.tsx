import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { PasswordInput } from "./PasswordInput"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PasswordChangeFormProps {
  userEmail: string | null;
}

export const PasswordChangeForm = ({ userEmail }: PasswordChangeFormProps) => {
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
      toast.error("Current password is required")
      return false
    }

    if (!formData.newPassword) {
      toast.error("New password is required")
      return false
    }

    if (!formData.confirmPassword) {
      toast.error("Please confirm your new password")
      return false
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long")
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match")
      return false
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password must be different from your current password")
      return false
    }

    return true
  }

  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswords()) return
    if (!userEmail) {
      toast.error("User email not found. Please try logging in again.")
      return
    }

    setIsLoading(true)
    try {
      // First verify the current password by signing in
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: formData.currentPassword,
      })

      if (signInError || !session) {
        console.error("Password verification error:", signInError)
        toast.error("Current password is incorrect. Please try again.")
        setIsLoading(false)
        return
      }

      // Update the password using the verified session
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: formData.newPassword 
      }, {
        auth: {
          persistSession: true
        }
      })

      if (updateError) {
        console.error("Password update error:", updateError)
        toast.error(updateError.message || "Failed to update password")
        setIsLoading(false)
        return
      }

      // Success case
      toast.success("Password updated successfully")
      resetForm()
    } catch (error: any) {
      console.error("Password change error:", error)
      toast.error(error.message || "An unexpected error occurred")
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