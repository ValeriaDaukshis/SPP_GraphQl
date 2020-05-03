const schema = `
type User {
    _id: ID!
    userName: String
    password: String
    token: String
}

type Task {
    _id: ID!
    name: String
    deadline: String
    details: String
    isMade: Boolean
    user_id: ID!
}

input TaskInput {
    _id: ID!
    name: String
    deadline: String
    details: String
    isMade: Boolean
    user_id: ID!
}

type Query {
    GetTask(id: ID!):Task
    Tasks(user_id: ID!): [Task]
    SortedByNameTasks(user_id: ID!): [Task]
    UnfinishedTasks(user_id: ID!): [Task]
    SortedByDeadlineTasks(user_id: ID!): [Task]
}
type Mutation {
    registration(userName: String, password: String) : User
    login(userName: String, password: String) : User
    setStatus(id: ID!, status: Boolean): Task
    addTask(name: String, deadline: String, details: String, isMade: Boolean, user_id: ID!) : Task
    updateTask(id: ID!, name: String, deadline: String, details: String, isMade: Boolean, user_id: ID!) : Task
    deleteTask(id: ID!): Task
}
`;

module.exports.Schema = schema;