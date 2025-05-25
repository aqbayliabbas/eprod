"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useProjects } from "@/hooks/useProjects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Upload, Sparkles, Download, Trash2, Edit, Plus, ImageIcon, Calendar } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthModal } from "@/components/auth-modal"

export default function HomePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const { projects, createProject, updateProject, deleteProject, loading: projectsLoading } = useProjects()

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")

  // Generator state
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [prompt, setPrompt] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Edit project state
  const [editingProject, setEditingProject] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Show auth modal if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setAuthModalOpen(true)
    }
  }, [user, authLoading])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedImages((prev) => [...prev, ...files])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setUploadedImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une description",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Simulation de génération d'image
      setTimeout(async () => {
        const generatedImageUrl = "/placeholder.svg?height=512&width=512"
        setGeneratedImage(generatedImageUrl)

        // Sauvegarder le projet
        const title = projectTitle.trim() || `Projet ${new Date().toLocaleDateString()}`
        await createProject({
          title,
          prompt,
          original_images: uploadedImages.map((file) => file.name),
          generated_image: generatedImageUrl,
        })

        toast({
          title: "Image générée !",
          description: "Votre projet a été sauvegardé avec succès",
        })

        // Reset form
        setProjectTitle("")
        setPrompt("")
        setUploadedImages([])
        setIsGenerating(false)
      }, 3000)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  const handleEditProject = (project: any) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleUpdateProject = async () => {
    if (!editingProject) return

    try {
      await updateProject(editingProject.id, {
        title: editingProject.title,
        prompt: editingProject.prompt,
      })

      toast({
        title: "Projet mis à jour",
        description: "Les modifications ont été sauvegardées",
      })

      setIsEditModalOpen(false)
      setEditingProject(null)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le projet",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await deleteProject(projectId)
        toast({
          title: "Projet supprimé",
          description: "Le projet a été supprimé avec succès",
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le projet",
          variant: "destructive",
        })
      }
    }
  }

  const switchAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Show auth modal if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Eprod</h1>
            <p className="text-xl text-gray-600">
              Créez des visuels produit époustouflants avec l'intelligence artificielle
            </p>
          </div>
          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                setAuthMode("signup")
                setAuthModalOpen(true)
              }}
            >
              Créer un compte
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => {
                setAuthMode("signin")
                setAuthModalOpen(true)
              }}
            >
              Se connecter
            </Button>
          </div>
        </div>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onSwitchMode={switchAuthMode}
        />
      </div>
    )
  }

  const stats = [
    {
      title: "Projets créés",
      value: projects.length,
      icon: ImageIcon,
      color: "text-blue-600",
    },
    {
      title: "Images générées",
      value: projects.filter((p) => p.generated_image).length,
      icon: Sparkles,
      color: "text-green-600",
    },
    {
      title: "Ce mois-ci",
      value: projects.filter((p) => new Date(p.created_at).getMonth() === new Date().getMonth()).length,
      icon: Calendar,
      color: "text-purple-600",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bienvenue, {profile?.full_name || user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">Générateur IA</TabsTrigger>
            <TabsTrigger value="projects">Mes Projets</TabsTrigger>
          </TabsList>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  Générateur d'Images IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Upload Section */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-title">Nom du projet</Label>
                      <Input
                        id="project-title"
                        placeholder="Ex: Shooting produit été 2024"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Images produit</Label>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Glissez-déposez vos images ou cliquez pour sélectionner
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                      </div>
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    {uploadedImages.length > 0 && (
                      <div>
                        <Label>Images sélectionnées ({uploadedImages.length})</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {uploadedImages.map((file, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                alt={file.name}
                                width={100}
                                height={100}
                                className="w-full h-20 object-cover rounded-md"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="prompt">Description de votre vision</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Ex: fond studio blanc avec lumière naturelle, produit centré, éclairage professionnel, style minimaliste..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>

                    <Button
                      onClick={generateImage}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Génération en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Générer l'image
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Preview Section */}
                  <div>
                    <Label>Aperçu du résultat</Label>
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
                      {generatedImage ? (
                        <div className="space-y-4 w-full">
                          <Image
                            src={generatedImage || "/placeholder.svg"}
                            alt="Image générée"
                            width={400}
                            height={400}
                            className="w-full h-auto rounded-md"
                          />
                          <Button variant="outline" className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p>Votre image générée apparaîtra ici</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes Projets</h2>
              <Badge variant="secondary">{projects.length} projet(s)</Badge>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun projet pour le moment</h3>
                  <p className="text-gray-600 mb-4">Commencez par créer votre premier projet avec le générateur IA</p>
                  <Button onClick={() => document.querySelector('[value="generator"]')?.click()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer un projet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100">
                      {project.generated_image ? (
                        <Image
                          src={project.generated_image || "/placeholder.svg"}
                          alt={project.title}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 truncate">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.prompt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        <span>{project.original_images.length} image(s)</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProject(project)}
                          className="flex-1"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProject(project.id)}
                          className="flex-1"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Project Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
            <DialogDescription>Modifiez les détails de votre projet</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Nom du projet</Label>
                <Input
                  id="edit-title"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-prompt">Description</Label>
                <Textarea
                  id="edit-prompt"
                  value={editingProject.prompt}
                  onChange={(e) => setEditingProject({ ...editingProject, prompt: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateProject} className="flex-1">
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
