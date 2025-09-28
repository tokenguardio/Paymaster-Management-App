/***
 *
 *   usePolicies hook
 *   fetch, format and return policies
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
        setIsLoadingPolicies(true);

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
