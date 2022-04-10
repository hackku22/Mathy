/** Type alias for something that may or may not be wrapped in a promise. */
export type Awaitable<T> = T | Promise<T>

/** Type alias for something that may be undefined. */
export type Maybe<T> = T | undefined

export type MaybeArr<T extends [...any[]]> = {
    [Index in keyof T]: Maybe<T[Index]>
} & {length: T['length']}

export type Either<T1, T2> = Left<T1> | Right<T2>

export type Left<T> = [T, undefined]

export type Right<T> = [undefined, T]

export function isLeft<T1, T2>(what: Either<T1, T2>): what is Left<T1> {
    return typeof what[1] === 'undefined'
}

export function isRight<T1, T2>(what: Either<T1, T2>): what is Right<T2> {
    return typeof what[0] === 'undefined'
}

export function left<T>(what: T): Left<T> {
    return [what, undefined]
}

export function right<T>(what: T): Right<T> {
    return [undefined, what]
}

export function unleft<T>(what: Left<T>): T {
    return what[0]
}

export function unright<T>(what: Right<T>): T {
    return what[1]
}

/** Type alias for a callback that accepts a typed argument. */
export type ParameterizedCallback<T> = ((arg: T) => any)

/** A key-value form of a given type. */
export type KeyValue<T> = {key: string, value: T}

/** Simple helper method to verify that a key is a keyof some object. */
export function isKeyof<T>(key: unknown, obj: T): key is keyof T {
    if ( typeof key !== 'string' && typeof key !== 'symbol' ) {
        return false
    }

    return key in obj
}

/** A typescript-compatible version of Object.hasOwnProperty. */
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {  // eslint-disable-line @typescript-eslint/ban-types
    return Object.hasOwnProperty.call(obj, prop)
}

/**
 * TypeScript helper for creating tagged-types.
 */
export interface TypeTag<S extends string> {
    readonly __typeTag: S
}

export type PrefixTypeArray<T, TArr extends unknown[]> = [T, ...TArr]
export type SuffixTypeArray<TArr extends unknown[], T> = [...TArr, T]
export type TypeArraySignature<TArr extends unknown[], TReturn> = (...params: TArr) => TReturn

export type MethodsOf<T, TMethod = (...args: any[]) => any> = {
    [K in keyof T]: T[K] extends TMethod ? K : never
}[keyof T]

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

export type Integer = TypeTag<'@app.Integer'> & number

export function isInteger(num: number): num is Integer {
    return !isNaN(num) && parseInt(String(num), 10) === num
}

export type LaTeXString = TypeTag<'@app.LaTeXString'> & string
export type HTMLString = TypeTag<'@app.HTMLString'> & string
export type StatementID = TypeTag<'@app.StatementID'> & string
export type VariableName = TypeTag<'@app.VariableName'> & string
export type EvaluatedValue = TypeTag<'@app.EvaluatedValue'> & string

export interface EvaluationResult {
    variables: Record<VariableName, any>
    statements: Record<StatementID, any>
}


export class RichTextBox {
    static deserialize(vals: [string, number, number]) {
        return new this(...vals)
    }

    constructor(
        public text: string = '',
        public x: number = 0,
        public y: number = 0,
    ) {}

    serialize(): [string, number, number] {
        return [
            this.text,
            this.x,
            this.y,
        ]
    }
}


export class ImageContainer {
    static deserialize(vals: [string, number, number]) {
        return new this(...vals)
    }

    constructor(
        public url: string = '',
        public x: number = 0,
        public y: number = 0,
    ) {}

    serialize(): [string, number, number] {
        return [
            this.url,
            this.x,
            this.y,
        ]
    }
}


export class ChartBox {
    static deserialize(vals: [string, number, number, number, number, number]) {
        return new this(...vals)
    }

    // eslint-disable-next-line max-params
    constructor(
        public fnName: string,
        public minX: number,
        public maxX: number,
        public stepX: number = 1,
        public x: number = 0,
        public y: number = 0,
    ) {}

    serialize(): [string, number, number, number, number, number] {
        return [
            this.fnName,
            this.minX,
            this.maxX,
            this.stepX,
            this.x,
            this.y,
        ]
    }
}


