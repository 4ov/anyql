import { Resolvers, Payload } from './types.ts'

export default class anyQl {
    resolvers: Resolvers
    constructor(resolvers: Resolvers) {
        this.resolvers = resolvers
    }


    private forQuery(query: { [k: string]: any[] }): Promise<{ result: any, errors: any }> {
        return new Promise(async (res, rej) => {
            const resolvers = this.resolvers.query || {}
            let keys = Object.keys(query)
            let missing: string[] = []
            let isValid = keys.every(key => {
                if (key in resolvers) {
                    return true
                } else {
                    missing.push(key)
                }
            })
            let result: { [k: string]: any } = {}
            let errors: any[] = []

            if (isValid) {
                await Promise.all(keys.map(async key => {
                    try {
                        result[key] = await resolvers[key](...query[key])
                    } catch (err) {
                        result[key] = null
                        errors.push({
                            from: key,
                            reason: err
                        })
                    }
                }))
                res({ result, errors })
            } else {
                rej({
                    ok: false,
                    errors: [`[${missing.join(', ')}] missing from resolvers`]
                })
            }
        })

    }

    async process(payload: Payload) {
        if (payload.query) {
            let { result: queryResult, errors: queryErrors } = await this.forQuery(payload.query)

            return await {
                ok: true,
                result: { ...queryResult },
                errors: [...queryErrors]
            }
        }
    }

}
