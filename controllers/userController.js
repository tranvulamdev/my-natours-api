const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const filterObj = (obj, ...allowedFields) =>
    Object.fromEntries(
        Object.entries(obj).filter(([key]) => allowedFields.includes(key))
    )

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users },
    })
})

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm)
        throw new AppError(
            'This route is not for password updates. Please use /update-my-password',
            400
        )
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email')

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        filteredBody,
        { new: true, runValidators: true }
    )

    res.status(200).json({
        status: 'success',
        data: { updatedUser },
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null,
    })
})

exports.getUser = catchAsync(async (req, res, next) => {
    // const users = await User.findById(req.params.id)

    // res.status(200).json({
    //     status: 'success',
    //     data: { users },
    // })
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    })
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    })
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    })
}
