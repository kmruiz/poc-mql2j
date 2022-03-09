module.exports = (requires, javaMethod) => (emit, value) => {
    if (Array.isArray(value)) {
        requires('java.util.Arrays', 'asList')
        return `${javaMethod('Arrays', 'asList')}(${value.map(emit).join(', ')})`
    }

    if (typeof value == 'string') {
        return `"${value}"`
    }

    return value;
}