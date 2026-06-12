import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { useLogin } from '../hooks/useAuth'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type Form = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const { mutate, isPending, error } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = (data: Form) =>
    mutate(data, { onSuccess: () => navigate('/matches') })

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white mb-2">⚽ Bolão 2026</h1>
        <p className="text-gray-400 mb-8">Faça login para jogar</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand"
            />
            {errors.email && <p className="text-brand text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Senha"
              className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand"
            />
            {errors.password && <p className="text-brand text-sm mt-1">{errors.password.message}</p>}
          </div>
          {error && <p className="text-brand text-sm">Email ou senha incorretos</p>}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-50"
          >
            {isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6">
          Não tem conta?{' '}
          <Link to="/register" className="text-brand">Cadastrar</Link>
        </p>
      </div>
    </div>
  )
}
