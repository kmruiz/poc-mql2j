module.exports = (requires, javaMethod) => (emit, { $bucket }) => {
    requires('com.mongodb.client.model.Aggregates', 'bucket')
    requires('java.util.Arrays', 'asList')

    const groupByExpr = $bucket.groupBy
    const boundaries = $bucket.boundaries.map(boundary => emit(boundary))
    const defaultIfAny = $bucket.default
    const output = $bucket.output

    if (output || defaultIfAny) {
        requires('com.mongodb.client.model.BucketOptions')
        requires('com.mongodb.client.model.Field')

        const outputEntries = Object.entries(output)
        let bucketOptions = 'new BucketOptions()'
        if (output) {
            bucketOptions += `.output(${outputEntries.map(([key, value]) => `new Field(${emit(key)}, ${emit(value)})`).join(', ')})`
        }

        if (defaultIfAny) {
            bucketOptions += `.defaultBucket(${emit(defaultIfAny)})`
        }

        return `${javaMethod('Aggregates', 'bucket')}(${emit(groupByExpr)}, ${javaMethod('Arrays', 'asList')}(${boundaries.map(emit).join(', ')}), ${bucketOptions})`
    }

    return `${javaMethod('Aggregates', 'bucket')}(${emit(groupByExpr)}, ${javaMethod('Arrays', 'asList')}(${boundaries.map(emit).join(', ')}))`
}