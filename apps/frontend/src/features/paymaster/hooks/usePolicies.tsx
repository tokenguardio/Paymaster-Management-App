/***
 *
 *   usePaymasters hook
 *   fetch, format and return paymasters
 *
 **********/

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getValidationErrorMessage } from '@/utils/helpers';
import { logger } from '@/utils/logger';
import { PolicySchema } from '../types/policy';
import { fetchPolicies } from '../utils/fetches';

export const usePolicies = () => {
  const [policies, setPolicies] = useState();
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        setIsLoadingPolicies(true);

        // await delay(1500);
        // // 🔧 MOCK: Generate mock data
        // // const getRandomStatus = () => (Math.random() > 0.5 ? 'active' : 'paused')
        // const getRandomValue = () => Math.floor(Math.random() * 1000);

        // const getRandomStatus = () => {
        //   const statuses = ['active', 'inactive', 'pending'];
        //   return statuses[Math.floor(Math.random() * statuses.length)];
        // };

        // const formatDate = (date: Date): string => {
        //   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // np. "May 15"
        // };

        // const generateUniqueSortedRandomDates = (count: number, maxDaysAgo: number) => {
        //   const uniqueDays = new Set<number>();

        //   while (uniqueDays.size < count) {
        //     uniqueDays.add(Math.floor(Math.random() * (maxDaysAgo + 1)));
        //   }

        //   const dates = Array.from(uniqueDays).map((daysAgo) => {
        //     const date = new Date();
        //     date.setDate(date.getDate() - daysAgo);
        //     return {
        //       dateObj: date,
        //       value: getRandomValue(),
        //     };
        //   });

        //   dates.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

        //   return dates.map(({ dateObj, value }) => ({
        //     'UserOps per day': value,
        //     dimension: formatDate(dateObj),
        //   }));
        // };

        // const mockPaymasters = Array.from({ length: 5 }, (_, i) => ({
        //   id: `pm_${i + 1}`,
        //   name: `Paymaster ${i + 1}`,
        //   status: getRandomStatus(),
        //   data: generateUniqueSortedRandomDates(7, 30),
        // }));

        const fetchedPoliciesData = await fetchPolicies();
        const validatedPolicies = PolicySchema.safeParse(fetchedPoliciesData.data);
        if (!validatedPolicies.success) {
          logger.error(validatedPolicies.error);
          throw Error(getValidationErrorMessage('Policies'));
        }
        setPolicies(validatedPolicies.data);
        setIsLoadingPolicies(false);
      } catch (err: unknown) {
        setIsLoadingPolicies(false);
        toast.error(err?.toString());
      }
    };

    fetchData();
  }, []);

  return {
    policies,
    isLoadingPolicies,
  };
};
