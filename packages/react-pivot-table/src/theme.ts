interface ThemeConfig {
  root?: {
    display?: boolean,
    label?: string
  },
  summary?: {
    label?: string
  },
  table?: {
    highlightBGColor?: string;
    thead?: {
      backgroundColor?: string;
      color?: string;
    }
    borderColor?: string;
    color?: string;
  }
}

const THEME_CONFIG: ThemeConfig = {
  root: {
    display: true,
    label: 'All'
  },
  summary: {
    label: '(total)'
  },
  table: {
    highlightBGColor: '#fff0f6',
    thead: {
      backgroundColor: '#E9EDF2',
      color: '#5A6C84'
    },
    borderColor: '#DFE3E8',
    color: '#333333'
  }
};

function deepMerge<T>(origin: T, changes: T): T {
  for (let key in changes) {
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

function getInitTheme (): ThemeConfig {
  return {
    root: {
      display: true,
      label: 'All'
    },
    summary: {
      label: '(total)'
    },
    table: {
      highlightBGColor: '#fff0f6',
      thead: {
        backgroundColor: '#E9EDF2',
        color: '#5A6C84'
      },
      borderColor: '#DFE3E8',
      color: '#333333'
    }
  };
}

export function registerTheme(config?: ThemeConfig) {
  let initTheme = getInitTheme();
  if (typeof config === 'undefined') return initTheme;
  let mergedConfig = deepMerge(initTheme, config);
  for (let key in config) {
    if (THEME_CONFIG[key as keyof ThemeConfig]) {
      THEME_CONFIG[key as keyof ThemeConfig] = deepMerge(THEME_CONFIG[key as keyof ThemeConfig], mergedConfig[key as keyof ThemeConfig]);
    }
  }
}

export function getTheme() {
  return THEME_CONFIG;
}