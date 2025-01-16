import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps { 
  id: string;
  name: string;
  value: string;
  label: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ 
  id, 
  name,
  value, 
  label, 
  show, 
  onToggleShow,
  onChange
}: PasswordInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          className="pr-10"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleShow()
          }}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}

export default function Settings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          console.error("Error fetching user:", error)
          toast({
            title: "Error",
            description: "Unable to fetch user information",
            variant: "destructive",
          })
          return
        }
        if (user?.email) {
          setUserEmail(user.email)
        }
      } catch (error) {
        console.error("Error in getUserEmail:", error)
        toast({
          title: "Error",
          description: "Failed to load user information",
          variant: "destructive",
        })
      }
    }
    getUserEmail()
  }, [])

  const validatePasswords = () => {
    if (!formData.currentPassword) {
      toast({
        title: "Validation Error",
        description: "Current password is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.newPassword) {
      toast({
        title: "Validation Error",
        description: "New password is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please confirm your new password",
        variant: "destructive",
      })
      return false
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive",
      })
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords don't match",
        variant: "destructive",
      })
      return false
    }

    if (formData.currentPassword === formData.newPassword) {
      toast({
        title: "Validation Error",
        description: "New password must be different from your current password",
        variant: "destructive",
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
      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail || '',
        password: formData.currentPassword
      })

      if (signInError) {
        toast({
          title: "Authentication Error",
          description: "Current password is incorrect",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({ 
        password: formData.newPassword 
      })

      if (updateError) {
        console.error("Error updating password:", updateError)
        if (updateError.message.includes("same_password")) {
          toast({
            title: "Update Error",
            description: "New password must be different from your current password",
            variant: "destructive",
          })
        } else if (updateError.message.includes("auth")) {
          toast({
            title: "Authentication Error",
            description: "Authentication error. Please try logging in again",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Update Error",
            description: updateError.message || "Failed to update password",
            variant: "destructive",
          })
        }
        return
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      })
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
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
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account settings and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
              {userEmail || 'Loading...'}
            </div>
          </div>
          
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
        </CardContent>
      </Card>
    </div>
  )
}