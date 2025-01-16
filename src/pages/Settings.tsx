import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

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
        console.log("Current user:", user)
        if (error) {
          console.error("Error fetching user:", error)
          toast.error("Unable to fetch user information")
          return
        }
        if (user?.email) {
          setUserEmail(user.email)
        }
      } catch (error) {
        console.error("Error in getUserEmail:", error)
        toast.error("Failed to load user information")
      }
    }
    getUserEmail()
  }, [])

  const validatePasswords = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All password fields are required")
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswords()) return

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: formData.newPassword 
      })

      if (error) {
        console.error("Error updating password:", error)
        if (error.message.includes("same_password")) {
          toast.error("New password must be different from your current password")
        } else if (error.message.includes("auth")) {
          toast.error("Authentication error. Please try logging in again")
        } else {
          toast.error(error.message || "Failed to update password")
        }
        return
      }

      toast.success("Password updated successfully")
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      
    } catch (error: any) {
      console.error("Error updating password:", error)
      toast.error(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const togglePasswordVisibility = (field: keyof typeof passwordVisibility) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const PasswordInput = ({ 
    id, 
    value, 
    field,
    label, 
    show, 
    onToggleShow 
  }: { 
    id: string;
    value: string;
    field: keyof typeof formData;
    label: string;
    show: boolean;
    onToggleShow: () => void;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => handleInputChange(e, field)}
          required
          className="pr-10"
        />
        <button
          type="button"
          onClick={onToggleShow}
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
              value={formData.currentPassword}
              field="currentPassword"
              label="Current Password"
              show={passwordVisibility.currentPassword}
              onToggleShow={() => togglePasswordVisibility('currentPassword')}
            />
            <PasswordInput
              id="new-password"
              value={formData.newPassword}
              field="newPassword"
              label="New Password"
              show={passwordVisibility.newPassword}
              onToggleShow={() => togglePasswordVisibility('newPassword')}
            />
            <PasswordInput
              id="confirm-password"
              value={formData.confirmPassword}
              field="confirmPassword"
              label="Confirm New Password"
              show={passwordVisibility.confirmPassword}
              onToggleShow={() => togglePasswordVisibility('confirmPassword')}
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