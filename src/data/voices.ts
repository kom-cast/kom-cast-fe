export interface Voice {
  id: string
  name: string
  description: string
}

export const VOICES: Voice[] = [
  { id: 'junhyuk', name: '이준혁', description: '차분하고 신뢰감 있는' },
  { id: 'sunghoon', name: '박성훈', description: '활기차고 또렷한 아나운서형' },
  { id: 'jieun', name: '김지은', description: '따뜻하고 친근한' },
  { id: 'suyeon', name: '최수연', description: '전문적이고 명료한 앵커형' },
]
