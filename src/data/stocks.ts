export interface Stock {
  name: string
  code: string
  price: number
  change: number
}

export const MOCK_STOCKS: Stock[] = [
  { name: '삼성전자', code: '005930', price: 73400, change: 1.2 },
  { name: 'SK하이닉스', code: '000660', price: 189000, change: 3.4 },
  { name: 'NAVER', code: '035420', price: 212500, change: -0.8 },
  { name: 'LG화학', code: '051910', price: 428000, change: 0.5 },
  { name: '삼성SDI', code: '006400', price: 397000, change: -1.2 },
  { name: '카카오', code: '035720', price: 51300, change: 2.1 },
  { name: '삼성바이오로직스', code: '207940', price: 892000, change: 0.9 },
  { name: 'LG에너지솔루션', code: '373220', price: 410000, change: 0.3 },
  { name: '현대차', code: '005380', price: 235000, change: -0.4 },
  { name: '기아', code: '000270', price: 98700, change: 1.8 },
  { name: 'POSCO홀딩스', code: '005490', price: 412000, change: 2.5 },
  { name: 'KB금융', code: '105560', price: 78900, change: 0.6 },
  { name: '신한지주', code: '055550', price: 52300, change: -0.3 },
  { name: '삼성물산', code: '028260', price: 145000, change: 0.2 },
  { name: 'HD현대중공업', code: '329180', price: 215000, change: 4.1 },
  { name: '한화에어로스페이스', code: '012450', price: 389000, change: 3.3 },
  { name: '두산에너빌리티', code: '034020', price: 22400, change: 1.5 },
  { name: '알테오젠', code: '196170', price: 412000, change: -2.1 },
  { name: '크래프톤', code: '259960', price: 289000, change: 0.8 },
  { name: 'HLB', code: '028300', price: 89000, change: -3.2 },
  { name: '에코프로', code: '086520', price: 112000, change: 5.4 },
  { name: '에코프로비엠', code: '247540', price: 198000, change: 4.9 },
  { name: '한미반도체', code: '042700', price: 156000, change: 2.7 },
  { name: '셀트리온', code: '068270', price: 178000, change: -0.5 },
]
