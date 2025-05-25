"use client"

import { useState, useEffect } from "react"
import { supabase, type Database } from "@/lib/supabase"
import { useAuth } from "./useAuth"

type Project = Database["public"]["Tables"]["projects"]["Row"]
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchProjects()
    } else {
      setProjects([])
      setLoading(false)
    }
  }, [user])

  const fetchProjects = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (project: Omit<ProjectInsert, "user_id">) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          ...project,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      setProjects((prev) => [data, ...prev])
      return data
    } catch (error) {
      console.error("Error creating project:", error)
      return null
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()

      if (error) throw error

      setProjects((prev) => prev.map((project) => (project.id === id ? data : project)))
      return data
    } catch (error) {
      console.error("Error updating project:", error)
      return null
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error

      setProjects((prev) => prev.filter((project) => project.id !== id))
      return true
    } catch (error) {
      console.error("Error deleting project:", error)
      return false
    }
  }

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  }
}
