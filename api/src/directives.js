import { SchemaDirectiveVisitor } from "graphql-tools";
import { GraphQLDirective } from "graphql";
import { AuthorizationError, DirectiveLocation } from 'apollo-errors';

export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {

  // Declare @isAuthenticated schema directive
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: "isAuthenticated",
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT]
    });
  }
  
  // Implementation for @isAuthenticated when used on a field
  visitFieldDefinition(field) {
    field.resolve = async function(result, args, context, info) {
      // Check for existence of auth token in header
      if (!context || !context.headers || !context.headers.authorization) {
        throw new AuthorizationError({ message: "No authorization token." });
      }
      const token = context.headers.authorization;

      // Verify the token. If not properly signed an error will be thrown
      try {
        const id_token = token.replace("Bearer ", "");
        console.log('--------------------------')
        const decoded = "TODO"
        // return result[field.name];
        return "TODO"
      } catch (err) {
        throw new AuthorizationError({ message: "You are not authorized for this resource." });
      }
    };
  }
}
