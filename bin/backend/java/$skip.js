module.exports = (requires, javaMethod) => (emit, { $skip }) => {
    requires('com.mongodb.client.model.Aggregates', 'skip')

    return `${javaMethod('Aggregates', 'skip')}(${emit($skip)})`;
}