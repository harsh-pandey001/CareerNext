import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../../common/dto/paginated.model';
import { JobModel } from './job.model';

@ObjectType('PaginatedJobs')
export class PaginatedJobsModel extends Paginated(JobModel) {}
