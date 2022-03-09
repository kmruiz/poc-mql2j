module.exports = (requires, javaMethod) => (emit, { $addFields }) => {
    requires('com.mongodb.client.model.Aggregates', 'addFields')
    requires('com.mongodb.client.model.Field')

    const allFieldEntries = Object.entries($addFields)
    const mappedFields = allFieldEntries.map(([key, value]) => `new Field(${emit(key)}, ${emit(value)})`)
    return `${javaMethod('Aggregates', 'addFields')}(${mappedFields.join(', ')})`
}