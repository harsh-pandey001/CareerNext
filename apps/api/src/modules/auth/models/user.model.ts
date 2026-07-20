import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import type { User as PrismaUser } from '@prisma/client';
import { UserRole } from '@careernext/shared-types';

registerEnumType(UserRole, { name: 'UserRole' });

/**
 * Safe, public-facing User shape exposed over GraphQL — never includes
 * `passwordHash` or other sensitive fields from the Prisma model.
 */
@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => UserRole)
  role!: UserRole;

  @Field()
  isEmailVerified!: boolean;

  @Field()
  createdAt!: Date;
}

export function toUserModel(user: PrismaUser): UserModel {
  const model = new UserModel();
  model.id = user.id;
  model.email = user.email;
  model.firstName = user.firstName;
  model.lastName = user.lastName;
  model.role = user.role as unknown as UserRole;
  model.isEmailVerified = user.isEmailVerified;
  model.createdAt = user.createdAt;
  return model;
}
