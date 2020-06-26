module Types
  class DatasetType < BaseObject
    ANNOTATED_QUERIES = {
      nil   => nil,
      false => 'annotated_at is null',
      true  => 'annotated_at is not null'
    }

    field :id, Integer, null: false
    field :title, String, null: false

    field :entities, [DatasetEntityType], null: false

    field :texts, [DatasetTextType], null: false do
      argument :annotated, Boolean, required: false
    end
    def texts(annotated: nil)
      object.texts.where(ANNOTATED_QUERIES[annotated])
    end
  end
end
