import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { generateEmptyState } from "@/services/emptyStateService"
import { CopyVariant } from "@/components/microcopy/CopyVariant"

const formSchema = z.object({
  context: z.string().min(1, "Please describe the empty state context"),
  elementType: z.string().min(1, "Please select an element type"),
  tone: z.string().min(1, "Please select a tone"),
  customElementType: z.string().optional(),
  additionalNotes: z.string().optional(),
})

const EmptyStateGenerator = () => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      context: "",
      elementType: "",
      tone: "",
      customElementType: "",
      additionalNotes: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const variants = await generateEmptyState(
        values.elementType,
        values.context,
        values.tone,
        values.customElementType,
        values.additionalNotes
      )
      setSuggestions(variants)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate empty state copy. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Empty State Copy Generator</CardTitle>
          <CardDescription>
            Generate user-friendly copy for empty states to guide users and improve their experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="elementType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Element Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the type of empty state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="search">Search Results</SelectItem>
                        <SelectItem value="list">List or Table</SelectItem>
                        <SelectItem value="dashboard">Dashboard Widget</SelectItem>
                        <SelectItem value="profile">Profile Section</SelectItem>
                        <SelectItem value="inbox">Inbox or Messages</SelectItem>
                        <SelectItem value="custom">Custom Element</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("elementType") === "custom" && (
                <FormField
                  control={form.control}
                  name="customElementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Element Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Describe your custom element type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Context</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the context of the empty state (e.g., first-time user, no search results)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the tone of voice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                        <SelectItem value="empathetic">Empathetic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific requirements or preferences for the copy"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Empty State Copy
              </Button>
            </form>
          </Form>

          {suggestions.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Suggested Copy Variants</h3>
              {suggestions.map((suggestion, index) => (
                <CopyVariant key={index} text={suggestion} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EmptyStateGenerator