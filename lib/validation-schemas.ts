import * as yup from "yup"

// Iranian national code validation
const validateNationalCode = (code: string): boolean => {
  if (!code || code.length !== 10) return false

  const digits = code.split("").map(Number)
  const checkDigit = digits[9]

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i)
  }

  const remainder = sum % 11
  return remainder < 2 ? checkDigit === remainder : checkDigit === 11 - remainder
}

// Phone number validation for Iranian numbers
const validatePhoneNumber = (phone: string): boolean => {
  const iranianPhoneRegex = /^(\+98|0)?9\d{9}$/
  return iranianPhoneRegex.test(phone.replace(/\s/g, ""))
}

// General information schema (Step 1)
export const generalInfoSchema = yup.object({
  clientName: yup
    .string()
    .required("نام و نام خانوادگی الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),

  clientPhone: yup
    .string()
    .required("شماره تماس الزامی است")
    .test("phone-validation", "شماره تماس معتبر نیست", validatePhoneNumber),

  clientEmail: yup.string().required("ایمیل الزامی است").email("فرمت ایمیل صحیح نیست"),

  clientAddress: yup.string().required("آدرس الزامی است").min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد"),

  nationalCode: yup
    .string()
    .required("کد ملی الزامی است")
    .test("national-code", "کد ملی معتبر نیست", validateNationalCode),

  priority: yup
    .string()
    .required("انتخاب اولویت الزامی است")
    .oneOf(["low", "medium", "high", "urgent"], "اولویت انتخاب شده معتبر نیست"),

  category: yup
    .string()
    .required("انتخاب دسته‌بندی الزامی است")
    .oneOf(["hardware", "software", "network", "email", "security", "access"], "دسته‌بندی انتخاب شده معتبر نیست"),
})

// Base ticket schema
const baseTicketSchema = yup.object({
  title: yup
    .string()
    .required("عنوان تیکت الزامی است")
    .min(5, "عنوان باید حداقل ۵ کاراکتر باشد")
    .max(100, "عنوان نباید بیشتر از ۱۰۰ کاراکتر باشد"),

  description: yup
    .string()
    .required("شرح مشکل الزامی است")
    .min(20, "شرح مشکل باید حداقل ۲۰ کاراکتر باشد")
    .max(1000, "شرح مشکل نباید بیشتر از ۱۰۰۰ کاراکتر باشد"),
})

// Hardware specific schema
const hardwareSchema = yup.object({
  deviceType: yup.string().required("نوع دستگاه الزامی است"),
  deviceBrand: yup.string().required("برند دستگاه الزامی است"),
  deviceModel: yup.string().required("مدل دستگاه الزامی است"),
  serialNumber: yup.string(),
  purchaseDate: yup.string(),
  warrantyStatus: yup.string().required("وضعیت گارانتی الزامی است"),
  problemType: yup.string().required("نوع مشکل الزامی است"),
  problemFrequency: yup.string().required("تکرار مشکل الزامی است"),
  lastWorkingDate: yup.string(),
  errorCodes: yup.string(),
})

// Software specific schema
const softwareSchema = yup.object({
  softwareName: yup.string().required("نام نرم‌افزار الزامی است"),
  softwareVersion: yup.string(),
  operatingSystem: yup.string().required("سیستم عامل الزامی است"),
  osVersion: yup.string().required("نسخه سیستم عامل الزامی است"),
  installationType: yup.string().required("نوع نصب الزامی است"),
  licenseType: yup.string().required("نوع لایسنس الزامی است"),
  problemOccurrence: yup.string().required("زمان بروز مشکل الزامی است"),
  errorMessage: yup.string(),
  affectedFeatures: yup.string(),
})

// Network specific schema
const networkSchema = yup.object({
  connectionType: yup.string().required("نوع اتصال الزامی است"),
  networkLocation: yup.string().required("محل شبکه الزامی است"),
  deviceCount: yup.string().required("تعداد دستگاه‌های متصل الزامی است"),
  internetProvider: yup.string().required("ارائه‌دهنده اینترنت الزامی است"),
  connectionSpeed: yup.string(),
  ipConfiguration: yup.string().required("تنظیمات IP الزامی است"),
  affectedServices: yup.string().required("سرویس‌های تحت تأثیر الزامی است"),
  outageStartTime: yup.string(),
  troubleshootingSteps: yup.string(),
})

// Email specific schema
const emailSchema = yup.object({
  emailProvider: yup.string().required("ارائه‌دهنده ایمیل الزامی است"),
  emailAddress: yup.string().required("آدرس ایمیل الزامی است").email("فرمت ایمیل صحیح نیست"),
  emailClient: yup.string().required("کلاینت ایمیل الزامی است"),
  accountType: yup.string().required("نوع حساب الزامی است"),
  problemType: yup.string().required("نوع مشکل الزامی است"),
  lastSuccessfulAccess: yup.string(),
  emailSize: yup.string(),
  serverSettings: yup.string(),
  errorDetails: yup.string(),
})

// Security specific schema
const securitySchema = yup.object({
  incidentType: yup.string().required("نوع حادثه امنیتی الزامی است"),
  incidentSeverity: yup.string().required("شدت حادثه الزامی است"),
  incidentTime: yup.string().required("زمان حادثه الزامی است"),
  affectedSystems: yup.string().required("سیستم‌های تحت تأثیر الزامی است"),
  dataCompromised: yup.string().required("وضعیت امنیت داده‌ها الزامی است"),
  evidenceAvailable: yup.string().required("وجود مدرک الزامی است"),
  immediateActions: yup.string().required("اقدامات فوری انجام شده الزامی است"),
  witnessCount: yup.string(),
  suspiciousActivity: yup.string(),
})

// Access specific schema
const accessSchema = yup.object({
  accessType: yup.string().required("نوع درخواست دسترسی الزامی است"),
  targetSystem: yup.string().required("سیستم مقصد الزامی است"),
  requestedPermissions: yup.string().required("مجوزهای درخواستی الزامی است"),
  businessJustification: yup.string().required("توجیه کسب‌وکار الزامی است"),
  managerName: yup.string().required("نام مدیر مستقیم الزامی است"),
  managerEmail: yup.string().required("ایمیل مدیر الزامی است").email("فرمت ایمیل صحیح نیست"),
  accessDuration: yup.string().required("مدت زمان دسترسی الزامی است"),
  urgencyReason: yup.string(),
  alternativeAccess: yup.string(),
})

// Ticket access schema
export const ticketAccessSchema = yup.object({
  ticketId: yup
    .string()
    .required("شماره تیکت الزامی است")
    .matches(/^TK-\d{4}-\d{3}$/, "فرمت شماره تیکت صحیح نیست (مثال: TK-2024-001)"),

  email: yup.string().required("ایمیل الزامی است").email("فرمت ایمیل صحیح نیست"),

  phone: yup
    .string()
    .required("شماره تماس الزامی است")
    .test("phone-validation", "شماره تماس معتبر نیست", validatePhoneNumber),
})

// Function to get combined schema based on category
export const getCombinedSchema = (category: string) => {
  const categorySchemas = {
    hardware: hardwareSchema,
    software: softwareSchema,
    network: networkSchema,
    email: emailSchema,
    security: securitySchema,
    access: accessSchema,
  }

  const categorySchema = categorySchemas[category] || yup.object({})

  return generalInfoSchema.concat(baseTicketSchema).concat(categorySchema)
}

// Export individual schemas for specific use cases
export { baseTicketSchema, hardwareSchema, softwareSchema, networkSchema, emailSchema, securitySchema, accessSchema }
