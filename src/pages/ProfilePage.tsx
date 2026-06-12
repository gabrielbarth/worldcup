import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthState, useLogout, useUpdateProfile } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const schema = z.object({ name: z.string().min(2, 'Nome muito curto') })
type Form = z.infer<typeof schema>

export function ProfilePage() {
  const { appUser } = useAuthState()
  const { mutate: logout } = useLogout()
  const { mutate: update, isPending } = useUpdateProfile()
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    values: { name: appUser?.name ?? '' },
  })

  const onSubmit = (data: Form) =>
    appUser && update({ uid: appUser.uid, data: { name: data.name } })

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && appUser) update({ uid: appUser.uid, data: { photoFile: file } })
  }

  if (!appUser) return null

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-6">Perfil</h1>
      <div className="flex flex-col items-center mb-6">
        <button onClick={() => fileRef.current?.click()} className="relative">
          {appUser.photoURL ? (
            <img src={appUser.photoURL} alt="" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-navy-700 flex items-center justify-center text-3xl text-gray-400">
              {appUser.name[0].toUpperCase()}
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-brand rounded-full w-6 h-6 flex items-center justify-center text-xs text-white">✎</div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
        <div>
          <input
            {...register('name')}
            className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand"
          />
          {errors.name && <p className="text-brand text-sm mt-1">{errors.name.message}</p>}
        </div>
        <button type="submit" disabled={isPending} className="w-full bg-brand text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-50">
          {isPending ? 'Salvando...' : 'Salvar nome'}
        </button>
      </form>
      {appUser.role === 'admin' && (
        <Link to="/admin/matches" className="block w-full text-center border border-brand text-brand rounded-lg px-4 py-3 mb-4">
          Painel Admin
        </Link>
      )}
      <button onClick={() => logout()} className="w-full border border-gray-600 text-gray-400 rounded-lg px-4 py-3">
        Sair
      </button>
    </div>
  )
}
