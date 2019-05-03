const newLinkSubscription = (parent, args, context, info) => {
    return context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node()
}

const newLink = {
    subscribe: newLinkSubscription,
    resolve: (payload) => {
        return payload
    }
}

const newVoteSubscription = (parent, args, context, info) => {
    return context.prisma.$subscribe.vote({ mutation_id: ['CREATED'] }).node()
}

const newVote = {
    subscribe: newVoteSubscription,
    resolve: (payload) => {
        return payload
    }
}

module.exports = {
    newLink,
    newVote
}