export default function Price({ price, locale, currency }) {
  const cur = typeof currency === 'string' ? currency : 'EGP';

  const formatPrice = () =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: cur,
    }).format(price);

  return <span>{formatPrice()}</span>;
}

Price.defaultProps = {
 locale: 'en-US',
  currency: 'EGP',
};
