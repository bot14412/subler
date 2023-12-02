import { createScheduler } from '$lib/helpers/factory';

const scheduler = createScheduler({
  delay: 180,
});

/** @param {() => void} callback  */
export function addSchedulerTask(callback) {
  scheduler.add(callback);
}
