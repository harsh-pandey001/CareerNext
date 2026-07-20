import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from './user.model';

/**
 * Returned by register/login/refresh. The refresh token itself is never
 * included here — it's set as an httpOnly cookie (see auth.resolver.ts).
 */
@ObjectType('AuthPayload')
export class AuthPayloadModel {
  @Field()
  accessToken!: string;

  @Field(() => UserModel)
  user!: UserModel;
}
