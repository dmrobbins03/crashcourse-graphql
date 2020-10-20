const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema.js');

const PORT = process.env.PORT || 4000;
const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);  
})