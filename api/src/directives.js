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
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT]
    });
  }
  
  // Implementation for @isAuthenticated when used on a field
  visitObject(field) {
    return this.visitorCondition(field)
  }
  visitFieldDefinition(field) {
    return this.visitorCondition(field)
  }
  visitorCondition(field) {
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
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT],
      args: {
        roles: {
          type: new GraphQLList(schema.getType("Role")),
          defaultValue: ROLES.READER
        }
      }
    });
  }
  
  // Implementation for @hasRole when used on a field
  visitObject(field) {
    return this.visitorCondition(field)
  }
  visitFieldDefinition(field) {
    return this.visitorCondition(field)
  }
  visitorCondition(field) {
    const { resolve = defaultFieldResolver } = field;
    const roles = this.args.roles;
    field.resolve = async function(...args) {
      let userRoles = ROLES.READER
      let user = false // declare it outside of the try
      try {
        const idToken = getAuthorizationHeader(args[2]);
        user = await firebaseInstance.getLoggedIn(idToken)
        if (user) {
          userRoles = user.is_admin ? ROLES.ADMIN : ROLES.USER
        }
      } catch(error) {
        // Do Nothing
      }
      if (roles.some(role => userRoles.indexOf(role) !== -1)) {
        const result = await resolve.apply(this, args);
        if (hasPermission(result, userRoles, user.uid)) {
          // result.objects = result.objects.filter( object => {
          //   return hasPrivilege(object, userRoles, user.uid)
          // })
          return result
        }
      }
      throw new AuthenticationError("You are not authorized for this resource")
    };
  }
}

function hasPermission(result, userRoles, fb_uid = false) {
  if (userRoles === ROLES.ADMIN) {
    return true
  }
  if (!result.is_private) {
    return true
  }
  if (userRoles === ROLES.USER) {
    // TODO: ------------------------------
    let user_id = false
    if (fb_uid === 'qV183nzQ79MPRBidNFTCbUxCv1H2') {
      user_id = 2
    }
    // ------------------------------------
    if (user_id === result.user_id) {
      return true
    }
  }
  return false
}

// Check for existence of auth token in header
function getAuthorizationHeader(context) {
  if (!context || !context.headers || !context.headers.authorization) {
    throw new AuthenticationError("No authorization token." );
  }
  const token = context.headers.authorization;
  return token.replace("Bearer ", "");
}
