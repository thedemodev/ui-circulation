import { cloneDeep } from 'lodash';

export default function (policy) {
  const finePolicy = cloneDeep(policy);

  if ((finePolicy.overdueFine !== undefined && Number(finePolicy.overdueFine.quantity) === 0) ||
      (finePolicy.overdueFine !== undefined && finePolicy.overdueFine.quantity === '')) {
    delete finePolicy.overdueFine;
  }

  if ((finePolicy.overdueRecallFine !== undefined && Number(finePolicy.overdueRecallFine.quantity) === 0) ||
      (finePolicy.overdueRecallFine !== undefined && finePolicy.overdueRecallFine.quantity === '')) {
    delete finePolicy.overdueRecallFine;
  }

  return finePolicy;
}
