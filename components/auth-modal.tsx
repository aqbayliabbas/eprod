"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/hooks/use-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "signin" | "signup"
  onSwitchMode: () => void
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = mode === "signin" ? await signIn(email, password) : await signUp(email, password, fullName)

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Succès",
          description:
            mode === "signin"
              ? "Connexion réussie !"
              : "Compte créé ! Vérifiez votre email pour confirmer votre inscription.",
        })
        onClose()
        setEmail("")
        setPassword("")
        setFullName("")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setFullName("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Connexion" : "Créer un compte"}</DialogTitle>
          <DialogDescription>
            {mode === "signin" ? "Connectez-vous à votre compte Eprod" : "Créez votre compte Eprod gratuitement"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom complet"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
            {mode === "signup" && <p className="text-xs text-gray-500">Minimum 6 caractères</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Chargement..." : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </Button>
        </form>

        <div className="text-center text-sm">
          {mode === "signin" ? (
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <button type="button" onClick={onSwitchMode} className="text-green-600 hover:underline">
                Créer un compte
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <button type="button" onClick={onSwitchMode} className="text-green-600 hover:underline">
                Se connecter
              </button>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
