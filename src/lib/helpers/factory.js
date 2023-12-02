/**
 * @template T
 * @param {{ callback: (value: T) => void, delay: number }} options
 */
export function createDebouncer(options) {
  const { callback } = options;
  const delay = options.delay * 1000;

  /** @type {T | undefined} */
  let pendingValue = undefined;

  /** @type {any} */
  let timeout = undefined;

  const clearDebounceTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  const debouncer = (/** @type {T} */ value) => {
    clearDebounceTimeout();
    pendingValue = value;

    timeout = setTimeout(() => {
      debouncer.flush();
    }, delay);
  };

  debouncer.flush = () => {
    if (pendingValue !== undefined) {
      clearDebounceTimeout();
      callback(pendingValue);
      pendingValue = undefined;
    }
  };

  return debouncer;
}

/** @param {{ delay: number }} options */
export function createScheduler(options) {
  const delay = options.delay * 1000;

  /** @type {Array<() => void>} */
  const callbacks = [];

  setInterval(() => {
    for (let callback of callbacks) {
      callback();
    }
  }, delay);

  const add = (/** @type {() => void} */ callback) => {
    callbacks.push(callback);
  };

  return {
    add,
  };
}

/**
 * @template T
 * @param {{ load: () => Promise<T>, save: (value: T) => Promise<void>, delay: number }} options
 */
export function createLoader(options) {
  const { load, save, delay } = options;

  /** @type {Promise<T> | undefined} */
  let promise = undefined;

  const get = async () => {
    promise ||= load();
    return promise;
  };

  const set = (/** @type {T} */ value) => {
    promise = Promise.resolve(value);
    debouncer(value);
  };

  const debouncer = createDebouncer({
    callback: save,
    delay,
  });

  return { get, set, flush: debouncer.flush };
}

/**
 * @template T
 * @param {{ load: (key: string) => Promise<T>, ttl: number }} options
 */
export function createCache(options) {
  const { load } = options;
  const ttl = options.ttl * 1000;

  /** @type {Record<string, { expire: number, fetching: boolean,  promise: Promise<T> | undefined }>} */
  let cache = {};

  const get = async (/** @type {string} */ key = 'default') => {
    let cached = cache[key];

    if (!cached) {
      cached = cache[key] = {
        expire: 0,
        fetching: false,
        promise: undefined,
      };
    }

    if (!cached.promise || (!cached.fetching && cached.expire <= Date.now())) {
      cached.fetching = true;
      cached.promise = load(key)
        .then((value) => {
          cached.expire = Date.now() + ttl;
          return value;
        })
        .finally(() => {
          cached.fetching = false;
        });
    }

    return cached.promise;
  };

  const cleanup = () => {
    const now = Date.now();

    for (const key in cache) {
      const { expire, fetching } = cache[key];
      if (!fetching && expire <= now) {
        delete cache[key];
      }
    }
  };

  return {
    get,
    cleanup,
  };
}

/**
 * @template T
 * @param {{ start: (task: import("@cyann/subler").Task<T>) => Promise<void>, parallel: number, ttl: number }} options
 */
export function createTaskQueue(options) {
  const { start, parallel } = options;
  const ttl = options.ttl * 1000;
  let counter = 0;

  /** @type {Array<import("@cyann/subler").Task<T>>} */
  const tasks = [];

  const add = (/** @type {T} */ params) => {
    tasks.push({
      id: ++counter,
      status: 'pending',
      progress: 0,
      params,
    });

    resume();
  };

  const remove = (/** @type {number} */ id) => {
    const index = tasks.findIndex((task) => task.id === id);

    if (index >= 0) {
      const task = tasks[index];
      task.process?.kill();
      tasks.splice(index, 1);
    }
  };

  const cleanup = () => {
    const now = Date.now();

    for (let index = 0; index < tasks.length; ++index) {
      const task = tasks[index];
      if (task.expire && task.expire <= now) {
        tasks.splice(index, 1);
      }
    }
  };

  const resume = () => {
    let runningCount = tasks.filter((task) => task.status === 'running').length;

    for (let task of tasks) {
      if (task.status === 'pending' && runningCount < parallel) {
        task.status = 'running';
        ++runningCount;
        start(task).then(() => {
          task.expire = Date.now() + ttl;
          resume();
        });
      }
    }
  };

  return {
    add,
    remove,
    cleanup,
    tasks,
  };
}
