
const GoogleButton = ({label}) => {
  return (
    <button type="button" className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.89c2.28-2.1 3.53-5.2 3.53-8.86z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3c-1.08.72-2.45 1.16-4.04 1.16-3.11 0-5.74-2.1-6.68-4.92H1.3v3.09C3.28 21.3 7.31 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.32 14.33A7.2 7.2 0 0 1 4.94 12c0-.81.14-1.6.38-2.33V6.58H1.3A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.3 5.42l4.02-3.09z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.28 2.7 1.3 6.58l4.02 3.09C6.26 6.85 8.89 4.75 12 4.75z"
        />
      </svg>
      {label}
    </button>
  )
}

export default GoogleButton