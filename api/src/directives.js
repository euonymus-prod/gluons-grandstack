import _ from "lodash";
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

      const context = args[2]
      const user = await getUser(context)
      const returnResult = authorizedResult(result, user)
      if (!returnResult) {
        throw new AuthenticationError("You are not authorized for this resource")
      }
      return returnResult
    };
  }
}

/****************************************/
/* Primitives                           */
/****************************************/
function isArray (data) {
  return Object.prototype.toString.call(data) === '[object Array]';
}
function isObject (data) {
  return typeof data === 'object' && data !== null && !isArray(data);
}
function hasParam(data, paramKey) {
  if (!isObject(data)) {
    return false
  }
  return (paramKey in data)
}
/****************************************/
/* User                                 */
/****************************************/
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
  if (hasAdminPermission(user)) {
    return true
  }
  return (user.uid === user_id)
}

/****************************************/
/* Authorization                        */
/****************************************/
function isAuthorized(result, user) {
  if (!hasParam(result, "is_private")) {
    throw new AuthenticationError("is_private is required")
  }
  if (!result.is_private) {
    return true
  }
  if (!hasParam(result, "user_id")) {
    throw new AuthenticationError("user_id is required")
  }
  if (hasUserPermission(user, result.user_id)) {
    return true
  }
  return false
}
function authorizedResult(result, user) {
  if (hasAdminPermission(user)) {
    return result
  }
  if (!result) {
    return null
  }
  if (isObject(result)) {
    return isAuthorized(result, user) ? result : null
  } else if (isArray(result)) {
    return _.filter(
      result.map(data => {
        try {
          return isAuthorized(data, user) ? data : null
        } catch(error) {
          return null
        }
      }),
      null
    )
  }
  return null
}

// export class HasRoleDirective extends SchemaDirectiveVisitor {
// 
//   // Declare @isAuthenticated schema directive
//   static getDirectiveDeclaration(directiveName, schema) {
//     return new GraphQLDirective({
//       name: "hasRole",
//       locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT],
//       args: {
//         roles: {
//           type: new GraphQLList(schema.getType("Role")),
//           defaultValue: ROLES.READER
//         }
//       }
//     });
//   }
//   
//   // Implementation for @hasRole when used on a field
//   visitObject(field) {
//     return this.visitorCondition(field)
//   }
//   visitFieldDefinition(field) {
//     return this.visitorCondition(field)
//   }
//   visitorCondition(field) {
//     const { resolve = defaultFieldResolver } = field;
//     const roles = this.args.roles;
//     field.resolve = async function(...args) {
//       let userRoles = ROLES.READER
//       let user = false // declare it outside of the try
//       try {
//         const idToken = getAuthorizationHeader(args[2]);
//         user = await firebaseInstance.getLoggedIn(idToken)
//         if (user) {
//           userRoles = user.is_admin ? ROLES.ADMIN : ROLES.USER
//         }
//       } catch(error) {
//         // Do Nothing
//       }
//       if (roles.some(role => userRoles.indexOf(role) !== -1)) {
//         const result = await resolve.apply(this, args);
//         if (hasPermission(result, userRoles, user.uid)) {
//           // result.objects = result.objects.filter( object => {
//           //   return hasPrivilege(object, userRoles, user.uid)
//           // })
//           return result
//         }
//       }
//       throw new AuthenticationError("You are not authorized for this resource")
//     };
//   }
// }
// 
// function hasPermission(result, userRoles, user_id = false) {
//   if (userRoles === ROLES.ADMIN) {
//     return true
//   }
//   if (!result) {
//     return true
//   }
//   if (!result.is_private) {
//     return true
//   }
//   if (userRoles === ROLES.USER) {
//     // let user_id = false
//     // if (fb_uid === 'qV183nzQ79MPRBidNFTCbUxCv1H2') {
//     //   user_id = 2
//     // }
//     if (user_id === result.user_id) {
//       return true
//     }
//   }
//   return false
// }
