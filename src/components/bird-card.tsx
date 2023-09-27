import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from './ui/button'
import { Bird } from '@/lib/types'
import noImage from '@/assets/no-image.avif'
import { useToast } from './ui/use-toast'
import { useCartContext } from '@/contexts/cart-provider'
import maleIcon from '@/assets/male.svg'
import femaleIcon from '@/assets/female.svg'
import breedIcon from '@/assets/breed.svg'
import birdIcon from '@/assets/bird-color.svg'
import { useCompareStore } from '@/store/use-compare'
import { useBreedStore } from '@/store/use-breed'

type Props = {
  className?: string
  bird: Bird
}

function BirdCard({ className, bird }: Props) {
  const { addBirdToCart } = useCartContext()
  const { addToCompare } = useCompareStore()
  const { addToBreed } = useBreedStore()

  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    addBirdToCart(bird._id)
    toast({
      variant: 'success',
      title: 'Đã thêm chim vào giỏ hàng!',
      duration: 2500
    })
  }

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
  }

  return (
    <Link
      to={`/birds/${bird?._id}`}
      className={cn('focus:ring-2 rounded-lg hover:ring-2 ring-primary transition duration-300', className)}
    >
      <Card className='border-2 overflow-hidden'>
        <CardHeader className='p-0 mb-4'>
          <div className='aspect-square overflow-hidden'>
            <img
              src={bird?.imageUrls?.[0] || noImage}
              alt=''
              className='object-cover w-full h-full transition-all duration-300 hover:scale-105'
            />
          </div>
        </CardHeader>
        <CardContent className='flex-col items-start'>
          <div>
            <p className='font-semibold text-lg lg:text-xl line-clamp-1'>{bird?.name}</p>
          </div>
          <div className='flex items-center gap-2'>
            Loại chim:{' '}
            {bird.type === 'sell' ? (
              <>
                Chim kiểng
                <img className='w-6 h-6' src={birdIcon} />
              </>
            ) : (
              <>
                Chim phối giống
                <img className='w-6 h-6' src={breedIcon} />
              </>
            )}
          </div>
          <div className='flex items-center gap-2 lg:text-lg'>
            {bird.type === 'sell' ? (
              `Giá bán: ${formatPrice(bird?.sellPrice || 0)}`
            ) : (
              <>
                Giá phối giống: {formatPrice(bird?.breedPrice || 0)}
                {bird.gender === 'male' ? (
                  <img className='w-6 h-6' src={maleIcon} />
                ) : (
                  <img className='w-6 h-6' src={femaleIcon} />
                )}
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex gap-2 flex-col'>
          <div className='flex w-full gap-2'>
            {bird.type === 'sell' && (
              <Button onClick={handleAddToCart} variant='outline' className='w-full'>
                Thêm vào giỏ
              </Button>
            )}

            <Button
              onClick={(e) => {
                e.preventDefault()
                addToCompare(bird)
              }}
              variant='outline'
              className='w-full'
            >
              So sánh
            </Button>
          </div>

          {bird.type === 'sell' ? (
            <Button onClick={handleBuyNow} className='w-full'>
              Mua ngay
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault()
                addToBreed(bird)
              }}
              className='w-full'
            >
              Phối giống
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

export default BirdCard
