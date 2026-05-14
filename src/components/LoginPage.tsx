import { useState } from 'react'

export type LoginAccountType = 'user' | 'corporate'

const IFIKR_REGISTER = 'https://ifikr.my/register'
const IFIKR_RESET = 'https://ifikr.my/reset'

type LoginPageProps = {
  onSubmit: (payload: {
    accountType: LoginAccountType
    email: string
    password: string
  }) => void
}

export function LoginPage({ onSubmit }: LoginPageProps) {
  const [accountType, setAccountType] = useState<LoginAccountType>('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ accountType, email: email.trim(), password })
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#f0f4f8]">
      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-5 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 text-center">
          <img
            src={`${import.meta.env.BASE_URL}ifikr-logo.png`}
            alt="I-FiKR"
            width={112}
            height={112}
            className="mx-auto mb-4 h-28 w-28 object-contain drop-shadow-[0_4px_14px_rgba(15,110,86,0.15)]"
            decoding="async"
          />
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2433] sm:text-[26px]">
            I-FiKR AI
          </h1>
          <p className="mt-2 text-sm text-[#8a9ab0]">
            Sign in to continue · INCEIF citation assistant
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f2] bg-white p-6 shadow-[0_8px_30px_rgba(15,110,86,0.08)] sm:p-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#8a9ab0]">
            Account type
          </p>
          <div
            className="mb-6 flex rounded-xl border border-[#e2e8f2] bg-[#f8fafc] p-1"
            role="group"
            aria-label="Account type"
          >
            <button
              type="button"
              onClick={() => setAccountType('user')}
              className={[
                'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors',
                accountType === 'user'
                  ? 'bg-white text-[#0f6e56] shadow-sm'
                  : 'text-[#8a9ab0] hover:text-[#1a2433]',
              ].join(' ')}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setAccountType('corporate')}
              className={[
                'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors',
                accountType === 'corporate'
                  ? 'bg-white text-[#0f6e56] shadow-sm'
                  : 'text-[#8a9ab0] hover:text-[#1a2433]',
              ].join(' ')}
            >
              Corporate
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-sm font-semibold text-[#1a2433]"
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@example.com.my"
                className="w-full rounded-xl border border-[#e2e8f2] bg-[#f8fafc] px-4 py-3 text-base text-[#1a2433] outline-none transition-[border-color,box-shadow] placeholder:text-[#8a9ab0] focus:border-[#0f6e56] focus:ring-2 focus:ring-[#0f6e56]/20"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-sm font-semibold text-[#1a2433]"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#e2e8f2] bg-[#f8fafc] px-4 py-3 text-base text-[#1a2433] outline-none transition-[border-color,box-shadow] placeholder:text-[#8a9ab0] focus:border-[#0f6e56] focus:ring-2 focus:ring-[#0f6e56]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#085041] to-[#0f6e56] py-3.5 text-base font-semibold text-white shadow-md transition-[filter,transform] hover:brightness-105 active:scale-[0.99]"
            >
              Sign in
            </button>
          </form>

          {accountType === 'user' ? (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e2e8f2]" />
                </div>
                <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wide text-[#8a9ab0]">
                  <span className="bg-white px-3">or</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-center text-sm">
                <a
                  href={IFIKR_RESET}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#0f6e56] underline-offset-2 hover:underline"
                >
                  Forgot password?
                </a>
                <p className="text-[#8a9ab0]">
                  Don&apos;t have an account?{' '}
                  <a
                    href={IFIKR_REGISTER}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#0f6e56] underline-offset-2 hover:underline"
                  >
                    Sign up
                  </a>{' '}
                  with I-FIKR
                </p>
              </div>
            </>
          ) : (
            <p className="mt-6 rounded-xl border border-[#e8f4f0] bg-[#f0faf7] px-4 py-3 text-center text-sm leading-relaxed text-[#4a5d72]">
              Corporate accounts are managed by your organization. Self-service
              password reset and sign-up are not available—contact your
              administrator if you need access.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
