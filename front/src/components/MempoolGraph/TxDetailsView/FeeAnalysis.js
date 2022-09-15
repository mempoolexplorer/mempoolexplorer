
export function feeAnalysisStr(fa) {
  if (fa === 0) return "0% more ";
  return `${Math.floor(Math.abs(fa))}% ${fa < 0 ? "less " : "more "}`;
}

export function feeAnalysis(fee, minBlockFee) {
  const diff = Math.floor(fee) - minBlockFee;
  if (diff === 0) return 0;
  return (diff / minBlockFee) * 100;
}

export function securityBudgetFee(txWeight, subsidy) {
  const maxBlockWeight = 4000000;
  return (txWeight / maxBlockWeight) * subsidy;
}
