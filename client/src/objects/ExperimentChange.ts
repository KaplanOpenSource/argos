import { cloneDeepWith } from 'lodash';
import { ExperimentObj } from '.';

/**
 * Handles creating a modified clone of an experiment while maintaining references to specific objects.
 * Usage examples:
 * 
 * // Replace a single device
 * const newExp = experiment.createChange()
 *     .change(device1, updatedDevice1)
 *     .apply();
 * 
 * // Remove a device from a trial's devices array
 * const newExp = experiment.createChange()
 *     .change(
 *         trial.devicesOnTrial,
 *         trial.devicesOnTrial.filter(d => d !== deviceToRemove)
 *     )
 *     .apply();
 * 
 * // Multiple changes in one batch
 * const newExp = experiment.createChange()
 *     .change(device1, updatedDevice1)
 *     .change(
 *         trial.devicesOnTrial,
 *         [
 *             ...trial.devicesOnTrial.filter(d => d !== deviceToRemove),
 *             newDevice1,
 *             newDevice2
 *         ]
 *     )
 *     .change(
 *         device1.containedDevices,
 *         [
 *             ...device1.containedDevices.filter(d => d !== deviceToRemove),
 *             newContainedDevice
 *         ]
 *     )
 *     .apply();
 */
export class ExperimentChange {
  private changes: Map<object, object> = new Map();

  constructor(private readonly experiment: ExperimentObj) { }

  /**
   * Specifies a change to be applied to the experiment.
   * @param originalValue The original value in the experiment
   * @param newValue The new value to use in the clone
   * @returns this for method chaining
   */
  change<T extends object>(originalValue: T, newValue: T): ExperimentChange {
    this.changes.set(originalValue, newValue);
    return this;
  }

  /**
   * Creates a new experiment with all specified changes applied.
   * Uses lodash.cloneDeepWith to maintain references to unchanged objects.
   * @returns A new ExperimentObj with the changes applied
   */
  apply(): ExperimentObj {
    return cloneDeepWith(this.experiment, (value: unknown) => {
      if (this.changes.has(value as object)) {
        return this.changes.get(value as object);
      }
      return undefined;
    });
  }
} 