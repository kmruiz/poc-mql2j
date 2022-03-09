module.exports = (requires, javaMethod) => (emit, { $limit }) => {
    requires('com.mongodb.client.model.Aggregates', 'limit')

    return `${javaMethod('Aggregates', 'limit')}(${emit($limit)})`;
}