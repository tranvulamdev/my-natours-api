class APIFeatures {
    constructor(query, { page, limit, fields, sort, ...queryObj }) {
        this.query = query
        this.page = page
        this.limit = limit
        this.fields = fields
        this.sort = sort
        this.queryObj = queryObj
    }

    // Update note: By default, Mongoose does not cast filter
    // properties that aren't in your schema. (1A Filtering)
    // khỏi cần remove mấy field ko có trong Model or dùng destructoring
    filter() {
        // 1A) Filtering
        // const queryObj = { ...this.queryString }
        // const excludedFields = ['page', 'sort', 'limit', 'fields']
        // excludedFields.forEach(el => delete queryObj[el])

        // 1B) Advance filtering
        const regex = /\b(gte|gt|lte|lt)\b/g
        let queryStr = JSON.stringify(this.queryObj)
        queryStr = queryStr.replace(regex, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    sortFields() {
        if (this.sort) {
            const sortBy = this.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else this.query = this.query.sort('-createdAt')

        return this
    }

    limitFields() {
        if (this.fields) {
            const _fields = this.fields.split(',').join(' ')
            this.query = this.query.select(_fields)
        } else this.query = this.query.select('-__v')

        return this
    }

    pagination() {
        const _page = +this.page || 1
        const _limit = +this.limit || 100
        const skip = (_page - 1) * _limit
        this.query = this.query.skip(skip).limit(_limit)

        return this
    }
}

module.exports = APIFeatures
