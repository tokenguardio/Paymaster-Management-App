/***
 *
 *   usePolicies hook
 *   fetch, format and return policies
 *
 **********/

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { _PolicySchema } from '@/types/policy';
import { _getValidationErrorMessage } from '@/utils/helpers';
import { _logger } from '@/utils/logger';
import { fetchPolicies } from '../utils/fetches';

export const usePolicies = () => {
  const [policies, setPolicies] = useState();
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoadingPolicies(true);

      const fetchedPolicies = await fetchPolicies('?status=ACTIVE');
      // const validatedPolicies = PolicySchema.safeParse(fetchedPolicies);
      //TODO inprogress
      // if (!validatedPolicies.success) {
      //   logger.error(validatedPolicies.error);
      //   throw Error(getValidationErrorMessage('Policies'));
      // }
      // setPolicies(validatedPolicies.data);
      setPolicies(fetchedPolicies);
      setIsLoadingPolicies(false);
    } catch (err: unknown) {
      setIsLoadingPolicies(false);
      toast.error(err?.toString());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    policies,
    isLoadingPolicies,
    refreshData: fetchData,
  };
};
