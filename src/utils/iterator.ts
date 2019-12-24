interface BaseObject<T> {
  [key: string]: T;
}

export function objectMap<T extends BaseObject<T[P]>, P extends keyof T>(
  obj: T,
  cb: (val: T[P], key: P, obj: T) => T[P]
): T {
  const dup = { ...obj };

  for (const key of Object.keys(dup)) {
    dup[key as P] = cb(dup[key], key as P, dup);
  }

  return dup;
}

export function objectFilter<T extends BaseObject<T[P]>, P extends keyof T>(
  obj: T,
  cb: (val: T[P], key: P, obj: T) => boolean
): T {
  const dup = { ...obj };
  const result: T = {} as T;

  for (const key of Object.keys(dup)) {
    if (cb(dup[key], key as P, dup)) {
      result[key as P] = dup[key];
    }
  }

  return result;
}

export function omit<T extends object, P extends keyof T>(obj: T, prop: P): T {
  return Object.keys(obj).reduce(
    (total, key) => (key !== prop && (total[key] = obj[key]) && total) || total,
    {}
  ) as T;
}

export function findKey<T extends object, P extends keyof T>(
  obj: T,
  cb: (item: T[P]) => boolean
): P {
  for (const key of Object.keys(obj)) {
    if (cb(obj[key])) {
      return key as P;
    }
  }
}
