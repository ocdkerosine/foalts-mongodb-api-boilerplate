import User from '../models/user.model'

export const signUpCredentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string', maxLength: 255 },
    firstName: { type: 'string', maxLength: 255 },
    lastName: { type: 'string', maxLength: 255 },
    phoneNumber: { type: 'string', maxLength: 255 },
    account: { 
      type: 'object' ,
      additionalProperties: false,
      properties: {
        type: { enum: User.schema.path('account.type').enumValues },
        subType: { enum: User.schema.path('account.subType').enumValues }
      }
    },
    verificationId: {
      type: 'object' ,
      additionalProperties: false,
      properties: {
        type: { type: 'string', maxLength: 255 },
        number: { type: 'string', maxLength: 255 }
      }
    },
    companyName: { type: 'string', maxLength: 255 },
    rcNumber: { type: 'number', maximum: 9999999999 }
  },
  required: [ 'email', 'password', 'firstName', 'lastName', 'phoneNumber', 'account' ],
  type: 'object',
  if: {
    properties: {
      account: {
        properties: {
          subType: {
            const: 'business'
          }
        }
      }
    }
  },
  then: {
    required: ['companyName', 'rcNumber']
  },
  else: {
    required: ['verificationId']
  }
}

export const signInCredentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string', maxLength: 255 }
  },
  required: [ 'email', 'password' ],
  type: 'object'
}