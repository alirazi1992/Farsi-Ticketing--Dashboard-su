"use client"

import * as yup from "yup"

// Step 1 validation schema
const step1Schema = yup.object({
  clientName: yup.string().required("نام و نام خانوادگی الزامی است").min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  clientEmail: yup.string().email("فرمت ایمیل صحیح نیست").required("ایمیل الزامی است"),
  clientPhone: yup.string().required("شماره تماس الزامی است"),
  priority: yup.string().required("انتخاب اولویت الزامی است"),
  mainIssue: yup.string().required("انتخاب دسته اصلی مشکل الزامی است"),
  subIssue: yup.string().required("انتخاب مشکل دقیق الزامی است"),
})

// Step 2 validation schema
const step2Schema = yup.object({
  title: yup.string().required("عنوان تیکت الزامی است").min(5, "عنوان باید حداقل ۵ کاراکتر باشد"),
  description: yup.string().required("شرح کامل مشکل الزامی است").min(20, "شرح مشکل باید حداقل ۲۰ کاراکتر باشد"),
})

// Combined schemas
const combinedSchema = step1Schema.concat(step2Schema)

export function getCombinedSchema(step: number) {
  if (step === 1) {
    return step1Schema
  } else if (step === 2) {
    return step2Schema
  } else {
    return combinedSchema
  }
}

export { step1Schema, step2Schema, combinedSchema }
