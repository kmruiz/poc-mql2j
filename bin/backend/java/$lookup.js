module.exports = (requires, javaMethod) => (emit, { $lookup }) => {
    requires('com.mongodb.client.model.Aggregates', 'lookup')

    const isConcise = $lookup.pipeline != null;

    const from = emit($lookup.from);
    const as = emit($lookup.as);

    if (isConcise) {
        const pipeline = emit($lookup.pipeline)
        const hasLet = $lookup.let != null;
        if (hasLet) {
            requires('com.mongodb.client.model.Variable')
            requires('java.util.Arrays', 'asList')

            const letVars = `${javaMethod('Arrays', 'asList')}(${Object.entries($lookup.let).map(([ key, value ]) => `new Variable(${emit(key)}, ${emit(value)})`).join(', ')})`
            return `${javaMethod('Aggregates', 'lookup')}(${from}, ${letVars}, ${pipeline}, ${as})}`
        } else {
            return `${javaMethod('Aggregates', 'lookup')}(${from}, ${pipeline}, ${as})}`
        }
    } else {
        const localField = emit($lookup.localField);
        const foreignField = emit($lookup.foreignField);

        return `${javaMethod('Aggregates', 'lookup')}(${from}, ${localField}, ${foreignField}, ${as})}`

    }
}