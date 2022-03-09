module.exports = (requires, javaMethod) => (emit, predicates) => {
    requires('com.mongodb.client.model.Filters', 'eq')

    const entries = Object.entries(predicates);
    if (entries.length > 1) {
        requires('com.mongodb.client.model.Filters', 'and');
        return `${javaMethod('Filters', 'and')}(${entries.map(([key, value]) => ({ [key]: emit(value) })).join(', ')})`
    }

    const [ [ key, value ] ] = entries
    return `${javaMethod('Filters', 'eq')}("${key}", ${emit(value)})`
}