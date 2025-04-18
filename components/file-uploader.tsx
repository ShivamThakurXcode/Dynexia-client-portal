"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatFileSize } from "@/lib/utils"

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedTypes?: string
}

export function FileUploader({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip",
}: FileUploaderProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const validateFile = (file: File) => {
    // Check file size
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `${file.name} exceeds the maximum file size of ${formatFileSize(maxSize)}`,
        variant: "destructive",
      })
      return false
    }

    // Check file type if acceptedTypes is provided
    if (acceptedTypes && acceptedTypes !== "*") {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      const acceptedTypesList = acceptedTypes.split(",")

      if (
        !acceptedTypesList.some(
          (type) => type.trim() === fileExtension || type.trim() === file.type || type.trim() === "*",
        )
      ) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an accepted file type`,
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(validateFile)

      if (files.length + newFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload a maximum of ${maxFiles} files`,
          variant: "destructive",
        })
        return
      }

      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)

      if (onFilesSelected) {
        onFilesSelected(updatedFiles)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(validateFile)

      if (files.length + newFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `You can only upload a maximum of ${maxFiles} files`,
          variant: "destructive",
        })
        return
      }

      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)

      if (onFilesSelected) {
        onFilesSelected(updatedFiles)
      }
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)

    if (onFilesSelected) {
      onFilesSelected(updatedFiles)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium mb-1">Drag and drop files here</h3>
        <p className="text-sm text-muted-foreground mb-4">or click to browse from your computer</p>
        <Input
          type="file"
          multiple
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
          accept={acceptedTypes}
        />
        <Button variant="outline" asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            Browse Files
          </label>
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Supported file types: PDF, DOCX, XLSX, JPG, PNG, ZIP (Max {formatFileSize(maxSize)})
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Selected Files ({files.length})</h3>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center overflow-hidden">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mr-3">
                    <FileIcon fileType={file.name.split(".").pop() || ""} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FileIcon({ fileType }: { fileType: string }) {
  const getFileIcon = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M9 15v-2h6v2" />
            <path d="M9 18v-2h6v2" />
            <path d="M9 12v-2h2v2" />
          </svg>
        )
      case "doc":
      case "docx":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        )
      case "jpg":
      case "jpeg":
      case "png":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )
      case "zip":
      case "rar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-500"
          >
            <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z" />
            <path d="M11 4v4c0 1.1.9 2 2 2h4" />
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )
    }
  }

  return getFileIcon()
}
