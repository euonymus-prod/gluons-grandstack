import { SchemaDirectiveVisitor } from "graphql-tools";
import { GraphQLDirective, DirectiveLocation, GraphQLList, defaultFieldResolver } from "graphql";
import { AuthenticationError } from 'apollo-server';
import { firebaseInstance, getAuthorizationHeader } from './utils/firebase'
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

export class IsAuthorizedDirective extends SchemaDirectiveVisitor {
  // Declare @isAuthorized schema directive
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: "isAuthorized",
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT]
    });
  }
  
  // Implementation for @isAuthorized when used on a field
  visitObject(field) {
    return this.visitorCondition(field)
  }
  visitFieldDefinition(field) {
    return this.visitorCondition(field)
  }
  visitorCondition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const result = await resolve.apply(this, args);
      if (await hasPermission2(result, args[2])) {
        // result.objects = result.objects.filter( object => {
        //   return hasPrivilege(object, userRoles, user.uid)
        // })
        return result
      }
      throw new AuthenticationError("You are not authorized for this resource")
    };
  }
}

async function getUser(context) {
  let user = false // declare it outside of the try
  try {
    const idToken = getAuthorizationHeader(context);
    user = await firebaseInstance.getLoggedIn(idToken)
  } catch(error) {
    // Do nothing
  }
  return user
}
function hasAdminPermission(user) {
  return !!(user.is_admin)
}
function hasUserPermission(user, user_id) {
  if (hasAdminPermission) {
    return true
  }
  return (user.uid === user_id)
}
async function hasPermission2(result, context) {
  const user = await getUser(context)

  if (hasAdminPermission(user)) {
    return true
  }
  if (!result) {
    return true
  }
  if (typeof result.is_private === "undefined") {
    // MEMO: is_private is always required
    return false
  }
  if (!result.is_private) {
    return true
  }
  if (typeof result.user_id === "undefined") {
    // MEMO: user_id is always required, when checking user permission
    return false
  }
  if (hasUserPermission(user, result.user_id)) {
    return true
  }
  return false
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

function hasPermission(result, userRoles, user_id = false) {
  if (userRoles === ROLES.ADMIN) {
    return true
  }
  if (!result) {
    return true
  }
  if (!result.is_private) {
    return true
  }
  if (userRoles === ROLES.USER) {
    // let user_id = false
    // if (fb_uid === 'qV183nzQ79MPRBidNFTCbUxCv1H2') {
    //   user_id = 2
    // }
    if (user_id === result.user_id) {
      return true
    }
  }
  return false
}
