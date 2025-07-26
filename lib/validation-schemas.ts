import * as yup from "yup"

const step1Schema = yup.object({
  clientName: yup.string().required("نام و نام خانوادگی الزامی است").min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  clientEmail: yup.string().required("ایمیل الزامی است").email("فرمت ایمیل صحیح نیست"),
  clientPhone: yup
    .string()
    .required("شماره تماس الزامی است")
    .matches(/^09\d{9}$/, "شماره تماس باید با ۰۹ شروع شود و ۱۱ رقم باشد"),
  priority: yup.string().required("انتخاب اولویت الزامی است").oneOf(["low", "medium", "high", "urgent"]),
  mainIssue: yup.string().required("انتخاب دسته اصلی مشکل الزامی است"),
  subIssue: yup.string().required("انتخاب مشکل دقیق الزامی است"),
})

const step2Schema = yup.object({
  title: yup.string().required("عنوان تیکت الزامی است").min(5, "عنوان باید حداقل ۵ کاراکتر باشد"),
  description: yup.string().required("شرح مشکل الزامی است").min(20, "شرح مشکل باید حداقل ۲۰ کاراکتر باشد"),
  // Optional fields for dynamic form
  deviceBrand: yup.string().optional(),
  deviceModel: yup.string().optional(),
  powerStatus: yup.string().optional(),
  lastWorking: yup.string().optional(),
  printerBrand: yup.string().optional(),
  printerType: yup.string().optional(),
  printerProblem: yup.string().optional(),
  operatingSystem: yup.string().optional(),
  osVersion: yup.string().optional(),
  osIssueType: yup.string().optional(),
  softwareName: yup.string().optional(),
  softwareVersion: yup.string().optional(),
  applicationIssue: yup.string().optional(),
  connectionType: yup.string().optional(),
  internetProvider: yup.string().optional(),
  connectionIssue: yup.string().optional(),
  wifiNetwork: yup.string().optional(),
  deviceType: yup.string().optional(),
  wifiIssue: yup.string().optional(),
  networkLocation: yup.string().optional(),
  emailProvider: yup.string().optional(),
  emailClient: yup.string().optional(),
  errorMessage: yup.string().optional(),
  incidentTime: yup.string().optional(),
  securitySeverity: yup.string().optional(),
  affectedData: yup.string().optional(),
  requestedSystem: yup.string().optional(),
  accessLevel: yup.string().optional(),
  accessReason: yup.string().optional(),
  trainingTopic: yup.string().optional(),
  currentLevel: yup.string().optional(),
  preferredMethod: yup.string().optional(),
  equipmentType: yup.string().optional(),
  maintenanceType: yup.string().optional(),
  preferredTime: yup.string().optional(),
})

export const getCombinedSchema = (step: number) => {
  if (step === 1) {
    return yup.object({
      clientName: yup.string().required("نام الزامی است"),
      clientEmail: yup.string().email("ایمیل معتبر وارد کنید").required("ایمیل الزامی است"),
      clientPhone: yup.string().required("شماره تماس الزامی است"),
      priority: yup.string().required("انتخاب اولویت الزامی است"),
      mainIssue: yup.string().required("انتخاب دسته اصلی مشکل الزامی است"),
      subIssue: yup.string().required("انتخاب مشکل دقیق الزامی است"),
    })
  }

  return yup.object({
    title: yup.string().required("عنوان تیکت الزامی است"),
    description: yup.string().required("شرح مشکل الزامی است"),
  })
}

export const getFullTicketSchema = () => {
  return step1Schema.concat(step2Schema)
}
