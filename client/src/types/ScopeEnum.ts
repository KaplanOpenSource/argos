export enum ScopeEnum {
  SCOPE_TRIAL = "Trial",
  SCOPE_EXPERIMENT = "Device definition",
  SCOPE_EXPERIMENT_ALT = "Experiment",// legacy
  SCOPE_CONSTANT = "Constant"
}

export const ScopesForDeviceDef = [ScopeEnum.SCOPE_EXPERIMENT, ScopeEnum.SCOPE_EXPERIMENT_ALT];
export const ScopesForTrialDef = [ScopeEnum.SCOPE_TRIAL, undefined];

