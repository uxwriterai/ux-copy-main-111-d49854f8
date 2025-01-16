import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { PasswordChangeForm } from "@/components/settings/PasswordChangeForm"

export default function Settings() {
  const { toast } = useToast()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to fetch user information"
        })
        return
      }
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUserEmail()
  }, [toast])

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
          
          <PasswordChangeForm userEmail={userEmail} />
        </CardContent>
      </Card>
    </div>
  )
}