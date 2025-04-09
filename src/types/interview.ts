import type Stage from "./stage"

export default interface Interview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactWhatsApp?: string
  contactPhone?: string
  createdAt: Date,
  salaryFrom?: number,
  salaryTo?: number,
  stages?: Stage[],
  result: 'Refusal' | 'Offer' 
}
