import product1 from './product-1.png';
import product2 from './product-2.png';
import product3 from './product-3.png';
import product4 from './product-4.png';
import product5 from './product-5.png';

export const productImages = [
  { src: product1, alt: 'Product 1' },
  { src: product2, alt: 'Product 2' },
  { src: product3, alt: 'Product 3' },
  { src: product4, alt: 'Product 4' },
  { src: product5, alt: 'Product 5' },
] as const;

export {
  product1,
  product2,
  product3,
  product4,
  product5,
};
