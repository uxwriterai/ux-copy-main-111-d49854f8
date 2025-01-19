import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204 
    })
  }

  try {
    const clientIP = req.headers.get('x-real-ip') || 
                    req.headers.get('x-forwarded-for') || 
                    'unknown'
    
    console.log('[get-ip] Client IP:', clientIP)
    
    return new Response(
      JSON.stringify({ ip: clientIP }),
      { 
        headers: corsHeaders,
        status: 200 
      }
    )
  } catch (error) {
    console.error('[get-ip] Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get IP address',
        details: error.message 
      }),
      { 
        headers: corsHeaders,
        status: 500 
      }
    )
  }
})