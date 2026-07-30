import { registerEnumType } from '@nestjs/graphql';
import { ApplicationMode } from '@careernext/shared-types';

registerEnumType(ApplicationMode, { name: 'ApplicationMode' });

export { ApplicationMode };
