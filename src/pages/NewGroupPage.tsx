import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useCreateGroup } from '../hooks/useGroups'
import { useAuthState } from '../hooks/useAuth'

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  description: z.string().min(1, 'Adicione uma descrição'),
  prize: z.string(),
})
type Form = z.infer<typeof schema>

export function NewGroupPage() {
  const navigate = useNavigate()
  const { appUser } = useAuthState()
  const { mutate, isPending, error } = useCreateGroup()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = (data: Form) =>
    mutate(
      { ...data, ownerId: appUser!.uid },
      { onSuccess: (id) => navigate(`/groups/${id}`) }
    )

  const inputClass = "w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand"

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-6">Criar grupo</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input {...register('name')} placeholder="Nome do grupo" className={inputClass} />
          {errors.name && <p className="text-brand text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register('description')} placeholder="Descrição" className={inputClass} />
          {errors.description && <p className="text-brand text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <input {...register('prize')} placeholder="Prêmio (ex: Rodízio de pizza)" className={inputClass} />
        </div>
        {error && <p className="text-brand text-sm">Erro ao criar grupo</p>}
        <button type="submit" disabled={isPending} className="w-full bg-brand text-white rounded-lg px-4 py-3 font-semibold disabled:opacity-50">
          {isPending ? 'Criando...' : 'Criar grupo'}
        </button>
      </form>
    </div>
  )
}
