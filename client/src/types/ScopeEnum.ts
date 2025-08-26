export enum ScopeEnum {
  SCOPE_TRIAL = "Trial",
  SCOPE_EXPERIMENT = "Device definition",
  SCOPE_EXPERIMENT_ALT = "Experiment",// legacy
  SCOPE_CONSTANT = "Constant"
}

export const ScopesForDeviceDef = [ScopeEnum.SCOPE_EXPERIMENT, ScopeEnum.SCOPE_EXPERIMENT_ALT];
export const ScopesForTrialDef = [ScopeEnum.SCOPE_TRIAL, undefined];

export const scopeToNewScope = (scope: ScopeEnum | undefined) => {
  if (scope === ScopeEnum.SCOPE_TRIAL || scope === undefined) {
    return ScopeEnum.SCOPE_TRIAL;
  } else if (scope === ScopeEnum.SCOPE_EXPERIMENT || scope === ScopeEnum.SCOPE_EXPERIMENT_ALT) {
    return ScopeEnum.SCOPE_EXPERIMENT;
  }
  return ScopeEnum.SCOPE_CONSTANT;
}

export const isScopeEqual = (one: ScopeEnum | undefined, two: ScopeEnum | undefined): boolean => {
  return scopeToNewScope(one) === scopeToNewScope(two);
}
