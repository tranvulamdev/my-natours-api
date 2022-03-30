const fs = require('fs')

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

exports.checkID = (req, res, next, val) => {
    if (+val > tours.length)
        return res
            .status(404)
            .json({ status: 'failure', message: 'Invalid ID' })
    next()
}

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price)
        return res
            .status(400)
            .json({ status: 'failure', message: 'Missing name or price' })
    next()
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    })
}

exports.getTour = (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)

    res.status(200).json({
        status: 'success',
        data: { tour },
    })
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign(req.body, { id: newId })

    tours.push(newTour)

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        () => {
            res.status(201).json({
                status: 'success',
                data: { tour: newTour },
            })
        }
    )
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Update tour here...>',
        },
    })
}

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    })
}
