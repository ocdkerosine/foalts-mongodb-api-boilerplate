export class MyService {
  log: (message: string) => string = message => {
    const d = new Date() as unknown as string
    // const e = message * 8
    return `${d} - ${message}`
  }

  fst: (a: string, b: number) => string = (a, k) => a
}
