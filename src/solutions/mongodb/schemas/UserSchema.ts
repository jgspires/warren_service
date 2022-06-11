export class UserSchema {
  _id: string
  password: string

  // static mapToEntity(schema: MatchDaySchema): MatchDayProps {
  //   const entity: MatchDayProps = {
  //     _id: schema._id,
  //     matches_accepted: MatchSchema.mapToEntityCollection(schema.matches_accepted),
  //     matched: schema.matched ? schema.matched : false
  //   }
  //   return entity
  // }

  // static mapToSchema(entity: MatchDayProps): MatchDaySchema {
  //   const schema: MatchDaySchema = {
  //     _id: entity._id,
  //     matches_accepted: MatchSchema.mapToSchemaCollection(entity.matches_accepted),
  //     matched: entity.matched ? entity.matched : false
  //   }
  //   return schema
  // }
}
