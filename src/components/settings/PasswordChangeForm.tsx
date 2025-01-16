import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { PasswordInput } from "./PasswordInput"

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

    setIsLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail || '',
        password: formData.currentPassword
      })

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: signInError.message.includes("Invalid login credentials") 
            ? "Current password is incorrect"
            : "Error verifying current password"
        })
        setIsLoading(false)
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({ 
        password: formData.newPassword 
      })

      if (updateError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: updateError.message.includes("same_password")
            ? "New password must be different from your current password"
            : updateError.message.includes("auth")
              ? "Authentication error. Please try logging in again"
              : updateError.message || "Failed to update password"
        })
        setIsLoading(false)
        return
      }

      toast({
        title: "Success",
        description: "Password updated successfully"
      })
      
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
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
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  )
}