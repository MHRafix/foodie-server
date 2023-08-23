import { CommonMatchInput, MatchOperator } from '../dto/CommonFindOneDto';
import { WHERE_OPERATOR } from '../dto/CommonPaginationDto';

export const mongodbFindObjectBuilder = (filter: CommonMatchInput) => {
  switch (filter.operator) {
    case MatchOperator.eq:
      return { [filter.key]: filter.value };
    case MatchOperator.ne:
      return { [filter.key]: { $ne: filter.value } };
    case MatchOperator.gt:
      return { [filter.key]: { $gt: filter.value } };
    case MatchOperator.gte:
      return { [filter.key]: { $gte: filter.value } };
    case MatchOperator.lt:
      return { [filter.key]: { $lt: filter.value } };
    case MatchOperator.lte:
      return { [filter.key]: { $lte: filter.value } };
    case MatchOperator.in:
      if (!filter.value) {
        return {};
      }
      return { [filter.key]: { $in: filter.value.split(',') } };
    case MatchOperator.nin:
      if (!filter.value) {
        return {};
      }
      return { [filter.key]: { $nin: filter.value.split(',') } };
    case MatchOperator.exists:
      return { [filter.key]: { $exists: StringToBoolean(filter.value) } };
    case MatchOperator.contains:
      if (!filter.value) {
        return {};
      }
      return { [filter.key]: { $regex: filter.value, $options: 'i' } };
    default:
      return { [filter.key]: filter.value };
  }
};

const StringToBoolean = (value: string) => {
  return value === 'true';
};

export const filterBuilder = (
  filters: CommonMatchInput[],
  multiFilterOperator: WHERE_OPERATOR,
) => {
  const where = {};

  where[multiFilterOperator ? `$${multiFilterOperator}` : `$and`] =
    filters?.map((f) => {
      return mongodbFindObjectBuilder(f);
    }) || [];

  return where;
};

export const mongoDbMultiFilterBuilder = ({
  filters,
  multiFilterOperator,
  preFilter,
}: any) => {
  const where = {};
  const whereConditions =
    filters?.map((f) => {
      return mongodbFindObjectBuilder(f);
    }) || [];

  const andOr = multiFilterOperator ? `$${multiFilterOperator}` : `$and`;

  if (preFilter) {
    where['$and'] = [{ [andOr]: whereConditions }, preFilter];
  }
  if (!preFilter && whereConditions.length > 0) {
    where[andOr] = whereConditions;
  }

  return where;
};
