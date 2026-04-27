import { useMemo, type ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

export interface AntdThemeProviderProps {
  children: ReactNode;
}

/**
 * AntdThemeProvider — wraps Ant Design's ConfigProvider with SiteGiant
 * design tokens so antd-driven components (DatePicker, DateRangePicker,
 * DateTimePicker) match the rest of the SiteGiant UI.
 *
 * Antd's ConfigProvider takes literal hex/px values, not CSS var()
 * references — it inlines them into generated styles. To stay token-
 * driven, we resolve CSS variables from :root at render time. The hex
 * fallback covers SSR (window undefined) and the brief first-paint
 * window before stylesheets attach.
 *
 * If a token's value changes in src/index.css, antd picks it up on the
 * next mount of this provider. No manual hex sync needed.
 */

const cssVar = (name: string, fallback: string): string => {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
};

export const AntdThemeProvider = ({ children }: AntdThemeProviderProps) => {
  const themeConfig = useMemo(() => ({
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: cssVar('--color-sys-blue-DEFAULT', '#007CE0'),
      colorInfo: cssVar('--color-sys-blue-DEFAULT', '#007CE0'),
      colorBorder: cssVar('--form-input-default-border', '#D4D4D4'),
      colorBgContainer: cssVar('--form-input-default-fill', '#FFFFFF'),
      colorText: cssVar('--color-surface-default', '#0C2028'),
      colorTextPlaceholder: cssVar('--form-input-placeholder-text', '#90999D'),
      colorTextDisabled: cssVar('--form-input-placeholder-text', '#90999D'),
      colorError: cssVar('--color-sys-red-DEFAULT', '#E0241A'),
      colorSuccess: cssVar('--color-sys-green-DEFAULT', '#5ACC5A'),
      colorWarning: cssVar('--color-sys-orange-DEFAULT', '#FF7F00'),
      borderRadius: 4,
      borderRadiusSM: 2,
      borderRadiusLG: 2,
      fontFamily: 'Roboto, sans-serif',
      fontSize: 14,
      controlHeight: 33,
    },
    components: {
      DatePicker: {
        cellHoverBg: cssVar('--color-sys-green-lighter', '#F3FFF3'),
        cellBgInRange: cssVar('--color-sys-blue-lighter', '#D0F4FF'),
        cellActiveWithRangeBg: cssVar('--color-sys-blue-lighter', '#D0F4FF'),
        cellRangeBorderColor: cssVar('--color-sys-blue-DEFAULT', '#007CE0'),
        cellHoverWithRangeBg: cssVar('--color-sys-blue-lighter', '#D0F4FF'),
      },
    },
  }), []);

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};
