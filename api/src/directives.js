import { SchemaDirectiveVisitor } from "graphql-tools";
import { GraphQLDirective, DirectiveLocation, defaultFieldResolver } from "graphql";
import { AuthenticationError } from 'apollo-server';
// import * as admin from 'firebase-admin';
import firebaseInstance from './firebase';


// const serviceAccount = require("../SAKey4dev.json");

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
      // Check for existence of auth token in header
      const ctx = args[2];
      if (!ctx || !ctx.headers || !ctx.headers.authorization) {
        throw new AuthenticationError("No authorization token." );
      }
      const token = ctx.headers.authorization;

      // Verify the token. If not properly signed an error will be thrown
      try {
        const idToken = token.replace("Bearer ", "");
        // admin.initializeApp({
        //   credential: admin.credential.cert(serviceAccount),
        //   databaseURL: process.env.FIREBASE_DATABASE_URL
        // });
        const decoded = firebaseInstance.verifyIdToken(idToken).catch( error => {
          // Handle error
          throw error
        })
        // const decoded = await admin.auth().verifyIdToken(idToken).catch( error => {
        //   // Handle error
        //   throw new AuthenticationError("ID TOKEN is not valid" );
        // })
        // console.log(decoded.uid)
        return resolve.apply(this, args);
      } catch (error) {
        throw error
      }
    };
  }
}
