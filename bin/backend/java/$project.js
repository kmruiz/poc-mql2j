module.exports = (requires, javaMethod) => (emit, { $project }) => {
    requires('com.mongodb.client.model.Aggregates', 'project')

    const projectionEntries = Object.entries($project)
    const mode = projectionEntries.reduce((prevValue, [key, value]) => {
        if (prevValue == 'error') return error;

        if (value == 1 && prevValue != 'include') {
            return 'error';
        }

        if (value == 1) {
            return 'include';
        }

        if (value == 0 && key == '_id' && prevValue == 'include') {
            return 'include';
        }

        return 'exclude';
    }, 'include')

    const mustExcludeId = projectionEntries.find((p => p[0] == '_id' && p[1] == 0)) && mode == 'include';

    if (mode == 'include') {
        if (!mustExcludeId) {
            requires('com.mongodb.client.model.Projections', 'include');
            return `${javaMethod('Projections', 'include')}(${projectionEntries.map(([key]) => emit(key)).join(', ')})`
        } else {
            requires('com.mongodb.client.model.Projections', 'fields')
            requires('org.bson.BsonInt32')

            return `${javaMethod('Projections', 'fields')}(${projectionEntries.map(([key, value]) => `new BsonField(${emit(key)}, new BsonInt32(${value}))`)})`
        }
    } else if (mode == 'exclude') {
        requires('com.mongodb.client.model.Projections', 'exclude');
        return `${javaMethod('Projections', 'exclude')}(${projectionEntries.map(([key]) => emit(key)).join(', ')})`
    } else {
        throw 'Invalid projection: ' + JSON.stringify($project) + '\n\tYou can not include and exclude at the same time fields using a projection.'
    }
}