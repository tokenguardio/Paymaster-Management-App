/***
 *
 *   usePolicy hook
 *   fetch, format and return policy
 *
 **********/

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { _PolicySchema, TPolicy } from '@/types/policy';
import { fetchPolicy } from '@/utils/fetches';
import { _getValidationErrorMessage } from '@/utils/helpers';
import { _logger } from '@/utils/logger';

export const usePolicy = (id: string) => {
  const [policy, setPolicy] = useState<TPolicy>();
  const [isLoadingPolicy, setIsLoadingPolicy] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setIsLoadingPolicy(true);

      const fetchedPolicy = await fetchPolicy(id);
      // const validatedPolicy = PolicySchema.safeParse(fetchedPolicy);
      //TODO inprogress
      // if (!validatedPolicies.success) {
      //   logger.error(validatedPolicies.error);
      //   throw Error(getValidationErrorMessage('Policies'));
      // }
      // setPolicies(validatedPolicies.data);
      setPolicy(fetchedPolicy);
      setIsLoadingPolicy(false);
    } catch (err: unknown) {
      setIsLoadingPolicy(false);
      toast.error(err?.toString());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    policy,
    isLoadingPolicy,
    refreshData: fetchData,
  };
};
