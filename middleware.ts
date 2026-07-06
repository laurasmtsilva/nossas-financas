import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Criamos a resposta inicial
  let response = NextResponse.next({ request })

  // 2. Criamos o cliente supabase para ler os cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // 3. Verificamos a sessão
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Lógica de bloqueio/redirecionamento
  const isLoginPage = request.nextUrl.pathname === '/login'

  if (!user && !isLoginPage) {
    // Se não está logado e não está no login, vai para o login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isLoginPage) {
    // Se está logado e está no login, vai para a home
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}

// O matcher exclui de forma mais segura as rotas que não devem ser protegidas
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png).*)',
  ],
}