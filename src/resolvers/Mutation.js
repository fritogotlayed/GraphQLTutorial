const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const signup = async (parent, args, context, info) => {
    const password = await bcrypt.hash(args.password, 18)
    const user = await context.prisma.createUser({ ...args, password })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user
    }
}

const login = async (parent, args, context, info) => {
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid Password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return {
        token,
        user
    }
}

const post = async (parent, args, context, info) => {
    const userId = getUserId(context)
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } }
    })
}

const vote = async (parent, args, context, info) => {
    let userId = getUserId(context)

    let linkExists = await context.prisma.$exists.vote({
        user: { id: userId },
        link: { id: args.linkId }
    })

    if (linkExists) {
        throw new Error(`Already voted for link${args.linkId}`)
    }

    return context.prisma.createVote({
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } }
    })
}

module.exports = {
    signup,
    login,
    post,
    vote
}