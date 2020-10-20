const axios = require('axios');
const {
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} = require('graphql');

const PORT = process.env.PORT || 4000;
const PORT_DATA = process.env.PORT_DATA || 3000;

const data = require('./data.json');

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:${PORT_DATA}/customers/${args.id}`)
                    .then(res => res.data);
            }
        },
        customers : {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:${PORT_DATA}/customers`)
                    .then(res => res.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parentName, args) {
                return axios.post(`http://localhost:${PORT_DATA}/customers`, {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                .then(res => res.data);
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentName, args) {
                return axios.delete(`http://localhost:${PORT_DATA}/customers/${args.id}`, args)
                .then(res => res.data);
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt)},
                name: { type: new GraphQLNonNull(GraphQLString)},
                email: { type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parentName, args) {
                return axios.patch(`http://localhost:${PORT_DATA}/customers/${args.id}`, args)
                .then(res => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});