const $addFields = require('./$addFields')
const $bucket = require('./$bucket')
const $atom = require('./$atom')
const $limit = require('./$limit')
const $lookup = require('./$lookup')
const $match = require('./$match')
const $project = require('./$project')
const $skip = require('./$skip')
const $eqFilter = require('./$eqFilter')

module.exports = (mql, { verbosity, wildcardImport, printImports }) => {
    const useQualifiedMethodNames = verbosity != 'static import'
    const useWildcardImport = wildcardImport == 'true'
    const usePrintImports = printImports == 'true'
    
    const requires = []
    const javaMethod = (className, method) => useQualifiedMethodNames ? `${className}.${method}` : method

    const body = boundEmit((fqnClass, method) => requires.push({ fqnClass, method }), javaMethod, mql)
    const imports = [...new Set(requires.map(({fqnClass, method}) => {
        if (method) {
            if (useWildcardImport) {
                return `import static ${fqnClass}.*;`;
            } else {
                return `import static ${fqnClass}.${method};`;
            }
        } else {
            return `import ${fqnClass};`;
        }
    }))].sort().join('\n')

    if (usePrintImports) {
        return `/** imports **/\n${imports}\n\n/** query **/\n${body};`
    }

    return body
};

function boundEmit(requires, javaMethod, token) {
    if (!token) {
        return ''
    }

    const emit = boundEmit.bind(null, requires, javaMethod)

    if (token.$addFields) {
        return $addFields(requires, javaMethod)(emit, token)
    }

    if (token.$bucket) {
        return $bucket(requires, javaMethod)(emit, token)
    }

    if (token.$limit) {
        return $limit(requires, javaMethod)(emit, token)
    }

    if (token.$lookup) {
        return $lookup(requires, javaMethod)(emit, token)
    }

    if (token.$match) {
        return $match(requires, javaMethod)(emit, token)
    }

    if (token.$project) {
        return $project(requires, javaMethod)(emit, token)
    }

    if (token.$skip) {
        return $skip(requires, javaMethod)(emit, token)
    }

    if (typeof token == 'object' && !Array.isArray(token)) { 
        return $eqFilter(requires, javaMethod)(emit, token)
    }

    return $atom(requires, javaMethod)(emit, token)
}
