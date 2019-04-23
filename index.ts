import {
    buildClientSchema, GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInterfaceType,
    GraphQLNamedType,
    GraphQLObjectType,
    printSchema
} from "graphql";
import {readFileSync} from "fs";

const content = readFileSync(process.argv[2]).toString();
const json = JSON.parse(content);
const schema = buildClientSchema({__schema: json});

const typeMap = schema.getTypeMap();
for (let typeKey in typeMap) {
    const type: GraphQLNamedType = typeMap[typeKey];
    type.description = undefined;
    if (type instanceof GraphQLEnumType) {
        type.getValues().forEach((v) => {
            v.description = undefined;
        })
    }
    if (type instanceof GraphQLObjectType ||
        type instanceof GraphQLInputObjectType ||
        type instanceof GraphQLInterfaceType) {
        const fields = type.getFields();
        for (let key in fields) {
            const field = fields[key];
            field.description = undefined;
        }
    }
    if (type instanceof GraphQLObjectType ||
        type instanceof GraphQLInterfaceType) {
        const fields = type.getFields();
        for (let key in fields) {
            const field = fields[key];
            field.args.forEach((f) => {
                f.description = undefined;
            })
        }
    }
}

console.log(printSchema(schema));