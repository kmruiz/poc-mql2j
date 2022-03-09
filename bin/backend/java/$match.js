module.exports = (requires, javaMethod) => (emit, { $match }) => {
    requires('com.mongodb.client.model.Aggregates', 'match')

    return `${javaMethod('Aggregates', 'match')}(${emit($match)})`;
}