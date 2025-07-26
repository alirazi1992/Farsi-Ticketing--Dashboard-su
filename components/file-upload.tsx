"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { Upload, File, X, AlertCircle } from "lucide-react"
import type { UploadedFile } from "@/lib/file-upload"
import { formatFileSize, validateFileType, validateFileSize, uploadFile } from "@/lib/file-upload"

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSizeInMB?: number
  allowedTypes?: string[]
  className?: string
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSizeInMB = 10,
  allowedTypes = ["image/*", "application/pdf", "text/*", ".doc", ".docx", ".xls", ".xlsx"],
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const fileArray = Array.from(selectedFiles)

    // Check if adding these files exceeds the maximum
    if (files.length + fileArray.length > maxFiles) {
      toast({
        title: "تعداد فایل‌ها زیاد است",
        description: `حداکثر ${maxFiles} فایل می‌توانید آپلود کنید`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    const newFiles: UploadedFile[] = []

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]

      // Validate file type
      if (!validateFileType(file, allowedTypes)) {
        toast({
          title: "نوع فایل نامعتبر",
          description: `فایل ${file.name} نوع مجاز نیست`,
          variant: "destructive",
        })
        continue
      }

      // Validate file size
      if (!validateFileSize(file, maxSizeInMB)) {
        toast({
          title: "حجم فایل زیاد است",
          description: `فایل ${file.name} بیش از ${maxSizeInMB}MB است`,
          variant: "destructive",
        })
        continue
      }

      try {
        const uploadedFile = await uploadFile(file)
        newFiles.push(uploadedFile)
        setUploadProgress(((i + 1) / fileArray.length) * 100)
      } catch (error) {
        toast({
          title: "خطا در آپلود",
          description: `آپلود فایل ${file.name} با خطا مواجه شد`,
          variant: "destructive",
        })
      }
    }

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)

    setIsUploading(false)
    setUploadProgress(0)

    if (newFiles.length > 0) {
      toast({
        title: "فایل‌ها آپلود شدند",
        description: `${newFiles.length} فایل با موفقیت آپلود شد`,
      })
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter((file) => file.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)

    toast({
      title: "فایل حذف شد",
      description: "فایل از لیست پیوست‌ها حذف شد",
    })
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFiles = e.dataTransfer.files
    handleFileSelect(droppedFiles)
  }

  return (
    <div className={className} dir="rtl">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-gray-700">فایل‌های خود را اینجا رها کنید</p>
            <p className="text-sm text-gray-500 mt-1">یا کلیک کنید تا فایل انتخاب کنید</p>
          </div>
          <Button type="button" variant="outline" disabled={isUploading} className="gap-2 bg-transparent">
            <Upload className="w-4 h-4" />
            {isUploading ? "در حال آپلود..." : "انتخاب فایل"}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept={allowedTypes.join(",")}
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">در حال آپلود...</span>
            <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3 text-right">فایل‌های پیوست شده:</h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border text-right"
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(file.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Upload Info */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg" dir="rtl">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 text-right">
            <p className="font-medium mb-1">راهنمای آپلود فایل:</p>
            <ul className="list-disc list-inside space-y-1 text-right">
              <li>حداکثر {maxFiles} فایل می‌توانید آپلود کنید</li>
              <li>حداکثر حجم هر فایل: {maxSizeInMB}MB</li>
              <li>فرمت‌های مجاز: تصاویر، PDF، اسناد Word و Excel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
