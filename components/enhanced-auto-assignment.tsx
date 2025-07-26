"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Users,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
} from "lucide-react"

interface EnhancedAutoAssignmentProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

export function EnhancedAutoAssignment({ tickets = [], onTicketUpdate }: EnhancedAutoAssignmentProps) {
  const [aiEnabled, setAiEnabled] = useState(true)
  const [learningMode, setLearningMode] = useState("adaptive")
  const [confidenceThreshold, setConfidenceThreshold] = useState(75)
  const [predictionDialogOpen, setPredictionDialogOpen] = useState(false)
  const [predictions, setPredictions] = useState<any[]>([])

  const safeTickets = Array.isArray(tickets) ? tickets : []

  // Mock AI predictions and analytics
  const aiMetrics = {
    accuracy: 94.2,
    avgResponseTime: 1.8,
    successRate: 96.7,
    learningProgress: 78,
  }

  // Mock technician performance data
  const technicianPerformance = [
    {
      id: "tech-001",
      name: "علی احمدی",
      aiScore: 92,
      specialties: ["hardware", "network"],
      avgResolutionTime: 2.4,
      customerSatisfaction: 4.8,
      predictedLoad: 85,
    },
    {
      id: "tech-002",
      name: "سارا محمدی",
      aiScore: 96,
      specialties: ["software", "email"],
      avgResolutionTime: 1.9,
      customerSatisfaction: 4.9,
      predictedLoad: 70,
    },
    {
      id: "tech-003",
      name: "محمد رضایی",
      aiScore: 88,
      specialties: ["security", "access"],
      avgResolutionTime: 3.1,
      customerSatisfaction: 4.7,
      predictedLoad: 60,
    },
  ]

  const generateAIPredictions = () => {
    const unassignedTickets = safeTickets.filter((ticket) => !ticket.assignedTo).slice(0, 5)

    const predictions = unassignedTickets.map((ticket) => {
      const bestTechnician = technicianPerformance
        .filter((tech) => tech.predictedLoad < 90)
        .sort((a, b) => b.aiScore - a.aiScore)[0]

      return {
        ticket,
        recommendedTechnician: bestTechnician,
        confidence: Math.floor(Math.random() * 30) + 70,
        estimatedResolutionTime: Math.floor(Math.random() * 4) + 1,
        riskFactors: generateRiskFactors(ticket),
      }
    })

    setPredictions(predictions)
    setPredictionDialogOpen(true)
  }

  const generateRiskFactors = (ticket: any) => {
    const factors = []
    if (ticket.priority === "urgent") factors.push("اولویت بالا")
    if (ticket.category === "security") factors.push("حساسیت امنیتی")
    if (!ticket.description || ticket.description.length < 20) factors.push("توضیحات ناکافی")
    return factors
  }

  const handleAIAssignment = () => {
    const unassignedTickets = safeTickets.filter((ticket) => !ticket.assignedTo)
    let assignedCount = 0

    unassignedTickets.forEach((ticket) => {
      const bestTechnician = technicianPerformance
        .filter((tech) => tech.predictedLoad < 90)
        .sort((a, b) => b.aiScore - a.aiScore)[0]

      if (bestTechnician) {
        onTicketUpdate(ticket.id, {
          assignedTo: bestTechnician.id,
          assignedTechnicianName: bestTechnician.name,
          status: "in-progress",
        })
        assignedCount++
      }
    })

    toast({
      title: "تعیین هوشمند انجام شد",
      description: `${assignedCount} تیکت با استفاده از هوش مصنوعی واگذار شد`,
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            تعیین هوشمند با AI
          </h2>
          <p className="text-muted-foreground">سیستم تعیین خودکار مبتنی بر هوش مصنوعی</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateAIPredictions}>
            <Target className="w-4 h-4 ml-2" />
            پیش‌بینی AI
          </Button>
          <Button onClick={handleAIAssignment} disabled={!aiEnabled}>
            <Zap className="w-4 h-4 ml-2" />
            اجرای تعیین هوشمند
          </Button>
        </div>
      </div>

      {/* AI Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            وضعیت سیستم هوش مصنوعی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{aiMetrics.accuracy}%</div>
              <div className="text-sm text-green-600">دقت پیش‌بینی</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{aiMetrics.avgResponseTime}s</div>
              <div className="text-sm text-blue-600">زمان پردازش</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{aiMetrics.successRate}%</div>
              <div className="text-sm text-purple-600">نرخ موفقیت</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{aiMetrics.learningProgress}%</div>
              <div className="text-sm text-orange-600">پیشرفت یادگیری</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">فعال‌سازی هوش مصنوعی</Label>
              <p className="text-sm text-muted-foreground">استفاده از الگوریتم‌های یادگیری ماشین</p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">عملکرد تکنسین‌ها</TabsTrigger>
          <TabsTrigger value="learning">یادگیری سیستم</TabsTrigger>
          <TabsTrigger value="analytics">تحلیل‌ها</TabsTrigger>
          <TabsTrigger value="settings">تنظیمات پیشرفته</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                عملکرد تکنسین‌ها با AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicianPerformance.map((tech) => (
                  <Card key={tech.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{tech.name}</h4>
                        <div className="flex gap-2 mt-1">
                          {tech.specialties.map((specialty) => (
                            <Badge key={specialty} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="font-bold text-purple-600">{tech.aiScore}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">امتیاز AI</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3" />
                          <span>زمان حل مسئله</span>
                        </div>
                        <div className="font-medium">{tech.avgResolutionTime} ساعت</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-3 h-3" />
                          <span>رضایت مشتری</span>
                        </div>
                        <div className="font-medium">{tech.customerSatisfaction}/5</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>بار کاری پیش‌بینی شده</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={tech.predictedLoad} className="flex-1" />
                          <span className="text-xs">{tech.predictedLoad}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                یادگیری و بهبود سیستم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>حالت یادگیری</Label>
                <Select value={learningMode} onValueChange={setLearningMode}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adaptive">تطبیقی (Adaptive)</SelectItem>
                    <SelectItem value="reinforcement">تقویتی (Reinforcement)</SelectItem>
                    <SelectItem value="supervised">نظارت شده (Supervised)</SelectItem>
                    <SelectItem value="hybrid">ترکیبی (Hybrid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>آستانه اطمینان ({confidenceThreshold}%)</Label>
                <div className="mt-2 px-3">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  تعیین خودکار فقط زمانی انجام شود که اطمینان سیستم بالاتر از این مقدار باشد
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-3">الگوهای شناسایی شده</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>تیکت‌های سخت‌افزاری صبح</span>
                      <Badge variant="outline">بالا</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>مشکلات شبکه عصر</span>
                      <Badge variant="outline">متوسط</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>درخواست‌های نرم‌افزاری</span>
                      <Badge variant="outline">بالا</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3">بهبودهای اخیر</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>دقت پیش‌بینی +3.2%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>زمان پردازش -0.4s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>رضایت مشتری +0.3</span>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                تحلیل‌های پیشرفته
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">روند عملکرد هفتگی</h4>
                  <div className="space-y-3">
                    {["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm">{day}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={Math.floor(Math.random() * 40) + 60} className="w-24" />
                          <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 40) + 60}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">توزیع دسته‌بندی‌ها</h4>
                  <div className="space-y-3">
                    {[
                      { name: "سخت‌افزار", value: 35 },
                      { name: "نرم‌افزار", value: 28 },
                      { name: "شبکه", value: 20 },
                      { name: "ایمیل", value: 10 },
                      { name: "امنیت", value: 7 },
                    ].map((category) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <span className="text-sm">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={category.value} className="w-24" />
                          <span className="text-xs text-muted-foreground">{category.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                تنظیمات پیشرفته AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>الگوریتم یادگیری</Label>
                    <Select defaultValue="neural-network">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neural-network">شبکه عصبی</SelectItem>
                        <SelectItem value="random-forest">جنگل تصادفی</SelectItem>
                        <SelectItem value="gradient-boosting">تقویت گرادیان</SelectItem>
                        <SelectItem value="svm">ماشین بردار پشتیبان</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>فرکانس به‌روزرسانی مدل</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">بلادرنگ</SelectItem>
                        <SelectItem value="hourly">ساعتی</SelectItem>
                        <SelectItem value="daily">روزانه</SelectItem>
                        <SelectItem value="weekly">هفتگی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>حجم داده‌های آموزشی</Label>
                    <Select defaultValue="6months">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">1 ماه</SelectItem>
                        <SelectItem value="3months">3 ماه</SelectItem>
                        <SelectItem value="6months">6 ماه</SelectItem>
                        <SelectItem value="1year">1 سال</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>سطح پیچیدگی مدل</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">ساده</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="complex">پیچیده</SelectItem>
                        <SelectItem value="advanced">پیشرفته</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() =>
                    toast({ title: "تنظیمات ذخیره شد", description: "تنظیمات AI با موفقیت به‌روزرسانی شد" })
                  }
                >
                  <Settings className="w-4 h-4 ml-2" />
                  ذخیره تنظیمات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Predictions Dialog */}
      <Dialog open={predictionDialogOpen} onOpenChange={setPredictionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              پیش‌بینی‌های هوش مصنوعی
            </DialogTitle>
            <DialogDescription>تحلیل و پیش‌بینی سیستم AI برای تعیین بهترین تکنسین</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{prediction.ticket.title || "عنوان نامشخص"}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{prediction.ticket.category || "نامشخص"}</Badge>
                      <Badge variant={prediction.ticket.priority === "urgent" ? "destructive" : "secondary"}>
                        {prediction.ticket.priority === "urgent"
                          ? "فوری"
                          : prediction.ticket.priority === "high"
                            ? "بالا"
                            : prediction.ticket.priority === "medium"
                              ? "متوسط"
                              : "پایین"}
                      </Badge>
                    </div>
                    {prediction.riskFactors.length > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-600">عوامل ریسک: {prediction.riskFactors.join("، ")}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-left">
                    {prediction.recommendedTechnician ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium">{prediction.recommendedTechnician.name}</span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>اطمینان: {prediction.confidence}%</div>
                          <div>زمان تخمینی: {prediction.estimatedResolutionTime} ساعت</div>
                          <div>امتیاز AI: {prediction.recommendedTechnician.aiScore}</div>
                        </div>
                        <Progress value={prediction.confidence} className="mt-2 w-24" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <span>تکنسین مناسب یافت نشد</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPredictionDialogOpen(false)}>
              بستن
            </Button>
            <Button
              onClick={() => {
                handleAIAssignment()
                setPredictionDialogOpen(false)
              }}
            >
              اجرای تعیین‌های پیشنهادی
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
