import { Zap } from 'lucide-react';

const AuthShell = ({ title, subtitle, children}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary text-white">
                <Zap className="size-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>} 
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthShell