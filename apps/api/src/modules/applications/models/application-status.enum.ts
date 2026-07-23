import { registerEnumType } from '@nestjs/graphql';
import { ApplicationStatus } from '@careernext/shared-types';

registerEnumType(ApplicationStatus, { name: 'ApplicationStatus' });

export { ApplicationStatus };
