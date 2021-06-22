const {  response, query } = require('express');
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, graphql} = require("graphql");

const users = [
    { id: 1, name: "Devendra", age: "25" },
    { id: 2, name: "Dev", age: "24" },
    { id: 3, name: "Dipak", age: "22" },
    { id: 4, name: "Vinay", age: "26" },
];
const UserType = new GraphQLObjectType({
    name: 'Users',
    description: '....',
    fields:{
        id: {
            type: GraphQLInt
        },
        name:{
            type: GraphQLString
        },
        age:{
            type: GraphQLString
        }
    }
})
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
    description: "...",
    fields:() =>({
        users: {
            type: new GraphQLList(UserType),
            resolve: (parent, args) =>{
                return users;
            }
        },
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLInt
                },  
            },
            resolve: (parent, {id}) =>{
                const user = users.filter(user => user.id == id);
                return user[0];
            }
        }

    })
    })
    
});
const app = express();
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.get("/",(req, res) =>{
    const query = `query {users{id name age}}`
    graphql(schema, '{users{id, name, age}}',query)
        .then(response => res.send(err))
        .catch(err => res.send(err));
})

app.get("/:id", (req, res) =>{
    const query = `query {user(id: ${req.params.id}) {id, name, age}}`;
    graphql(schema, query)
        .then(response => res.send(response))
        .catch(err => res.send(err));
})

app.listen(3000, () => console.log("listening at http://localhost:3000"));