


export interface Resolvers{
    query? : { [k : string] : Function }
}


export interface Payload{
    query? : { [k: string]: any[] } 
}