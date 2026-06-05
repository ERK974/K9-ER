"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function login() {
    console.log("LOGIN CLICKED") // debug
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data?.user) {
        alert("Email ou mot de passe incorrect")
        console.log("AUTH ERROR:", error)
        setLoading(false)
        return
      }

      // 🔐 récupération rôle
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()
        alert("Profil introuvable")
        console.log("PROFILE ERROR:", profileError)
        setLoading(false)
        return
      }

      // 🚀 redirection selon rôle
      if (profile.role === "admin") {
        router.push("/admin")
      } else if (profile.role === "client") {
        router.push("/client")
      } else {
        await supabase.auth.signOut()
        alert("Accès refusé")
      }
    } catch (err) {
      console.log("LOGIN CRASH:", err)
      alert("Erreur inattendue")
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: 30, maxWidth: 400 }}>
      <h1>🔐 Connexion</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10 }}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 10 }}
      />

      <button
        onClick={login}
        disabled={loading}
        style={{
          padding: 10,
          width: "100%",
          cursor: "pointer",
        }}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </main>
  )
}