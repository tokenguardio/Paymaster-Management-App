/***
 *
 *   usePolicyRules hook
 *   fetch, format and return policy rules
 *
 **********/

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { _PolicyRulesSchema, TPolicyRules } from '@/types/policyRule';
import { fetchPolicyRules } from '@/utils/fetches';
import { _getValidationErrorMessage } from '@/utils/helpers';
import { _logger } from '@/utils/logger';

export const usePolicyRules = (id: string) => {
  const [policyRules, setPolicyRules] = useState<TPolicyRules>();
  const [isLoadingPolicyRules, setIsLoadingPolicyRules] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoadingPolicyRules(true);

      const fetchedPolicyRules = await fetchPolicyRules(id);
      // const validatedPolicyRules = PolicyRulesSchema.safeParse(fetchedPolicyRules);
      //TODO inprogress
      // if (!validatedPolicyRules.success) {
      //   logger.error(validatedPolicyRules.error);
      //   throw Error(getValidationErrorMessage('Policy rules'));
      // }
      // setPolicies(validatedPolicies.data);
      setPolicyRules(fetchedPolicyRules);
      setIsLoadingPolicyRules(false);
    } catch (err: unknown) {
      setIsLoadingPolicyRules(false);
      toast.error(err?.toString());
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    policyRules,
    isLoadingPolicyRules,
    refreshData: fetchData,
  };
};
