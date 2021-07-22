import { prop, pre, Ref, DocumentType, modelOptions,/* ReturnModelType, plugin,*/ buildSchema, addModelToTypegoose } from '@typegoose/typegoose'
import { hashPassword } from '@foal/core'
import { Industry, IdType, Badge, Product, BusinessType } from '.'
import * as mongoose from 'mongoose'
// import * as keywords from 'mongoose-keywords'
// import * as mdp from 'mongoose-deep-populate'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

// const deepPopulate = mdp(mongoose)

export enum AccountType { SELLER = 'seller', BUYER = 'buyer' }

export enum SubAccountType { INDIVIDUAL = 'individual', BUSINESS = 'business' }

enum Gender {  MALE = 'male', FEMALE = 'female' }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserClass extends TimeStamps {}

class UserAccountType {
  @prop({ required: true, trim: true, enum: AccountType })
  type!: AccountType
  @prop({ required: true, trim: true, enum: SubAccountType })
  subType!: SubAccountType
}

class UserVerification {
  @prop({ required: true, trim: true, ref: () => IdType })
  type!: Ref<IdType>
  @prop({ required: true, trim: true })
  number!: string
}

class UserAddress {
  @prop({ required: true, trim: true })
  address!: string;
  @prop({ required: true, trim: true })
  state!: string;
  @prop({ required: true, trim: true })
  city!: string;
  @prop({ required: true, trim: true })
  postalCode!: string;
  @prop({ required: true, trim: true })
  country!: string;
  @prop({ trim: true })
  countryCode!: string;
}

class UserBankDetails {
  @prop({ required: true, trim: true })
  name!: string;
  @prop({ required: true })
  number!: number;
  @prop({ required: true, trim: true })
  bank!: string;
}

class UserTransactionDetails {
  @prop({ default: 0.0 })
  withdrawable!: number;
  @prop({ default: 0.0 })
  settled!: number;
}

// @plugin(keywords, { paths: ['firstName', 'lastName', 'companyName'] })
// @plugin(deepPopulate)
@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (obj, ret) => { delete ret._id }
    },
    toObject: {
      virtuals: true,
      transform: (obj, ret) => { delete ret._id }
    }
  }
})
@pre<UserClass>('save', async function(next) {
  if (!this.password) return next()
  if (!this.isModified('password')) return next()
  this.password = await hashPassword(this.password)
})
export class UserClass extends Base {

  @prop()
  userId!: string;

  @prop({ required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @prop({ trim: true })
  password?: string;

  @prop({ required: true, trim: true })
  firstName!: string;

  @prop({ required: true, trim: true })
  lastName!: string;

  @prop({ required: function (this: DocumentType<UserClass>) { return this.account.subType === 'business' } })
  companyName!: string;

  @prop({ required: true, trim: true })
  phoneNumber!: string;

  @prop({  _id: false, type: UserAccountType, required: true })
  account!: UserAccountType;

  @prop({ _id: false, required: function (this: DocumentType<UserClass>) { return this.account.subType === 'individual' } })
  verificationId!: UserVerification;

  @prop({ required: function (this: DocumentType<UserClass>) { return this.account.subType === 'business' } })
  rcNumber!: number;

  @prop({ _id: false, trim: true, ref: () => Industry })
  industries?: Ref<Industry>[];

  @prop({ _id: false, type: UserAddress })
  address!: UserAddress

  @prop()
  region!: string;

  @prop({ default: false })
  isEmailVerified!: boolean;

  @prop({ default: false })
  isPhoneVerified!: boolean;

  @prop({ default: false })
  isBankVerified!: boolean;

  @prop({ _id: false, type: UserBankDetails })
  bankAccount!: UserBankDetails

  @prop({ _id: false, type: UserTransactionDetails })
  balance!: UserTransactionDetails

  @prop()
  avatar!: string;

  @prop()
  header!: string;

  @prop()
  dob!: string;

  @prop()
  about!: string;

  @prop({ enum: Gender })
  gender!: Gender;
  
  @prop()
  yearEstablshed!: string;
  
  @prop()
  numberOfEmployees!: string;

  @prop()
  summary!: string;

  @prop({ _id: false, trim: true, ref: () => BusinessType })
  businessType!: Ref<BusinessType>;

  @prop({ _id: false, trim: true, ref: () => Product })
  wishlist!: Ref<Product>[];

  @prop({ _id: false, trim: true, ref: () => Badge })
  certificationBadges!: Ref<Badge>[];

  @prop({ default: 0.0 })
  rating!: number;

  @prop({ default: false })
  admin!: boolean;

  @prop({ default: true })
  active!: boolean;

  view(this: DocumentType<UserClass>, full?: boolean): Record<string, unknown> {
    const view = {} as Record<string, unknown>
    let fields = ['id', 'userId', 'email', 'firstName', 'lastName', 'companyName', 'phoneNumber', 'account', 'admin', 'isEmailVerified', 'isPhoneVerified', 'avatar', 'header']
    if (full) {
      fields = [...fields, 'address', 'verificationId', 'rcNumber', 'rating', 'bankAccount',
        'balance', 'dob', 'industries', 'wishlist', 'businessType', 'yearEstablished',
        'numberOfEmployees', 'certificationBadges', 'about', 'gender', 'region', 'createdAt', 'updatedAt']
    }
    fields.forEach(field => { view[field] = this[field] })
    return view
  }
  // public static async findBySpecies(this: ReturnModelType<typeof KittenClass>, species: string) {
  //   return this.find({ species }).exec();
  // }
}
export const UserSchema = buildSchema(UserClass)
const User = addModelToTypegoose(mongoose.model('User', UserSchema), UserClass)

export default User