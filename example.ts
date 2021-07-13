import { Anyql } from './mod.ts'

const resolvers = {
    query: {
        jobs() {
            return [
                {
                    salary: 200,
                    title: "xlr8"
                }
            ]
        },
        async somethingEndsWithError() {
            return Promise.reject("Mee too.")
        }
    }
}

const samplePayload = {
    query: {
        jobs: [/**pass jobs resolver args here */],
        somethingEndsWithError: [],
        missingFunction: []
    }
}

const engine = new Anyql(resolvers)

engine.process(samplePayload).then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
})