"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function login() {
    console.log("START LOGIN")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("AUTH RESULT:", data)
    console.log("AUTH ERROR:", error)

    if (error || !data.user) {
      alert("Erreur login")
      return
    }

    console.log("USER ID:", data.user.id)

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    console.log("PROFILE:", profile)
    console.log("PROFILE ERROR:", profileError)

    if (!profile) {
      alert("Profil absent")
      return
    }

    if (profile.role === "admin") {
      console.log("GO ADMIN")
      router.push("/admin")
    } else {
      console.log("GO CLIENT")
      router.push("/client")
    }
  }

  return (
    <main style={{ padding: 30 }}>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>
        Se connecter
      </button>
    </main>
  )
}