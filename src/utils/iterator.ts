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

  return dup;
}
