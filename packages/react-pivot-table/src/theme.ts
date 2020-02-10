interface ThemeConfig {
  root?: {
    display?: boolean,
    label?: string
  },
  summary?: {
    label?: string
  }
}
const THEME_CONFIG: ThemeConfig = {
  root: {
    display: true,
    label: 'All'
  },
  summary: {
    label: '(total)'
  }
};

function deepMerge<T>(origin: T, changes: T): T {
  for (let key in origin) {
    // todo: array
    if (origin[key] instanceof Function) {
      origin[key] = changes[key]
    } else if (origin[key] instanceof Object) {
      origin[key] = deepMerge(origin[key], changes[key])
    } else {
      origin[key] = changes[key]
    }
  }
  return origin;
}

export function registerTheme(config: ThemeConfig) {
  for (let key in config) {
    if (THEME_CONFIG[key as keyof ThemeConfig]) {
      THEME_CONFIG[key as keyof ThemeConfig] = deepMerge(THEME_CONFIG[key as keyof ThemeConfig], config[key as keyof ThemeConfig]);
    }
  }
}

export function getTheme() {
  return THEME_CONFIG;
}