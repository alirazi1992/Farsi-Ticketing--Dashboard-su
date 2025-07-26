"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Upload, File } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export function FileUpload({
  onFileUpload,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".txt", ".zip"],
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "خطا در آپلود فایل",
        description: `حجم فایل ${file.name} بیش از ${maxSize} مگابایت است`,
        variant: "destructive",
      })
      return false
    }

    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension || "")) {
      toast({
        title: "خطا در آپلود فایل",
        description: `نوع فایل ${file.name} پشتیبانی نمی‌شود`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files)

    if (fileArray.length > maxFiles) {
      toast({
        title: "خطا در آپلود فایل",
        description: `حداکثر ${maxFiles} فایل می‌توانید انتخاب کنید`,
        variant: "destructive",
      })
      return
    }

    const validFiles = fileArray.filter(validateFile)

    if (validFiles.length > 0) {
      setIsUploading(true)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      onFileUpload(validFiles)
      setIsUploading(false)

      toast({
        title: "فایل‌ها آپلود شدند",
        description: `${validFiles.length} فایل با موفقیت اضافه شد`,
      })
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full font-iran" dir="rtl">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 font-iran">فایل‌های خود را اینجا بکشید یا کلیک کنید</p>
            <p className="text-sm text-gray-500 mt-2 font-iran">
              حداکثر {maxFiles} فایل، هر کدام تا {maxSize} مگابایت
            </p>
            <p className="text-xs text-gray-400 mt-1 font-iran">فرمت‌های مجاز: {acceptedTypes.join(", ")}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="gap-2 font-iran bg-transparent"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                در حال آپلود...
              </>
            ) : (
              <>
                <File className="w-4 h-4" />
                انتخاب فایل
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
