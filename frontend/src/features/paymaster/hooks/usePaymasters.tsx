/***
 *
 *   usePaymasters hook
 *   fetch, format and return paymasters
 *
 **********/

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { logger } from '@/utils/logger'
import { getValidationErrorMessage } from '@/utils/helpers'

import { PaymastersSchema } from '../types/paymaster'
import { fetchPaymasters } from '../utils/fetches'

export const usePaymasters = (param: string) => {
  const [paymasters, setPaymasters] = useState()
  const [isLoadingPaymasters, setIsLoadingPaymasters] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        setIsLoadingPaymasters(true)

        await delay(1500)
        // 🔧 MOCK: Generate mock data
        // const getRandomStatus = () => (Math.random() > 0.5 ? 'active' : 'paused')
        const getRandomValue = () => Math.floor(Math.random() * 1000);

        const getRandomStatus = () => {
          const statuses = ['active', 'inactive', 'pending'];
          return statuses[Math.floor(Math.random() * statuses.length)];
        };
        
        const formatDate = (date: Date): string => {
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // np. "May 15"
        };
        
        const generateUniqueSortedRandomDates = (count: number, maxDaysAgo: number) => {
          const uniqueDays = new Set<number>();
        
          while (uniqueDays.size < count) {
            uniqueDays.add(Math.floor(Math.random() * (maxDaysAgo + 1)));
          }
        
          const dates = Array.from(uniqueDays).map(daysAgo => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return {
              dateObj: date,
              value: getRandomValue(),
            };
          });
        
          dates.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        
          return dates.map(({ dateObj, value }) => ({
            'UserOps per day': value,
            dimension: formatDate(dateObj),
          }));
        };
        
        const mockPaymasters = Array.from({ length: 5 }, (_, i) => ({
          id: `pm_${i + 1}`,
          name: `Paymaster ${i + 1}`,
          status: getRandomStatus(),
          data: generateUniqueSortedRandomDates(7, 30),
        }));

        // const fetchedPaymastersData = await fetchPaymasters(param)
        const validatedPaymasters = PaymastersSchema.safeParse(
          // fetchedPaymastersData.data
          mockPaymasters
        )
        if (!validatedPaymasters.success) {
          logger.error(validatedPaymasters.error)
          throw Error(getValidationErrorMessage('Paymasters'))
        }
        setPaymasters(validatedPaymasters.data)
        setIsLoadingPaymasters(false)
      } catch (err) {
        setIsLoadingPaymasters(false)
        toast.error(err.toString())
      }
    }

    fetchData()
  }, [])

  return {
    paymasters,
    isLoadingPaymasters,
  }
}
