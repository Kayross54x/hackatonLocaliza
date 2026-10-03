import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Field, Logo } from '../components/ui'
import { user } from '../data/mock'
import { useStore } from '../state/store'

export function Welcome() {
  const navigate = useNavigate()
  return (
    <div className="relative flex h-full flex-col bg-[#2b2a26] text-white">
      <img src="/img/login-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover object-right" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/80" />
      <div className="relative flex flex-1 flex-col px-6 pt-4">
        <div className="mb-6 flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-[3px] flex-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/35'}`} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Logo white className="h-7" />
          <span className="h-5 w-px bg-lime" />
          <span className="text-sm font-semibold">Seja bem vindo!</span>
        </div>
        <h1 className="mt-8 text-[26px] leading-snug font-bold">
          O jeito fácil de ter um
          <br />
          0km pra chamar de seu.
        </h1>
        <div className="flex-1" />
        <div className="space-y-3 pb-8">
          <Button block onClick={() => navigate('/login')}>
            Acessar minha assinatura
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  const { update } = useStore()
  const [email, setEmail] = useState(user.email)
  const [error, setError] = useState(false)

  const submit = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError(true)
    update({ loggedIn: true, showDailyReport: true })
    navigate('/')
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="relative h-56 shrink-0 overflow-hidden bg-brand">
        <div className="absolute top-0 left-10 h-20 w-64 rounded-br-[40px] border-r-4 border-b-4 border-lime/80" />
        <div className="relative flex h-full flex-col items-center justify-center gap-4 pt-6">
          <Logo white className="h-11" />
          <span className="text-sm font-semibold text-lime">O app do seu carro por assinatura</span>
        </div>
      </div>
      <div className="-mt-5 flex-1 rounded-t-3xl bg-white px-6 pt-6">
        <p className="mb-4 text-center text-[15px] font-semibold">Para acessar o app, faça seu login</p>
        {error && (
          <div className="mb-4 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
            Ocorreu um erro. <b>Revise o e-mail inserido</b> e tente novamente.
          </div>
        )}
        <Field
          label="Informe seu e-mail"
          value={email}
          onChange={(v) => {
            setEmail(v)
            setError(false)
          }}
          error={error}
          type="email"
        />
        <Button block className="mt-4" onClick={submit}>
          CONTINUAR
        </Button>
        <p className="mt-8 text-center text-sm text-ink underline">Aviso de Privacidade</p>
        <p className="mt-4 text-center text-[10px] tracking-wide text-muted">
          LOCALIZA ASSINATURA
          <br />
          MOBILE · MVP HACKATHON
        </p>
      </div>
    </div>
  )
}
