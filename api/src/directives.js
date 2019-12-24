import { SchemaDirectiveVisitor } from "graphql-tools";
import { GraphQLDirective, DirectiveLocation, GraphQLList, defaultFieldResolver } from "graphql";
import { AuthenticationError } from 'apollo-server';
import firebaseInstance from './firebase';
import * as ROLES from './constants/roles'


export class IsAuthenticatedDirective extends SchemaDirectiveVisitor {

  // Declare @isAuthenticated schema directive
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: "isAuthenticated",
      // locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT]
      locations: [DirectiveLocation.FIELD_DEFINITION]
      // locations: [DirectiveLocation.OBJECT]
    });
  }
  
  // Implementation for @isAuthenticated when used on a field
  visitFieldDefinition(field) {
    // visitObject(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      // Verify the token. If not properly signed an error will be thrown
      try {
        // Check for existence of auth token in header
        const idToken = getAuthorizationHeader(args[2]);
        firebaseInstance.verifyIdToken(idToken).catch( error => {
          // Handle error
          throw error
        })
        return resolve.apply(this, args);
      } catch (error) {
        throw error
      }
    };
  }
}

export class HasRoleDirective extends SchemaDirectiveVisitor {

  // Declare @isAuthenticated schema directive
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: "hasRole",
      locations: [DirectiveLocation.FIELD_DEFINITION],
      args: {
        roles: {
          type: new GraphQLList(schema.getType("Role"))
        }
      }
    });
  }
  
  // Implementation for @hasRole when used on a field
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const roles = this.args.roles;
    field.resolve = async function(...args) {
      let userRoles = ROLES.READER
      // Check for existence of auth token in header
      try {
        const idToken = getAuthorizationHeader(args[2]);
        const user = await firebaseInstance.getLoggedIn(idToken)
        if (user) {
          userRoles = user.is_admin ? ROLES.ADMIN : ROLES.USER
        }
      } catch(error) {
        // Do Nothing
      }
      if (roles.some(role => userRoles.indexOf(role) !== -1)) {
        const result = resolve.apply(this, args);
        return result;
      }
      throw new AuthenticationError("You are not authorized for this resource")
    };
  }
}

function getAuthorizationHeader(context) {
  if (!context || !context.headers || !context.headers.authorization) {
    throw new AuthenticationError("No authorization token." );
  }
  const token = context.headers.authorization;
  return token.replace("Bearer ", "");
}
