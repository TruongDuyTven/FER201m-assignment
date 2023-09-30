import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { OrderNestStatus, OrderStatus } from './types'
import moment from 'moment'
import 'moment/dist/locale/vi'

moment.locale('vi')

// generated by shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// created by chatgpt
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/
  return base64Regex.test(imageData)
}

//created by google bard
export const generateRandomHexCode = () => {
  const randomNumber = Math.floor(Math.random() * 16777215)
  return randomNumber.toString(16)
}

export function formatPrice(num: number) {
  return Number(num).toLocaleString().replaceAll(',', '.') + 'đ'
}

// created by chatgpt
export function calculateAge(birthday: Date | string | undefined): string {
  if (!birthday) return 'Không có thông tin'
  const now = moment()
  const birthdayMoment = moment(birthday, 'YYYY-MM-DD')

  if (!birthdayMoment.isValid()) {
    throw new Error('Lỗi ngày sinh')
  }

  const ageInMonths = now.diff(birthdayMoment, 'months')
  return ageInMonths + ' tháng tuổi'
}

export function calculateTime(time: Date | string | undefined): string {
  moment.locale('vi')
  return moment(time).locale('vi').fromNow()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addSearchParams(url: string, params: Record<string, any>) {
  url += '?'
  Object.keys(params).forEach((key) => {
    if (params[key]) url += key.toString() + '=' + params[key].toString() + '&'
  })
  return url
}

export const statusToVi: Record<OrderNestStatus, string> = {
  processing: 'Đang chờ xử lý',
  delivering: 'Đang vận chuyển',
  success: 'Hoàn thành',
  canceled: 'Đã hủy',
  breeding: 'Đang phối giống'
}

export const statusToMessage: Record<OrderStatus, string> = {
  processing: 'Đơn hàng đang được chuẩn bị',
  delivering: 'Đơn hàng đang trên đường đến tay bạn',
  success: 'Đơn hàng đã được giao thành công',
  canceled: 'Đơn hàng đã bị hủy'
}

type Variant = 'warning' | 'info' | 'success' | 'destructive' | 'breed'

export const statusToVariant: Record<OrderNestStatus, Variant> = {
  processing: 'warning',
  delivering: 'info',
  breeding: 'breed',
  success: 'success',
  canceled: 'destructive'
}

const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
}

export const formatDate = (date: Date) => {
  const d = new Date(date)
  return d.toLocaleDateString('vi', options)
}
