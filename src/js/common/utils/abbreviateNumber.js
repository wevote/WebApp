// abbreviateNumber.js

export default function abbreviateNumber (num) {
  // =< 1,000,000 - round to hundred-thousand (1.4M)
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  // 100,000 – 999,999 - round to nearest thousand (847K)
  if (num >= 100000) {
    return `${(num / 1000).toFixed(0).replace(/\.0$/, '')}K`;
  }
  // 10,000 – 99,999 - round to single decimal (45.8K)
  if (num >= 10000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  // < 10,000 - add comma for thousands (3,857)
  if (num < 10000) {
    const stringNum = num.toString();
    return stringNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return num;
}
