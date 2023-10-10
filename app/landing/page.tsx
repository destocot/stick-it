import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import Image from "next/image";
import Link from "next/link";
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";
import LandingVisual from "@/components/LandingVisual";
import GoogleLogin from "./GoogleLogin";

export default async function LandingPage() {
  // redirect user if they have a session (logged in)
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    redirect('/')
  }

  const greetings = [
    'Hello World',         // English
    'Hola Mundo',          // Spanish
    'Bonjour le Monde',   // French
    'こんにちは、世界',    // Japanese
    '你好，世界',           // Chinese
    '안녕하세요, 세계',    // Korean
    'ہیلو دنیا',         // Urdu
    'Ciao Mondo',          // Italian
    'مرحبًا بالعالم',    // Arabic
    'Привет, мир',         // Russian
    'Hallo Welt'           // German
  ];

  return (
    <main className="h-screen flex justify-center items-center my-0">
      <div>
        <h1 className="uppercase text-8xl bg-light-three/75 -skew-x-6 font-bold w-fit mx-auto mb-2 px-4 dark:border-dark-four dark:bg-dark-five/50">stick-it!</h1>
        {/* <Image src="https://picsum.photos/id/8/300" alt="" width={300} height={300} /> */}
        <div className="relative -z-10">
          <LandingVisual />
          <code className="text-dark-one font-semibold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{greetings[Math.floor(Math.random() * greetings.length)]}</code>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex gap-2">
            <Link className="flex-grow-2 shadow mb-2 px-5 text-3xl hover:scale-110 font-bold hover:text-light-three rounded-md transition-all bg-light-three hover:bg-light-five text-light-five flex items-center" href="/login">Login</Link>
            <GoogleLogin />
          </div>
          <span>Not a member? Sign up <Link className="underline underline-offset-4 inline-block font-semibold hover:text-light-five" href="/signup">here</Link></span>
        </div>
      </div>
    </main>
  )
}