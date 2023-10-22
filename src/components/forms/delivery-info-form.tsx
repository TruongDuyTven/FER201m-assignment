import { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { District, Province, Ward } from '@/lib/types'
import { TDeliveryInfoSchema, deliveryInfoSchema } from '@/lib/validations/deliveryInfo'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import cashIcon from '@/assets/cash.png'
import creditIcon from '@/assets/credit.svg'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Shell } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  onSubmit: (data: TDeliveryInfoSchema) => void
  className?: string
  addDeliveryInfo?: boolean
  CloseComponent?: React.ReactNode
}

function DeliveryInfoForm({ onSubmit, className, addDeliveryInfo, CloseComponent }: Props) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)

  const form = useForm<TDeliveryInfoSchema>({
    resolver: zodResolver(deliveryInfoSchema),
    defaultValues: {
      receiver: '',
      phoneNumber: '',
      province: '',
      district: '',
      ward: '',
      address: '',
      notice: '',
      type: addDeliveryInfo ? 'cod' : undefined
    }
  })
  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get('https://provinces.open-api.vn/api/p/')
      setProvinces(
        response.data.sort((a: Province, b: Province) => {
          return a.name.localeCompare(b.name)
        })
      )
    }

    fetchProvinces()
  }, [])
  useEffect(() => {
    const handleProvinceChange = async () => {
      if (selectedProvince === null) return
      setSelectedDistrict(null)

      const response = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
      setDistricts(
        response.data.districts.sort((a: District, b: District) => {
          return a.name.localeCompare(b.name)
        })
      )
    }

    handleProvinceChange()
  }, [selectedProvince])
  useEffect(() => {
    const handleDistrictChange = async () => {
      if (selectedDistrict === null) return

      const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
      setWards(
        response.data.wards.sort((a: Ward, b: Ward) => {
          return a.name.localeCompare(b.name)
        })
      )
    }

    handleDistrictChange()
  }, [selectedDistrict])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-8', className)}>
        <FormField
          control={form.control}
          name='receiver'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và Tên*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại*</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-between gap-3'>
          <FormField
            control={form.control}
            name='province'
            render={() => (
              <FormItem className='flex-1'>
                <FormLabel>Tỉnh*</FormLabel>
                <Select
                  onValueChange={(value: string) => {
                    const province = provinces.find((province) => province.code === Number(value))
                    form.setValue('province', province?.name || '')
                    setSelectedProvince(province || null)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn tỉnh...' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='max-h-[250px]'>
                    <ScrollArea>
                      {provinces?.map((province) => (
                        <SelectItem key={province.code} value={province.code.toString()}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='district'
            render={() => (
              <FormItem className='flex-1'>
                <FormLabel>Thành phố*</FormLabel>
                <Select
                  onValueChange={(value: string) => {
                    const district = districts.find((district) => district.code === Number(value))

                    form.setValue('district', district?.name || '')
                    setSelectedDistrict(district || null)
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn thành phố...' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='max-h-[250px]'>
                    <ScrollArea>
                      {districts?.map((district) => (
                        <SelectItem key={district.code} value={district.code.toString()}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='ward'
            render={() => (
              <FormItem className='flex-1'>
                <FormLabel>Phường/Xã*</FormLabel>
                <Select
                  onValueChange={(value: string) => {
                    const ward = wards.find((ward) => ward.code === Number(value))

                    form.setValue('ward', ward?.name || '')
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn phường/xã...' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='max-h-[250px]'>
                    <ScrollArea>
                      {wards?.map((ward) => (
                        <SelectItem key={ward.code} value={ward.code.toString()}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='mt-5 '>
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số nhà, tên đường*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {!addDeliveryInfo && (
          <>
            <div className='mt-5 '>
              <p className='uppercase font-bold text-lg'>Thông tin bổ sung</p>

              <FormField
                control={form.control}
                name='notice'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className='mt-3 h-[150px]'
                        placeholder='Ghi chú đơn hàng, ví dụ: Thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='mt-5'>
              <p className='text-lg font-bold uppercase'>hình thức thanh toán</p>
              <div className='mt-5 '>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormMessage />
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center pl-4 space-y-0 border rounded-md '>
                            <FormControl>
                              <RadioGroupItem value='cod' />
                            </FormControl>
                            <FormLabel className='flex items-center gap-4 py-6 font-normal cursor-pointer'>
                              <div>
                                <img src={cashIcon} alt='' className='w-8 h-w-8 ml-9' />
                              </div>
                              Thanh toán khi nhận hàng
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center pl-4 space-y-0 border rounded-md'>
                            <FormControl>
                              <RadioGroupItem value='online' />
                            </FormControl>

                            <FormLabel className='flex items-center gap-4 py-6 font-normal cursor-pointer'>
                              <div>
                                <img src={creditIcon} alt='' className='w-8 mb-2 h-w-8 ml-9' />
                              </div>
                              Thẻ ATM/Thẻ tín dụng (Credit Card)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='mt-4'>
              <Button disabled={form.formState.isSubmitting} type='submit' className='w-full p-7 text-[20px] font-bold'>
                Thanh toán
                {form.formState.isSubmitting && <Shell className='w-4 h-4 ml-1 animate-spin' />}
              </Button>
            </div>
          </>
        )}
        {addDeliveryInfo && (
          <div className='flex justify-end items-center gap-3'>
            {CloseComponent}
            <Button disabled={form.formState.isSubmitting} type='submit'>
              Thêm
              {form.formState.isSubmitting && <Shell className='w-4 h-4 ml-1 animate-spin' />}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}

export default DeliveryInfoForm
