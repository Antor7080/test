exports.filterOption = (options) => {
    let filters = { ...options.query };
    const excludeFields = ['sort', 'page', 'limit', 'fields']
    excludeFields.forEach(field => delete filters[field])
    //gt ,lt ,gte .lte
    console.log(options.query);
    let filtersString = JSON.stringify(filters)
    filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

    filters = JSON.parse(filtersString)
    const queries = {}

    if (options.query.sort) {
        // price,qunatity   -> 'price quantity'
        console.log(options.query.sort);
        const sortBy = options.query.sort.split(',').join(' ')
        queries.sortBy = sortBy
    }

    if (options.query.fields) {
        const fields = options.query.fields.split(',').join(' ')
        queries.fields = fields
    }

    if (options.query.page) {

        const { page = 1, limit = 10 } = options.query;
        console.log(page, limit)
        const skip = (page - 1) * parseInt(limit);
        queries.skip = skip;
        queries.limit = parseInt(limit);

    }
    return { queries, filters }

};