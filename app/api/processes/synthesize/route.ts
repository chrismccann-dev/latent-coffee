import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { runSynthesis } from '@/lib/synthesis/runSynthesis'
import { processAdapter } from '@/lib/synthesis/adapters/process'

export async function POST(request: Request) {
  const body = await request.json()
  const { process: processName } = body as { process: string }

  if (!processName) {
    return NextResponse.json({ error: 'process required' }, { status: 400 })
  }

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: brews } = await supabase
    .from('brews')
    .select('*')
    .eq('process', processName)
    .order('created_at', { ascending: false })

  try {
    const outcome = await runSynthesis({
      adapter: processAdapter,
      entity: { processName },
      entityName: processName,
      brews: brews ?? [],
    })

    if (outcome.synthesis) {
      await supabase.from('process_syntheses').upsert({
        user_id: user.id,
        process: processName,
        synthesis: outcome.synthesis,
        synthesis_brew_count: outcome.brewCount,
        updated_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      synthesis: outcome.synthesis,
      brew_count: outcome.brewCount,
      message: outcome.message,
    })
  } catch (err: any) {
    console.error('Process synthesis error:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate synthesis' },
      { status: 500 }
    )
  }
}
