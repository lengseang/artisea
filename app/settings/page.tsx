import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings – Artisea',
  description: 'Customize your account and application preferences.',
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <main className="mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Customize your account and application preferences.
        </p>
        {/* TODO: Add SettingsForm component */}
      </main>
    </div>
  )
}
