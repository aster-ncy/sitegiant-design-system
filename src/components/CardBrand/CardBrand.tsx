export type CardBrandName = 'visa' | 'mastercard';

export interface CardBrandProps {
  /** Which card-issuer brand logo to render. */
  name: CardBrandName;
  /**
   * Pixel height of the rendered logo. The width is derived from the
   * canonical 92×36 brand-frame aspect ratio (≈ 2.556:1) so all card
   * brands render at the same external size.
   *
   * Default: 36px (matches Figma's library size 3039:89 / 3039:91).
   * Use 13px when placing inside the CardNumberInput's small badge —
   * width works out to ~33px which matches the Figma badge spec.
   */
  height?: number;
  /**
   * Accessible label. Defaults to a sensible brand name; pass an empty
   * string when the surrounding text already names the brand.
   */
  label?: string;
  className?: string;
}

const defaultLabels: Record<CardBrandName, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
};

// Figma renders every card brand inside a canonical 92×36 transparent
// frame; the actual artwork sits inset within. We honour that frame so
// every brand renders at the same outer width/height for a given height.
const FRAME_W = 92;
const FRAME_H = 36;

// Visa: artwork is 76×24, centred inside the 92×36 frame.
//   horizontal inset = (92 - 76) / 2 = 8
//   vertical inset   = (36 - 24) / 2 = 6
const VISA_X = 8;
const VISA_Y = 6;

// Mastercard: artwork is 47×29.1268, centred inside the 92×36 frame.
//   horizontal inset = (92 - 47) / 2 = 22.5
//   vertical inset   = (36 - 29.1268) / 2 ≈ 3.4366
const MC_X = (FRAME_W - 47) / 2;
const MC_Y = (FRAME_H - 29.1268) / 2;

/**
 * CardBrand — Figma: Core / Card brand logos (3039:89, 3039:91).
 *
 * Inline brand-color logos for credit-card issuers. Unlike the monochrome
 * Icon library these can't use `currentColor` — Mastercard's overlapping
 * red/orange/yellow disks and Visa's exact #1434CB blue are part of the
 * brand identity and must render in their exact colors.
 *
 *   <CardBrand name="visa" height={13} />
 *
 * Composes naturally inside CardNumberInput's leading badge:
 *
 *   <CardNumberInput brand={<CardBrand name="visa" height={13} />} ... />
 *
 * All brands render in the same canonical 92×36 outer frame ratio so a
 * Mastercard logo and a Visa logo at the same `height` align at the same
 * external dimensions — the artwork inside is centred per brand.
 */
export const CardBrand = ({
  name,
  height = 36,
  label,
  className = '',
}: CardBrandProps) => {
  const accessibleLabel = label ?? defaultLabels[name];
  const ariaProps = accessibleLabel
    ? { role: 'img' as const, 'aria-label': accessibleLabel }
    : { 'aria-hidden': true as const };
  const width = (height * FRAME_W) / FRAME_H;

  return (
    <svg
      {...ariaProps}
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {name === 'visa' ? (
        <g transform={`translate(${VISA_X} ${VISA_Y})`}>
          <path
            d="M28.8555 0.424203L18.9054 23.6369H12.4137L7.51727 5.11211C7.22 3.9711 6.96152 3.55309 6.05744 3.07238C4.58217 2.28938 2.14462 1.55515 0 1.09921L0.145667 0.424203H10.5953C11.9273 0.424203 13.1246 1.29119 13.4271 2.79099L16.013 16.2231L22.4042 0.424203H28.8555ZM54.2913 16.0582C54.3174 9.93162 45.6273 9.59412 45.6871 6.85731C45.7057 6.02438 46.5167 5.13882 48.2921 4.91279C49.172 4.80015 51.5965 4.71423 54.3463 5.95162L55.425 1.02916C53.9473 0.504709 52.0461 0 49.6806 0C43.6105 0 39.3387 3.15521 39.3027 7.6732C39.2635 11.015 42.3518 12.8798 44.6785 13.9902C47.0721 15.1273 47.8752 15.8581 47.8661 16.8752C47.8491 18.4323 45.957 19.1197 44.1889 19.1468C41.1021 19.1933 39.311 18.3302 37.8832 17.6811L36.7701 22.7665C38.205 23.4101 40.8536 23.9717 43.5995 24C50.0511 24 54.2715 20.8839 54.2913 16.0582ZM70.3202 23.6373H76L71.0422 0.424203H65.7998C64.621 0.424203 63.6266 1.09534 63.1865 2.12721L53.9711 23.6369H60.4196L61.7001 20.1694H69.5792L70.3206 23.6369L70.3202 23.6373ZM63.4679 15.4122L66.7003 6.69668L68.5607 15.4122H63.4683H63.4679ZM37.6303 0.424203L32.5521 23.6369H26.4112L31.4913 0.424203H37.6303Z"
            fill="#1434CB"
          />
        </g>
      ) : (
        <g transform={`translate(${MC_X} ${MC_Y})`}>
          <path
            d="M17.9536 14.5634C17.9536 9.91758 20.1236 5.77933 23.5017 3.11299C21.0314 1.16399 17.9131 0 14.5249 0C6.50312 0 0 6.52036 0 14.5634C0 22.6064 6.50312 29.1268 14.5249 29.1268C17.9131 29.1268 21.0314 27.9628 23.5017 26.0138C20.1236 23.3474 17.9536 19.2092 17.9536 14.5634Z"
            fill="#E52423"
          />
          <path
            d="M45.613 23.5877V23.1173H45.802V23.0226H45.3228V23.1173H45.5117V23.5877H45.613ZM46.5478 23.5877V23.0226H46.3993L46.2306 23.4117L46.0618 23.0226H45.9133V23.5877H46.0179V23.1613L46.1766 23.5301H46.2846L46.4432 23.1613V23.5877H46.5478Z"
            fill="#F99F1C"
          />
          <path
            d="M32.4751 0C29.0869 0 25.9686 1.16399 23.4983 3.11299C26.8764 5.77933 29.0464 9.91758 29.0464 14.5634C29.0464 19.2092 26.8764 23.3474 23.4983 26.0138C25.9686 27.9628 29.0869 29.1268 32.4751 29.1268C40.4969 29.1268 47 22.6064 47 14.5634C47 6.52036 40.4969 0 32.4751 0Z"
            fill="#F99F1C"
          />
          <path
            d="M23.5017 3.11299C20.1236 5.77933 17.9536 9.91758 17.9536 14.5634C17.9536 19.2092 20.1236 23.3474 23.5017 26.0138C26.8798 23.3474 29.0498 19.2092 29.0498 14.5634C29.0498 9.91758 26.8798 5.77933 23.5017 3.11299Z"
            fill="#F26522"
          />
        </g>
      )}
    </svg>
  );
};
