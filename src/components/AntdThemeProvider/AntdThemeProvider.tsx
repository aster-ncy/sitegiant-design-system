import type { ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

export interface AntdThemeProviderProps {
  children: ReactNode;
}

/**
 * AntdThemeProvider — wraps Ant Design's ConfigProvider with SiteGiant
 * design tokens so antd-driven components (DatePicker, DateRangePicker,
 * DateTimePicker) match the rest of the SiteGiant UI.
 *
 * Token mapping rationale:
 * - colorPrimary = --color-sys-blue-DEFAULT (#007CE0) — antd uses this for
 *   the focused-field ring + selected-day chip on the calendar (matches the
 *   AntD screenshots Aster shared).
 * - colorBorder = --form-input-default-border (#D4D4D4)
 * - colorBgContainer = --form-input-default-fill (white)
 * - borderRadius = --radius-4 (4px)
 * - fontFamily = --general-font-family (Roboto)
 *
 * Wrap any tree that needs themed antd components in this provider. The
 * design-system Storybook applies it globally via .storybook/preview.tsx;
 * consumer apps using <DatePicker> etc. should wrap their root with it.
 */
export const AntdThemeProvider = ({ children }: AntdThemeProviderProps) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#007CE0',
          colorInfo: '#007CE0',
          colorBorder: '#D4D4D4',
          colorBgContainer: '#FFFFFF',
          colorText: '#0C2028',
          colorTextPlaceholder: '#90999D',
          colorTextDisabled: '#90999D',
          colorError: '#E0241A',
          colorSuccess: '#5ACC5A',
          colorWarning: '#FF7F00',
          borderRadius: 4,
          borderRadiusSM: 4,
          borderRadiusLG: 4,
          fontFamily: 'Roboto, sans-serif',
          fontSize: 14,
          controlHeight: 33,
        },
        components: {
          DatePicker: {
            // The popup calendar
            cellHoverBg: '#F3FFF3',
            cellActiveWithRangeBg: '#D0F4FF',
            cellRangeBorderColor: '#007CE0',
            cellHoverWithRangeBg: '#D0F4FF',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
