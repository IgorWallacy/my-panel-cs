
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-[#0D6EFD] to-[#0B5ED7] text-white">
    <header className="container mx-auto flex items-center justify-between px-4 py-6 md:px-6 lg:py-8">
      
      <Link href="#" prefetch={false}>
        <MountainIcon className="h-8 w-8" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      
    </header>
    <main className="flex-1">
      <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-12 md:px-6 lg:py-20">
      <img src="/logo.jpg" className="mx-auto p-1" />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Unlock Your Potential with MyPanel
          </h1>
          <p className="mt-4 max-w-[700px] text-lg md:text-xl">
            MyPanel é um poderoso painel de controle para gerenciar seus clientes e servidores CSP de forma segura e eficiente.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-lg font-medium text-[#0D6EFD] shadow-lg transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          prefetch={false}
        >
          Entrar
        </Link>
      </section>
    </main>
    <footer className="bg-[#0B5ED7] py-6 text-center text-sm text-white/80">
      <p>&copy; 2024 MyPanel Inc. All rights reserved.</p>
    </footer>
  </div>
)
}

function MountainIcon(props:any) {
return (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
)
}


function XIcon(props:any) {
return (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

}
