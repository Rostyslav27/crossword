
export interface ILevel {
  id: number
  words: IWord[]
  name: string  
}

export interface IUserAnswers {
  answers: {[key:string]: string}
  completed: number
}

export interface IWord {
  word: string
  xStart: number
  yStart: number
  vertical: boolean
  question: string
  clue?: string
  index: string
}