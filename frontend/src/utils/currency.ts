export const getSystemCurrency = () => {
  try {
    const raw = localStorage.getItem('systemCurrency');
    if (!raw) return { code: 'LKR', locale: 'en-LK' };
    const parsed = JSON.parse(raw);
    return {
      code: parsed?.code || 'LKR',
      locale: parsed?.locale || 'en-LK',
    };
  } catch {
    return { code: 'LKR', locale: 'en-LK' };
  }
};

export const formatCurrency = (amount: number) => {
  const { code, locale } = getSystemCurrency();
  return Number(amount || 0).toLocaleString(locale, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 2,
  });
};
